export interface EbirdTaxonomia {
  speciesCode: string;
  comName: string;
  sciName: string;
  category: string;
  familyComName?: string;
  familySciName?: string;
  order?: string;
}

export interface AveRespuesta {
  codigoEspecie: string;
  nombreComun: string;
  nombreCientifico: string;
  categoria: string;
  familiaComun: string | null;
  familiaCientifica: string | null;
  orden: string | null;
  imagenUrl?: string;
}
