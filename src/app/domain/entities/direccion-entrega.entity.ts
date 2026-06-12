export class DireccionEntrega {
  constructor(
    public direccionEntregaID: number,
    public ventaID: number,
    public mismaDireccion: boolean,
    public calle: string | null,
    public numeroExterior: string | null,
    public numeroInterior: string | null,
    public entreCalles: string | null,
    public referencias: string | null,
    public codigoPostal: string | null,
    public colonia: string | null,
    public delegacionMunicipio: string | null,
    public estado: string | null,
    public direccionCompleta: string | null
  ) {}
}
