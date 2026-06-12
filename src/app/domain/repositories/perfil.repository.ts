import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Perfil } from '../entities/perfil.entity';
import { PagedResult } from '../models/paged-result.model';
import { QueryParameters } from '../models/query-parameters.model';

export abstract class PerfilRepository {
  abstract perfiles: Signal<Perfil[]>;
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;
  abstract pagedResult: Signal<PagedResult<Perfil> | null>;

  abstract getPerfiles(): Observable<void>;
  abstract getPerfilesPaged(params: QueryParameters): Observable<PagedResult<Perfil>>;
}
