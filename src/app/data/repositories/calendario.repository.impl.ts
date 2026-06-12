import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap, finalize } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { CalendarioRepository } from '../../domain/repositories/calendario.repository';
import { Calendario } from '../../domain/entities/calendario.entity';
import { ApiResponse } from '../../domain/models/api-response.model';
import { CalendarioState } from '../state/calendario.state';
import { CalendarioMapper } from '../../domain/mappers/calendario.mapper';

@Injectable()
export class CalendarioRepositoryImpl extends CalendarioRepository {
  private readonly apiUrl = `${environment.apiUrl}/Calendario`;
  private readonly state = inject(CalendarioState);

  get calendarios() { return this.state.calendarios; }
  get loading() { return this.state.loading; }
  get error() { return this.state.error; }

  constructor(private http: HttpClient) {
    super();
  }

  getCalendarios(): Observable<Calendario[]> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<any[]>>(this.apiUrl).pipe(
      map(response => response.data.map(data => CalendarioMapper.fromDto(data))),
      tap(calendarios => {
        this.state.calendarios.set(calendarios);
      }),
      catchError(err => {
        this.state.error.set('Error al obtener calendarios');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  getCalendarioById(id: number): Observable<Calendario> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map(response => CalendarioMapper.fromDto(response.data)),
      catchError(err => {
        this.state.error.set('Error al obtener el calendario');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  updateCalendario(data: {
    calendarioID: number;
    horaInicio: string;
    horaFin: string;
    diasAnticipacionMaxima: number;
    intervaloSlots: number;
  }): Observable<Calendario> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.put<ApiResponse<any>>(this.apiUrl, data).pipe(
      map(response => CalendarioMapper.fromDto(response.data)),
      catchError(err => {
        this.state.error.set('Error al actualizar el calendario');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

}
