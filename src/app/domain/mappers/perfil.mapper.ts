import { Perfil } from '../entities/perfil.entity';

export class PerfilMapper {
  static fromDto(data: any): Perfil {
    return new Perfil(
      data.rolID,
      data.codigoRol,
      data.nombreRol,
      data.descripcion,
      data.activo ?? true,
      new Date(data.fechaCreacion),
      data.usuarioCreacion ?? 'SYSTEM'
    );
  }
}
