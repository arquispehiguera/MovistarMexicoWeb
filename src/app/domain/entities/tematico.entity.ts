export class Tematico {
  constructor(
    public tematicoID: number,
    public resultado: string,
    public motivo: string,
    public activo: boolean,
    public fechaCreacion: Date
  ) {}
}
