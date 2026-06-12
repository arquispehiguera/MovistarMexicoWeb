import { UsuarioCalendario } from '../entities/usuario-calendario.entity';

export class UsuarioCalendarioMapper {
  static fromDto(data: any): UsuarioCalendario {
    return new UsuarioCalendario(
      data.usuarioCalendarioID,
      data.usuarioID,
      data.calendarioID,
      data.activo ?? true,
      new Date(data.fechaAsignacion)
    );
  }
}
