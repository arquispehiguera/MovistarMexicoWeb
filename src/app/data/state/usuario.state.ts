import { Injectable, signal } from '@angular/core';
import { Usuario } from '../../domain/entities/usuario.entity';
import { PagedResult } from '../../domain/models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class UsuarioState {
  readonly usuarios = signal<Usuario[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly pagedResult = signal<PagedResult<Usuario> | null>(null);
}
