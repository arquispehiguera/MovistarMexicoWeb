export class Calendario {
  constructor(
    public calendarioID: number,
    public nombreCalendario: string,
    public descripcion: string,
    public horaInicio: string,
    public horaFin: string,
    public diasAnticipacionMaxima: number,
    public intervaloSlots: number,
    public activo: boolean,
    public fechaCreacion: Date,
    public usuarioCreacion: string
  ) {}
}
