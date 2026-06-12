import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CicloFacturacionRepository, CreateCicloFacturacionDto, UpdateCicloFacturacionDto } from '../../domain/repositories/ciclo-facturacion.repository';
import { ApiResponse } from '../../domain/models/api-response.model';
import { CicloFacturacionState } from '../state/ciclo-facturacion.state';
import { CicloFacturacionMapper } from '../../domain/mappers/ciclo-facturacion.mapper';

@Injectable()
export class CicloFacturacionRepositoryImpl extends CicloFacturacionRepository {
  private readonly apiUrl = `${environment.apiUrl}/ciclofacturacion`;
  private readonly state = inject(CicloFacturacionState);

  get ciclosFacturacion() { return this.state.ciclosFacturacion; }
  get loading() { return this.state.loading; }
  get error() { return this.state.error; }

  constructor(private http: HttpClient) {
    super();
  }

  getCiclosFacturacion(): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<any[]>>(this.apiUrl).pipe(
      map(response => {
        const ciclosFacturacion = response.data.map(item => CicloFacturacionMapper.fromDto(item));
        this.state.ciclosFacturacion.set(ciclosFacturacion);
      }),
      catchError(err => {
        this.state.error.set('Error al cargar los ciclos de facturación');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  createCicloFacturacion(dto: CreateCicloFacturacionDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.post<void>(this.apiUrl, dto).pipe(
      switchMap(() => this.getCiclosFacturacion()),
      catchError(err => {
        this.state.error.set('Error al crear el ciclo de facturación');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  updateCicloFacturacion(dto: UpdateCicloFacturacionDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.put<void>(this.apiUrl, dto).pipe(
      map(() => {
        this.state.ciclosFacturacion.update(ciclos =>
          ciclos.map(c =>
            c.cicloFacturacionId === dto.cicloFacturacionId
              ? CicloFacturacionMapper.fromDto({ cicloFacturacionId: c.cicloFacturacionId, codigo: dto.codigo, activo: dto.activo, fechaCreacion: c.fechaCreacion })
              : c
          )
        );
      }),
      catchError(err => {
        this.state.error.set('Error al actualizar el ciclo de facturación');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }
}
