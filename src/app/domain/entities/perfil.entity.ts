export class Perfil {
  constructor(
    public rolID: number,
    public codigoRol: string,
    public nombreRol: string,
    public descripcion: string,
    public activo: boolean,
    public fechaCreacion: Date,
    public usuarioCreacion: string
  ) {}
}
