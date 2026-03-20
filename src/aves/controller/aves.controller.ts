import { Controller, Get, Query } from '@nestjs/common';
import { AvesService } from '../service/aves.service';
import { BuscarAveDto } from '../dto/buscar-ave.dto';

@Controller('aves')
export class AvesController {
  constructor(private readonly avesService: AvesService) {}

  @Get()
  obtenerTodas() {
    return this.avesService.obtenerListadoChile();
  }

  @Get('con-imagenes')
  obtenerConImagenes() {
    return this.avesService.obtenerAvesConImagenes();
  }

  @Get('buscar')
  buscarPorNombre(@Query() query: BuscarAveDto) {
    return this.avesService.buscarAvePorNombre(query.nombre ?? '');
  }
}
