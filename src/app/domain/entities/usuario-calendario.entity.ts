export class UsuarioCalendario {
  constructor(
    public usuarioCalendarioID: number,
    public usuarioID: number,
    public calendarioID: number,
    public activo: boolean,
    public fechaAsignacion: Date
  ) {}
}
