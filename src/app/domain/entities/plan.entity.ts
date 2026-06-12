export class Plan {
  constructor(
    public planId: number,
    public nombre: string,
    public activo: boolean,
    public fechaCreacion: Date
  ) {}
}
