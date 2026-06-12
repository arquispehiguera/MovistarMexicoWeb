import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UsuarioCalendarioRepository } from '../../domain/repositories/usuario-calendario.repository';
import { UsuarioCalendario } from '../../domain/entities/usuario-calendario.entity';
import { ApiResponse } from '../../domain/models/api-response.model';
import { UsuarioCalendarioState } from '../state/usuario-calendario.state';
import { UsuarioCalendarioMapper } from '../../domain/mappers/usuario-calendario.mapper';

@Injectable()
export class UsuarioCalendarioRepositoryImpl extends UsuarioCalendarioRepository {
  private readonly apiUrl = `${environment.apiUrl}/UsuarioCalendario`;
  private readonly state = inject(UsuarioCalendarioState);

  get usuariosCalendario() { return this.state.usuariosCalendario; }
  get loading() { return this.state.loading; }
  get error() { return this.state.error; }

  constructor(private http: HttpClient) {
    super();
  }

  getUsuariosCalendario(): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<any[]>>(this.apiUrl).pipe(
      map(response => {
        const assignments = response?.data?.map(data => UsuarioCalendarioMapper.fromDto(data)) || [];
        this.state.usuariosCalendario.set(assignments);
      }),
      catchError(err => {
        this.state.error.set('Error al cargar asignaciones');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  createUsuarioCalendario(data: {
    usuarioID: number;
    calendarioID: number;
    activo: boolean;
  }): Observable<UsuarioCalendario> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.post<ApiResponse<any>>(this.apiUrl, data).pipe(
      map(response => {
        const newAssignment = UsuarioCalendarioMapper.fromDto(response.data);
        this.state.usuariosCalendario.update(current => [...current, newAssignment]);
        return newAssignment;
      }),
      catchError(err => {
        this.state.error.set('Error al crear asignación');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  updateUsuarioCalendario(
    usuarioCalendarioID: number,
    data: Partial<UsuarioCalendario>
  ): Observable<UsuarioCalendario> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.put<ApiResponse<any>>(this.apiUrl, {
      usuarioCalendarioID,
      ...data
    }).pipe(
      map(response => {
        const updatedAssignment = UsuarioCalendarioMapper.fromDto(response.data);
        this.state.usuariosCalendario.update(current =>
          current.map(a => a.usuarioCalendarioID === usuarioCalendarioID ? updatedAssignment : a)
        );
        return updatedAssignment;
      }),
      catchError(err => {
        this.state.error.set('Error al actualizar asignación');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

}
