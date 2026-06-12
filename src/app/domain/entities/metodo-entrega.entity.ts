export class MetodoEntrega {
  constructor(
    public metodoEntregaId: number,
    public nombre: string,
    public activo: boolean,
    public fechaCreacion: Date
  ) {}
}
