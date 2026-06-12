import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { QueryParameters } from '../models/query-parameters.model';
import { PagedResult } from '../models/paged-result.model';
import { Usuario } from '../entities/usuario.entity';

@Injectable({ providedIn: 'root' })
export class GetUsuariosUseCase {
  constructor(private usuarioRepository: UsuarioRepository) {}

  execute(): Observable<void> {
    return this.usuarioRepository.getUsuarios();
  }
}

@Injectable({ providedIn: 'root' })
export class GetUsuarioByIdUseCase {
  constructor(private usuarioRepository: UsuarioRepository) {}

  execute(id: number): Observable<Usuario> {
    return this.usuarioRepository.getUsuarioById(id);
  }
}

@Injectable({ providedIn: 'root' })
export class GetUsuariosPagedUseCase {
  constructor(private usuarioRepository: UsuarioRepository) {}

  execute(params: QueryParameters): Observable<PagedResult<Usuario>> {
    return this.usuarioRepository.getUsuariosPaged(params);
  }
}

@Injectable({ providedIn: 'root' })
export class CreateUsuarioUseCase {
  constructor(private usuarioRepository: UsuarioRepository) {}

  execute(data: {
    rolID: number;
    nombreUsuario: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno?: string | null;
    email: string;
    activo: boolean;
  }): Observable<Usuario> {
    return this.usuarioRepository.createUsuario(data);
  }
}

@Injectable({ providedIn: 'root' })
export class UpdateUsuarioUseCase {
  constructor(private usuarioRepository: UsuarioRepository) {}

  execute(idUsuario: number, data: Partial<Usuario>): Observable<Usuario> {
    return this.usuarioRepository.updateUsuario(idUsuario, data);
  }
}
