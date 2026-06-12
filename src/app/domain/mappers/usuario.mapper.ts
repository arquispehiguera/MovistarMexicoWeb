import { Usuario } from '../entities/usuario.entity';
import { AuthResponse } from '../dtos/login-response.dto';

export class UsuarioMapper {
  static fromDto(data: any): Usuario {
    return new Usuario(
      data.usuarioID,
      data.rolID,
      data.nombreUsuario,
      data.nombres,
      data.apellidoPaterno,
      data.apellidoMaterno ?? null,
      data.email,
      data.activo ?? true,
      new Date(data.fechaCreacion),
      data.usuarioCreacion ?? 'SYSTEM',
      data.grantDelete ?? 0,
      data.isLogged ?? false,
      data.lastConnection ?? null
    );
  }

  static fromAuthResponse(response: AuthResponse): Usuario {
    const apellidos = response.lastName?.split(' ') || [];
    const apellidoPaterno = apellidos[0] || '';
    const apellidoMaterno = apellidos.slice(1).join(' ') || null;

    return new Usuario(
      response.usuarioID,
      response.rolID,
      response.username,
      response.firstName,
      apellidoPaterno,
      apellidoMaterno,
      response.email,
      true,
      new Date(),
      'SYSTEM',
      response.grantDelete ?? 0,
      response.isLogged || false,
      response.lastConnection || null
    );
  }

  static fromStorage(raw: unknown): Usuario | null {
    if (!raw || typeof raw !== 'object') return null;

    try {
      const userData = raw as Record<string, unknown>;

      if (
        typeof userData['usuarioID'] !== 'number' ||
        typeof userData['rolID'] !== 'number' ||
        typeof userData['nombreUsuario'] !== 'string' ||
        typeof userData['nombres'] !== 'string' ||
        typeof userData['apellidoPaterno'] !== 'string' ||
        typeof userData['email'] !== 'string' ||
        typeof userData['activo'] !== 'boolean' ||
        typeof userData['usuarioCreacion'] !== 'string'
      ) {
        return null;
      }

      return new Usuario(
        userData['usuarioID'],
        userData['rolID'],
        userData['nombreUsuario'],
        userData['nombres'],
        userData['apellidoPaterno'],
        (userData['apellidoMaterno'] as string | null) ?? null,
        userData['email'],
        userData['activo'],
        new Date(userData['fechaCreacion'] as string),
        userData['usuarioCreacion'],
        (userData['grantDelete'] as number | undefined) ?? 0,
        userData['isLogged'] as boolean | undefined,
        userData['lastConnection'] as string | null | undefined
      );
    } catch {
      return null;
    }
  }
}
