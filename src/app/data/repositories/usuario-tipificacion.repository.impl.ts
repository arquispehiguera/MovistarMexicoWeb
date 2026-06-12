import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UsuarioTipificacionRepository } from '../../domain/repositories/usuario-tipificacion.repository';
import { UsuarioTipificacion } from '../../domain/entities/usuario-tipificacion.entity';
import { ApiResponse } from '../../domain/models/api-response.model';
import { UsuarioTipificacionState } from '../state/usuario-tipificacion.state';

@Injectable()
export class UsuarioTipificacionRepositoryImpl extends UsuarioTipificacionRepository {
  private readonly apiUrl = `${environment.apiUrl}/UsuarioTipificacion`;
  private readonly state = inject(UsuarioTipificacionState);

  get usuariosTipificacion() { return this.state.usuariosTipificacion; }
  get loading() { return this.state.loading; }
  get error() { return this.state.error; }

  constructor(private http: HttpClient) {
    super();
  }

  getByUsuarioCalendario(usuarioCalendarioID: number): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http
      .get<ApiResponse<any[]>>(`${this.apiUrl}/usuario-calendario/${usuarioCalendarioID}`)
      .pipe(
        map(response => {
          const tipificaciones = response?.data?.map(data => this.mapToUsuarioTipificacion(data)) || [];
          this.state.usuariosTipificacion.set(tipificaciones);
        }),
        catchError(err => {
          this.state.error.set('Error al cargar tipificaciones del usuario');
          return throwError(() => err);
        }),
        finalize(() => this.state.loading.set(false))
      );
  }

  create(data: {
    usuarioCalendarioID: number;
    tipificacionCalendarioID: number;
    activo: boolean;
  }): Observable<UsuarioTipificacion> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.post<ApiResponse<any>>(this.apiUrl, data).pipe(
      map(response => {
        const newTipificacion = this.mapToUsuarioTipificacion(response.data);
        this.state.usuariosTipificacion.update(current => [...current, newTipificacion]);
        return newTipificacion;
      }),
      catchError(err => {
        this.state.error.set('Error al crear tipificación de usuario');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  update(
    usuarioTipificacionID: number,
    data: Partial<UsuarioTipificacion>
  ): Observable<UsuarioTipificacion> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.put<ApiResponse<any>>(this.apiUrl, {
      usuarioTipificacionID,
      ...data
    }).pipe(
      map(response => {
        const updatedTipificacion = this.mapToUsuarioTipificacion(response.data);
        this.state.usuariosTipificacion.update(current =>
          current.map(t => t.usuarioTipificacionID === usuarioTipificacionID ? updatedTipificacion : t)
        );
        return updatedTipificacion;
      }),
      catchError(err => {
        this.state.error.set('Error al actualizar tipificación de usuario');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  private mapToUsuarioTipificacion(data: any): UsuarioTipificacion {
    return {
      usuarioTipificacionID: data.usuarioTipificacionID,
      usuarioCalendarioID: data.usuarioCalendarioID,
      tipificacionCalendarioID: data.tipificacionCalendarioID,
      activo: data.activo ?? true
    };
  }
}
