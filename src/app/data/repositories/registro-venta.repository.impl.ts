import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap, finalize } from 'rxjs/operators';
import { RegistroVentaRepository } from '../../domain/repositories/registro-venta.repository';
import { CreateRegistroVentaDto, CreateRegistroVentaCompletoDto } from '../../domain/dtos/registro-venta.dtos';
import { RegistroVenta } from '../../domain/entities/registro-venta.entity';
import { DireccionEntrega } from '../../domain/entities/direccion-entrega.entity';
import { DireccionFacturacion } from '../../domain/entities/direccion-facturacion.entity';
import { PagedResult } from '../../domain/models/paged-result.model';
import { QueryParameters } from '../../domain/models/query-parameters.model';
import { VentaCompleta } from '../../domain/models/venta-completa.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../domain/models/api-response.model';
import { RegistroVentaState } from '../state/registro-venta.state';
import { RegistroVentaMapper } from '../../domain/mappers/registro-venta.mapper';
import { DireccionEntregaMapper } from '../../domain/mappers/direccion-entrega.mapper';
import { DireccionFacturacionMapper } from '../../domain/mappers/direccion-facturacion.mapper';

@Injectable()
export class RegistroVentaRepositoryImpl extends RegistroVentaRepository {
  private readonly apiUrl = `${environment.apiUrl}/RegistroVenta`;
  private readonly state = inject(RegistroVentaState);

  get loading() { return this.state.loading; }
  get error() { return this.state.error; }
  get pagedResult() { return this.state.pagedResult; }

  constructor(private http: HttpClient) {
    super();
  }

  createRegistroVenta(dto: CreateRegistroVentaDto): Observable<number> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.post<ApiResponse<number>>(this.apiUrl, dto).pipe(
      map(response => response.data),
      catchError(err => {
        this.state.error.set('Error al crear el registro de venta');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  createRegistroVentaCompleto(dto: CreateRegistroVentaCompletoDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/completo`, dto).pipe(
      map(() => undefined),
      catchError(err => {
        this.state.error.set('Error al registrar la venta');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  getRegistrosVentaPaged(params: QueryParameters): Observable<PagedResult<RegistroVenta>> {
    this.state.loading.set(true);
    this.state.error.set(null);

    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber.toString())
      .set('pageSize', params.pageSize.toString());

    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);
    if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/paged`, { params: httpParams }).pipe(
      map(res => ({
        data: res.data.data,
        totalCount: res.data.totalCount,
        pageNumber: res.data.pageNumber,
        pageSize: res.data.pageSize,
        totalPages: res.data.totalPages,
        hasPrevious: res.data.hasPrevious,
        hasNext: res.data.hasNext
      })),
      tap(result => {
        this.state.pagedResult.set(result);
      }),
      catchError(err => {
        this.state.error.set('Error al obtener registros de venta');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  getVentaCompleta(ventaID: number): Observable<VentaCompleta> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${ventaID}/completo`).pipe(
      map(res => {
        const d = res.data;
        const v = d.venta;
        const venta = RegistroVentaMapper.fromDto(v);

        const de = d.direccionEntrega;
        const direccionEntrega = de ? DireccionEntregaMapper.fromDto(de) : null;

        const df = d.direccionFacturacion;
        const direccionFacturacion = df ? DireccionFacturacionMapper.fromDto(df) : null;

        return { venta, direccionEntrega, direccionFacturacion };
      }),
      catchError(err => throwError(() => err))
    );
  }

  deleteRegistroVenta(ventaID: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${ventaID}/completo`);
  }

  getMisVentasPaged(params: QueryParameters): Observable<PagedResult<RegistroVenta>> {
    this.state.loading.set(true);
    this.state.error.set(null);

    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber.toString())
      .set('pageSize', params.pageSize.toString());

    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);
    if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/mis-ventas`, { params: httpParams }).pipe(
      map(res => ({
        data: res.data.data,
        totalCount: res.data.totalCount,
        pageNumber: res.data.pageNumber,
        pageSize: res.data.pageSize,
        totalPages: res.data.totalPages,
        hasPrevious: res.data.hasPrevious,
        hasNext: res.data.hasNext
      })),
      tap(result => {
        this.state.pagedResult.set(result);
      }),
      catchError(err => {
        this.state.error.set('Error al obtener ventas');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }
}
