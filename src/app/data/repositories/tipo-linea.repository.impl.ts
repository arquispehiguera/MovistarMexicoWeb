import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CreateTipoLineaDto, TipoLineaRepository, UpdateTipoLineaDto } from '../../domain/repositories/tipo-linea.repository';
import { ApiResponse } from '../../domain/models/api-response.model';
import { TipoLineaState } from '../state/tipo-linea.state';
import { TipoLineaMapper } from '../../domain/mappers/tipo-linea.mapper';

@Injectable()
export class TipoLineaRepositoryImpl extends TipoLineaRepository {
  private readonly apiUrl = `${environment.apiUrl}/tipolinea`;
  private readonly state = inject(TipoLineaState);

  get tiposLinea() { return this.state.tiposLinea; }
  get loading() { return this.state.loading; }
  get error() { return this.state.error; }

  constructor(private http: HttpClient) {
    super();
  }

  getTiposLinea(): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<any[]>>(this.apiUrl).pipe(
      map(response => {
        const tiposLinea = response.data.map(item => TipoLineaMapper.fromDto(item));
        this.state.tiposLinea.set(tiposLinea);
      }),
      catchError(err => {
        this.state.error.set('Error al cargar los tipos de línea');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  createTipoLinea(dto: CreateTipoLineaDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.post<void>(this.apiUrl, dto).pipe(
      switchMap(() => this.getTiposLinea()),
      catchError(err => {
        this.state.error.set('Error al crear el tipo de línea');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  updateTipoLinea(dto: UpdateTipoLineaDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.put<void>(this.apiUrl, dto).pipe(
      map(() => {
        // Actualizar localmente
        this.state.tiposLinea.update(tipos =>
          tipos.map(t =>
            t.tipoLineaId === dto.tipoLineaId
              ? TipoLineaMapper.fromDto({ tipoLineaId: t.tipoLineaId, nombre: dto.nombre, activo: dto.activo, fechaCreacion: t.fechaCreacion })
              : t
          )
        );
      }),
      catchError(err => {
        this.state.error.set('Error al actualizar el tipo de línea');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }
}
