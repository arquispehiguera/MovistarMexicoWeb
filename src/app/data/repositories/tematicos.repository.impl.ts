import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize, switchMap } from 'rxjs/operators';
import { TematicosRepository, CreateTematicoDto } from '../../domain/repositories/tematicos.repository';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../domain/models/api-response.model';
import { TematicosState } from '../state/tematicos.state';
import { TematicoMapper } from '../../domain/mappers/tematico.mapper';

@Injectable()
export class TematicosRepositoryImpl extends TematicosRepository {
  private readonly apiUrl = `${environment.apiUrl}/Tematico`;
  private readonly state = inject(TematicosState);

  get tematicos() { return this.state.tematicos; }
  get loading() { return this.state.loading; }
  get error() { return this.state.error; }

  constructor(private http: HttpClient) {
    super();
  }

  getTematicos(): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<any[]>>(this.apiUrl).pipe(
      map(response => {
        const tematicos = response.data.map(item => TematicoMapper.fromDto(item));
        this.state.tematicos.set(tematicos);
      }),
      catchError(err => {
        this.state.error.set('Error al cargar los temáticos');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  createTematico(dto: CreateTematicoDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.post<void>(this.apiUrl, dto).pipe(
      switchMap(() => this.getTematicos()),
      catchError(err => {
        this.state.error.set('Error al crear el temático');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  toggleTematicoStatus(tematicoID: number, activo: boolean): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.put<void>(this.apiUrl, { tematicoID, activo }).pipe(
      map(() => {
        // Actualizar localmente
        this.state.tematicos.update(tematicos =>
          tematicos.map(t =>
            t.tematicoID === tematicoID
              ? TematicoMapper.fromDto({ tematicoID: t.tematicoID, resultado: t.resultado, motivo: t.motivo, activo, fechaCreacion: t.fechaCreacion })
              : t
          )
        );
      }),
      catchError(err => {
        this.state.error.set('Error al actualizar el temático');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }
}
