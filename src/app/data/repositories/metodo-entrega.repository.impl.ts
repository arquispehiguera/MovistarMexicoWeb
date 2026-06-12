import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MetodoEntregaRepository, CreateMetodoEntregaDto, UpdateMetodoEntregaDto } from '../../domain/repositories/metodo-entrega.repository';
import { ApiResponse } from '../../domain/models/api-response.model';
import { MetodoEntregaState } from '../state/metodo-entrega.state';
import { MetodoEntregaMapper } from '../../domain/mappers/metodo-entrega.mapper';

@Injectable()
export class MetodoEntregaRepositoryImpl extends MetodoEntregaRepository {
  private readonly apiUrl = `${environment.apiUrl}/metodoentrega`;
  private readonly state = inject(MetodoEntregaState);

  get metodosEntrega() { return this.state.metodosEntrega; }
  get loading() { return this.state.loading; }
  get error() { return this.state.error; }

  constructor(private http: HttpClient) {
    super();
  }

  getMetodosEntrega(): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<any[]>>(this.apiUrl).pipe(
      map(response => {
        const metodosEntrega = response.data.map(item => MetodoEntregaMapper.fromDto(item));
        this.state.metodosEntrega.set(metodosEntrega);
      }),
      catchError(err => {
        this.state.error.set('Error al cargar los métodos de entrega');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  createMetodoEntrega(dto: CreateMetodoEntregaDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.post<void>(this.apiUrl, dto).pipe(
      switchMap(() => this.getMetodosEntrega()),
      catchError(err => {
        this.state.error.set('Error al crear el método de entrega');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  updateMetodoEntrega(dto: UpdateMetodoEntregaDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.put<void>(this.apiUrl, dto).pipe(
      map(() => {
        this.state.metodosEntrega.update(metodos =>
          metodos.map(m =>
            m.metodoEntregaId === dto.metodoEntregaId
              ? MetodoEntregaMapper.fromDto({ metodoEntregaId: m.metodoEntregaId, nombre: dto.nombre, activo: dto.activo, fechaCreacion: m.fechaCreacion })
              : m
          )
        );
      }),
      catchError(err => {
        this.state.error.set('Error al actualizar el método de entrega');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }
}
