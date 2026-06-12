export class CicloFacturacion {
  constructor(
    public cicloFacturacionId: number,
    public codigo: string,
    public activo: boolean,
    public fechaCreacion: Date
  ) {}
}
