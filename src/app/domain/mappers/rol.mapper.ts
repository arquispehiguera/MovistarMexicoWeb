import { Rol } from '../entities/rol.entity';

export class RolMapper {
  static fromDto(data: any): Rol {
    return new Rol(
      data.rolID,
      data.codigoRol,
      data.nombreRol,
      data.descripcion,
      data.activo,
      data.fechaCreacion,
      data.usuarioCreacion
    );
  }
}
