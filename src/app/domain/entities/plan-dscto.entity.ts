export class PlanDscto {
  constructor(
    public planDsctoId: number,
    public nombre: string,
    public monto: number,
    public activo: boolean,
    public fechaCreacion: Date
  ) {}
}
