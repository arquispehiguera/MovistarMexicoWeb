import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap, finalize } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UsuarioRepository } from '../../domain/repositories/usuario.repository';
import { Usuario } from '../../domain/entities/usuario.entity';
import { PagedResult } from '../../domain/models/paged-result.model';
import { QueryParameters } from '../../domain/models/query-parameters.model';
import { ApiResponse } from '../../domain/models/api-response.model';
import { UsuarioState } from '../state/usuario.state';
import { UsuarioMapper } from '../../domain/mappers/usuario.mapper';

@Injectable()
export class UsuarioRepositoryImpl extends UsuarioRepository {

  private readonly apiUrl = `${environment.apiUrl}/Usuario`;
  private readonly state = inject(UsuarioState);

  get usuarios() { return this.state.usuarios; }
  get loading() { return this.state.loading; }
  get error() { return this.state.error; }
  get pagedResult() { return this.state.pagedResult; }

  constructor(private http: HttpClient) {
    super();
  }

  // =========================
  // GET ALL
  // =========================
  getUsuarios(): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<any[]>>(this.apiUrl).pipe(
      map(response => {
        const usuarios = response?.data?.map(data => UsuarioMapper.fromDto(data)) || [];
        this.state.usuarios.set(usuarios);
      }),
      catchError(err => {
        this.state.error.set('Error al cargar usuarios');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }



  // =========================
  // GET BY ID
  // =========================
  getUsuarioById(id: number): Observable<Usuario> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map(response => UsuarioMapper.fromDto(response.data)),
      catchError(err => {
        this.state.error.set('Error al cargar usuario');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  // =========================
  // PAGED
  // =========================
  getUsuariosPaged(params: QueryParameters): Observable<PagedResult<Usuario>> {
    this.state.loading.set(true);
    this.state.error.set(null);

    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber.toString())
      .set('pageSize', params.pageSize.toString());

    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);
    if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/paged`, { params: httpParams }).pipe(
      map(res => ({
        data: res.data.data.map((u: any) => UsuarioMapper.fromDto(u)),
        totalCount: res.data.totalCount,
        pageNumber: res.data.pageNumber,
        pageSize: res.data.pageSize,
        totalPages: res.data.totalPages,
        hasPrevious: res.data.hasPrevious,
        hasNext: res.data.hasNext
      })),
      tap(result => {
        this.state.pagedResult.set(result);
      }),
      catchError(err => {
        this.state.error.set('Error al obtener usuarios');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  // =========================
  // CREATE ✅ FULL BACKEND
  // =========================
  createUsuario(data: {
    rolID: number;
    nombreUsuario: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno?: string | null;
    email: string;
    activo: boolean;
  }): Observable<Usuario> {

    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.post<ApiResponse<any>>(this.apiUrl, data).pipe(
      map(response => UsuarioMapper.fromDto(response.data)),
      catchError(err => {
        this.state.error.set('Error al crear usuario');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  // =========================
  // UPDATE
  // =========================
  updateUsuario(idUsuario: number, data: Partial<Usuario>): Observable<Usuario> {
    this.state.loading.set(true);
    this.state.error.set(null);

    const body = { usuarioID: idUsuario, ...data };
    return this.http.put<ApiResponse<any>>(this.apiUrl, body).pipe(
      map(response => UsuarioMapper.fromDto(response.data)),
      catchError(err => {
        this.state.error.set('Error al actualizar usuario');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  // =========================
  // UPDATE CONNECTION STATUS
  // =========================
  updateConnectionStatus(
    idUsuario: number,
    data: { lastConnection: string; isLogged: boolean }
  ): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${idUsuario}/connection-status`,
      data
    ).pipe(
      catchError(err => {
        console.error('Error al actualizar estado de conexión:', err);
        return throwError(() => err);
      })
    );
  }

}
