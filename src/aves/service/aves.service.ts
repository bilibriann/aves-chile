import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AveRespuesta, EbirdTaxonomia } from '../types/aves.types';

interface CacheImagenes {
  url?: string;
  timestamp: number;
}

interface WikimediaSearchResponse {
  query?: {
    search?: Array<{ title: string }>;
  };
}

interface WikimediaImageResponse {
  query?: {
    pages?: Record<
      string,
      {
        imageinfo?: Array<{ url: string }>;
      }
    >;
  };
}

@Injectable()
export class AvesService {
  private readonly urlBase = 'https://api.ebird.org/v2';
  private readonly wikimediaUrl = 'https://commons.wikimedia.org/w/api.php';
  private readonly cacheImagenes = new Map<string, CacheImagenes>();
  private readonly TTL_CACHE = 24 * 60 * 60 * 1000; // 24 horas
  private readonly MAX_CONCURRENT = 5;
  private currentRequests = 0;
  private listadoAvesChile: AveRespuesta[] | null = null;
  private timestampListado = 0;
  private readonly TTL_LISTADO = 12 * 60 * 60 * 1000; // 12 horas

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async obtenerListadoChile(): Promise<AveRespuesta[]> {
    // Retornar caché si está vigente
    if (
      this.listadoAvesChile &&
      Date.now() - this.timestampListado < this.TTL_LISTADO
    ) {
      return this.listadoAvesChile;
    }

    try {
      const claveApi = this.configService.get<string>('EBIRD_API_KEY');

      if (!claveApi) {
        throw new InternalServerErrorException(
          'No existe la clave EBIRD_API_KEY en el archivo .env',
        );
      }

      const respuestaEspecies = await firstValueFrom(
        this.httpService.get<string[]>(`${this.urlBase}/product/spplist/CL`, {
          headers: {
            'X-eBirdApiToken': claveApi,
          },
        }),
      );

      const codigosChile = new Set(respuestaEspecies.data);

      const respuestaTaxonomia = await firstValueFrom(
        this.httpService.get<EbirdTaxonomia[]>(
          `${this.urlBase}/ref/taxonomy/ebird`,
          {
            headers: {
              'X-eBirdApiToken': claveApi,
            },
            params: {
              fmt: 'json',
              locale: 'es',
            },
          },
        ),
      );

      const avesChile = respuestaTaxonomia.data.filter((ave) =>
        codigosChile.has(ave.speciesCode),
      );

      // Retornar sin imágenes para rapidez (evitar búsquedas lentas)
      const aves = avesChile.map((ave) => ({
        codigoEspecie: ave.speciesCode,
        nombreComun: ave.comName,
        nombreCientifico: ave.sciName,
        categoria: ave.category,
        familiaComun: ave.familyComName ?? null,
        familiaCientifica: ave.familySciName ?? null,
        orden: ave.order ?? null,
      }));

      // Cachear listado
      this.listadoAvesChile = aves;
      this.timestampListado = Date.now();

      return aves;
    } catch (error) {
      console.error('Error en obtenerListadoChile:', error);
      throw new InternalServerErrorException(
        'No se pudo obtener el listado de aves de Chile',
      );
    }
  }

  async buscarAvePorNombre(nombre: string): Promise<AveRespuesta[]> {
    try {
      const aves = await this.obtenerListadoChile();
      const texto = (nombre ?? '').trim().toLowerCase();

      if (!texto) {
        return aves;
      }

      return aves.filter((ave) => {
        const nombreComun = ave.nombreComun.toLowerCase();
        const nombreCientifico = ave.nombreCientifico.toLowerCase();

        return nombreComun.includes(texto) || nombreCientifico.includes(texto);
      });
    } catch (error) {
      console.error('Error en buscarAvePorNombre:', error);
      throw new InternalServerErrorException('No se pudo buscar el ave');
    }
  }

  async obtenerAvesConImagenes(): Promise<AveRespuesta[]> {
    try {
      const aves = await this.obtenerListadoChile();

      // Limitar a máximo 50 aves para no sobrecargar
      const avesLimitadas = aves.slice(0, 50);

      const avesConImagenes =
        await this.buscarImagenesConControl(avesLimitadas);
      return avesConImagenes;
    } catch (error) {
      console.error('Error en obtenerAvesConImagenes:', error);
      throw new InternalServerErrorException(
        'No se pudo obtener aves con imágenes',
      );
    }
  }

  private async buscarImagenesConControl(
    aves: AveRespuesta[],
  ): Promise<AveRespuesta[]> {
    const resultado: AveRespuesta[] = [];

    for (const ave of aves) {
      // Controlar concurrencia
      while (this.currentRequests >= this.MAX_CONCURRENT) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const imagenUrl = await this.obtenerImagenWikimedia(ave.nombreComun);
      resultado.push({
        ...ave,
        imagenUrl,
      });
    }

    return resultado;
  }

  private async obtenerImagenWikimedia(
    nombreComun: string,
  ): Promise<string | undefined> {
    // Verificar caché
    const cached = this.cacheImagenes.get(nombreComun);
    if (cached && Date.now() - cached.timestamp < this.TTL_CACHE) {
      return cached.url;
    }

    this.currentRequests++;

    try {
      const response = await firstValueFrom(
        this.httpService.get<WikimediaSearchResponse>(this.wikimediaUrl, {
          params: {
            action: 'query',
            list: 'search',
            srsearch: nombreComun,
            srnamespace: '6', // File namespace
            srlimit: 1,
            format: 'json',
          },
        }),
      );

      const resultados = response.data?.query?.search;
      if (!resultados || resultados.length === 0) {
        // Cachear resultado negativo
        this.cacheImagenes.set(nombreComun, {
          url: undefined,
          timestamp: Date.now(),
        });
        return undefined;
      }

      const nombreArchivo = resultados[0].title;
      const infoResponse = await firstValueFrom(
        this.httpService.get<WikimediaImageResponse>(this.wikimediaUrl, {
          params: {
            action: 'query',
            titles: `File:${nombreArchivo}`,
            prop: 'imageinfo',
            iiprop: 'url',
            format: 'json',
          },
        }),
      );

      const pages = infoResponse.data?.query?.pages;
      if (!pages) {
        return undefined;
      }

      const firstPage = Object.values(pages)[0];
      const imagenUrl = firstPage?.imageinfo?.[0]?.url;

      // Cachear resultado positivo
      this.cacheImagenes.set(nombreComun, {
        url: imagenUrl,
        timestamp: Date.now(),
      });

      return imagenUrl;
    } catch (error) {
      console.warn(
        `No se encontró imagen en Wikimedia para: ${nombreComun}`,
        error,
      );
      return undefined;
    } finally {
      this.currentRequests--;
    }
  }
}
