import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { DireccionFacturacionRepository, CreateDireccionFacturacionDto } from '../../domain/repositories/direccion-facturacion.repository';
import { DireccionFacturacion } from '../../domain/entities/direccion-facturacion.entity';
import { ApiResponse } from '../../domain/models/api-response.model';
import { environment } from '../../../environments/environment';
import { DireccionFacturacionState } from '../state/direccion-facturacion.state';
import { DireccionFacturacionMapper } from '../../domain/mappers/direccion-facturacion.mapper';

@Injectable()
export class DireccionFacturacionRepositoryImpl extends DireccionFacturacionRepository {
  private readonly apiUrl = `${environment.apiUrl}/DireccionFacturacion`;
  private readonly state = inject(DireccionFacturacionState);

  get loading() { return this.state.loading; }
  get error() { return this.state.error; }

  constructor(private http: HttpClient) { super(); }

  createDireccionFacturacion(dto: CreateDireccionFacturacionDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.post<void>(this.apiUrl, dto).pipe(
      map(() => undefined),
      catchError(err => {
        this.state.error.set('Error al crear dirección de facturación');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  getByVentaID(ventaID: number): Observable<DireccionFacturacion | null> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/venta/${ventaID}`).pipe(
      map(res => {
        const d = res?.data;
        if (!d) return null;
        return DireccionFacturacionMapper.fromDto(d);
      }),
      catchError(() => of(null))
    );
  }
}
