

export class Usuario {
  constructor(
    public usuarioID: number,
    public rolID: number,
    public nombreUsuario: string,
    public nombres: string,
    public apellidoPaterno: string,
    public apellidoMaterno: string | null,
    public email: string,
    public activo: boolean,
    public fechaCreacion: Date,
    public usuarioCreacion: string,
    public grantDelete?: number,
    public isLogged?: boolean,
    public lastConnection?: Date | string | null
  ) {}
}
