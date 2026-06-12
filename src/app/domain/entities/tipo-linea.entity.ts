export class TipoLinea {
  constructor(
    public tipoLineaId: number,
    public nombre: string,
    public activo: boolean,
    public fechaCreacion: Date
  ) {}
}
