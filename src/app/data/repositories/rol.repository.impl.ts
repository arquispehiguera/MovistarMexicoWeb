import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { RolRepository } from '../../domain/repositories/rol.repository';
import { Rol } from '../../domain/entities/rol.entity';
import { ApiResponse } from '../../domain/models/api-response.model';
import { RolState } from '../state/rol.state';
import { RolMapper } from '../../domain/mappers/rol.mapper';

@Injectable()
export class RolRepositoryImpl extends RolRepository {
  private readonly apiUrl = `${environment.apiUrl}/Rol`;
  private readonly state = inject(RolState);

  get roles() { return this.state.roles; }
  get loading() { return this.state.loading; }
  get error() { return this.state.error; }

  constructor(private http: HttpClient) {
    super();
  }

  getRoles(): Observable<Rol[]> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<any[]>>(this.apiUrl).pipe(
      map(response => {
        const roles = response.data.map(data => RolMapper.fromDto(data));
        this.state.roles.set(roles);
        return roles;
      }),
      catchError(err => {
        this.state.error.set('Error al obtener roles');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }
}
