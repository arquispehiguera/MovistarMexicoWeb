export interface CreateRegistroVentaDto {
  usuarioID: number;
  producto: string;
  numeroPortar: string | null;
  dn: string | null;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  fechaNacimiento: string | null;
  telfContacto1: string | null;
  telfContacto2: string | null;
  companiaDonante: string | null;
  tipoLinea: string | null;
  correoElectronico: string | null;
  numero: string | null;
  ine: string | null;
  curp: string | null;
  rfc: string | null;
  nip: string | null;
  metodoEntrega: string | null;
  ciclosFacturacion: string | null;
  plan: string | null;
  planOriginal: string | null;
  planDcto: string | null;
  observaciones: string | null;
  fechaRegistro: Date | string | null;
  fechaIngestion: string | null;
  fechaFinIngestion: string | null;
  tematicoID: number | null;
}

export interface DireccionCompletoPayload {
  calle: string | null;
  numeroExterior: string | null;
  numeroInterior: string | null;
  entreCalles: string | null;
  referencias: string | null;
  codigoPostal: string | null;
  colonia: string | null;
  delegacionMunicipio: string | null;
  estado: string | null;
  direccionCompleta: string | null;
  cav?: string | null;
}

export interface CreateRegistroVentaCompletoDto {
  venta: {
    usuarioID: number;
    tematicoID: number | null;
    producto: string;
    numeroPortar: string | null;
    dn: string | null;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string | null;
    fechaNacimiento: string | null;
    telfContacto1: string | null;
    telfContacto2: string | null;
    companiaDonante: string | null;
    tipoLinea: string | null;
    correoElectronico: string | null;
    numero: string | null;
    ine: string | null;
    curp: string | null;
    rfc: string | null;
    nip: string | null;
    metodoEntrega: string | null;
    ciclosFacturacion: string | null;
    plan: string | null;
    planOriginal: string | null;
    planDcto: string | null;
    observaciones: string | null;
    fvc: string | null;
    fechaInicioGestion: string | null;
    fechaFinGestion: string | null;
    fechaRegistro: string | null;
  };
  direccionEntrega: DireccionCompletoPayload;
  direccionFacturacion: DireccionCompletoPayload;
}
