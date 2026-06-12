import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { TipificacionCalendarioRepository } from '../../domain/repositories/tipificacion-calendario.repository';
import { TipificacionCalendario } from '../../domain/entities/tipificacion-calendario.entity';
import { UpdateTipificacionCalendarioDto } from '../../domain/use-cases/tipificacion-calendario.use-cases';
import { ApiResponse } from '../../domain/models/api-response.model';
import { TipificacionCalendarioState } from '../state/tipificacion-calendario.state';

@Injectable()
export class TipificacionCalendarioRepositoryImpl extends TipificacionCalendarioRepository {
  private readonly apiUrl = `${environment.apiUrl}/TipificacionCalendario`;
  private readonly state = inject(TipificacionCalendarioState);

  get loading() { return this.state.loading; }
  get error() { return this.state.error; }

  constructor(private http: HttpClient) {
    super();
  }

  getAll(): Observable<TipificacionCalendario[]> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<TipificacionCalendario[]>>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(err => {
        this.state.error.set('Error al obtener tipificaciones');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  getByCalendarioId(calendarioId: number): Observable<TipificacionCalendario[]> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<TipificacionCalendario[]>>(`${this.apiUrl}/calendario/${calendarioId}`).pipe(
      map(response => response.data),
      catchError(err => {
        this.state.error.set('Error al obtener tipificaciones del calendario');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  update(data: UpdateTipificacionCalendarioDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.put<void>(this.apiUrl, data).pipe(
      catchError(err => {
        this.state.error.set('Error al actualizar tipificación');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }
}
