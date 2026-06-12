import { Injectable, signal } from '@angular/core';
import { Perfil } from '../../domain/entities/perfil.entity';
import { PagedResult } from '../../domain/models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class PerfilState {
  readonly perfiles = signal<Perfil[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly pagedResult = signal<PagedResult<Perfil> | null>(null);
}
