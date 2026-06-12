import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PerfilRepository } from '../../domain/repositories/perfil.repository';
import { Perfil } from '../../domain/entities/perfil.entity';
import { PagedResult } from '../../domain/models/paged-result.model';
import { QueryParameters } from '../../domain/models/query-parameters.model';
import { ApiResponse } from '../../domain/models/api-response.model';
import { PerfilState } from '../state/perfil.state';
import { PerfilMapper } from '../../domain/mappers/perfil.mapper';

@Injectable()
export class PerfilRepositoryImpl extends PerfilRepository {
  private readonly apiUrl = `${environment.apiUrl}/Rol`;
  private readonly state = inject(PerfilState);

  get perfiles() { return this.state.perfiles; }
  get loading() { return this.state.loading; }
  get error() { return this.state.error; }
  get pagedResult() { return this.state.pagedResult; }

  constructor(private http: HttpClient) {
    super();
  }

  getPerfiles(): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<any[]>>(this.apiUrl).pipe(
      map(response => {
        const perfiles = response?.data?.map(data => PerfilMapper.fromDto(data)) || [];
        this.state.perfiles.set(perfiles);
      }),
      catchError(err => {
        this.state.error.set('Error al cargar perfiles');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  getPerfilesPaged(params: QueryParameters): Observable<PagedResult<Perfil>> {
    this.state.loading.set(true);
    this.state.error.set(null);

    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber.toString())
      .set('pageSize', params.pageSize.toString());

    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }

    if (params.sortDirection) {
      httpParams = httpParams.set('sortDirection', params.sortDirection);
    }

    if (params.searchTerm) {
      httpParams = httpParams.set('searchTerm', params.searchTerm);
    }

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/paged`, { params: httpParams }).pipe(
      map(response => {
        const paged = response.data;
        const perfiles = paged?.data?.map((data: any) => PerfilMapper.fromDto(data)) || [];

        const pagedResult: PagedResult<Perfil> = {
          data: perfiles,
          totalCount: paged?.totalCount || 0,
          pageNumber: paged?.pageNumber || params.pageNumber,
          pageSize: paged?.pageSize || params.pageSize,
          totalPages: paged?.totalPages || 0,
          hasPrevious: paged?.hasPrevious || false,
          hasNext: paged?.hasNext || false
        };

        return pagedResult;
      }),
      tap(pagedResult => {
        // Actualizar signals para mantener compatibilidad
        this.state.pagedResult.set(pagedResult);
      }),
      catchError(err => {
        console.error('Error al obtener perfiles paginados:', err);
        this.state.error.set('Error al cargar perfiles');
        this.state.pagedResult.set(null);
        return of({
          data: [],
          totalCount: 0,
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          totalPages: 0,
          hasPrevious: false,
          hasNext: false
        });
      }),
      finalize(() => this.state.loading.set(false))
    );
  }
}
