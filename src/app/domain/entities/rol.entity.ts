export class Rol {
  constructor(
    public rolID: number,
    public codigoRol: string,
    public nombreRol: string,
    public descripcion: string,
    public activo: boolean,
    public fechaCreacion: string,
    public usuarioCreacion: string
  ) {}
}
