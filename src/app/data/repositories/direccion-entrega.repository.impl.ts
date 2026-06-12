import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { DireccionEntregaRepository, CreateDireccionEntregaDto } from '../../domain/repositories/direccion-entrega.repository';
import { DireccionEntrega } from '../../domain/entities/direccion-entrega.entity';
import { ApiResponse } from '../../domain/models/api-response.model';
import { environment } from '../../../environments/environment';
import { DireccionEntregaState } from '../state/direccion-entrega.state';
import { DireccionEntregaMapper } from '../../domain/mappers/direccion-entrega.mapper';

@Injectable()
export class DireccionEntregaRepositoryImpl extends DireccionEntregaRepository {
  private readonly apiUrl = `${environment.apiUrl}/DireccionEntrega`;
  private readonly state = inject(DireccionEntregaState);

  get loading() { return this.state.loading; }
  get error() { return this.state.error; }

  constructor(private http: HttpClient) { super(); }

  createDireccionEntrega(dto: CreateDireccionEntregaDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.post<void>(this.apiUrl, dto).pipe(
      map(() => undefined),
      catchError(err => {
        this.state.error.set('Error al crear dirección de entrega');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  getByVentaID(ventaID: number): Observable<DireccionEntrega | null> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/venta/${ventaID}`).pipe(
      map(res => {
        const d = res?.data;
        if (!d) return null;
        return DireccionEntregaMapper.fromDto(d);
      }),
      catchError(() => of(null))
    );
  }
}
