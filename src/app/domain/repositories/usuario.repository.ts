import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../entities/usuario.entity';
import { PagedResult } from '../models/paged-result.model';
import { QueryParameters } from '../models/query-parameters.model';

export abstract class UsuarioRepository {

  abstract usuarios: Signal<Usuario[]>;
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;
  abstract pagedResult: Signal<PagedResult<Usuario> | null>;

  abstract getUsuarios(): Observable<void>;
  abstract getUsuarioById(id: number): Observable<Usuario>;
  abstract getUsuariosPaged(params: QueryParameters): Observable<PagedResult<Usuario>>;

  // 🔥 CREATE alineado al backend
  abstract createUsuario(data: {
    rolID: number;
    nombreUsuario: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno?: string | null;
    email: string;
    activo: boolean;
  }): Observable<Usuario>;

  abstract updateUsuario(
    idUsuario: number,
    data: Partial<Usuario>
  ): Observable<Usuario>;

  abstract updateConnectionStatus(
    idUsuario: number,
    data: { lastConnection: string; isLogged: boolean }
  ): Observable<void>;
}
