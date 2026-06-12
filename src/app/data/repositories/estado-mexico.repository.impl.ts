import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { EstadoMexicoRepository, CreateEstadoMexicoDto, UpdateEstadoMexicoDto } from '../../domain/repositories/estado-mexico.repository';
import { ApiResponse } from '../../domain/models/api-response.model';
import { EstadoMexicoState } from '../state/estado-mexico.state';
import { EstadoMexicoMapper } from '../../domain/mappers/estado-mexico.mapper';

@Injectable()
export class EstadoMexicoRepositoryImpl extends EstadoMexicoRepository {
  private readonly apiUrl = `${environment.apiUrl}/estadomexico`;
  private readonly state = inject(EstadoMexicoState);

  get estados() { return this.state.estados; }
  get loading() { return this.state.loading; }
  get error() { return this.state.error; }

  constructor(private http: HttpClient) {
    super();
  }

  getEstados(): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<any[]>>(this.apiUrl).pipe(
      map(response => {
        this.state.estados.set(
          response.data.map(item => EstadoMexicoMapper.fromDto(item))
        );
      }),
      catchError(err => {
        this.state.error.set('Error al cargar los estados');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  createEstado(dto: CreateEstadoMexicoDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.post<void>(this.apiUrl, dto).pipe(
      switchMap(() => this.getEstados()),
      catchError(err => {
        this.state.error.set('Error al crear el estado');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  updateEstado(dto: UpdateEstadoMexicoDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.put<void>(this.apiUrl, dto).pipe(
      map(() => {
        this.state.estados.update(list =>
          list.map(e =>
            e.estadoId === dto.estadoId
              ? EstadoMexicoMapper.fromDto({ estadoId: e.estadoId, nombre: dto.nombre, activo: dto.activo, fechaCreacion: e.fechaCreacion })
              : e
          )
        );
      }),
      catchError(err => {
        this.state.error.set('Error al actualizar el estado');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }
}
