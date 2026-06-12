import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistroVenta } from '../entities/registro-venta.entity';
import { PagedResult } from '../models/paged-result.model';
import { QueryParameters } from '../models/query-parameters.model';
import { VentaCompleta } from '../models/venta-completa.model';

export type { CreateRegistroVentaDto, DireccionCompletoPayload, CreateRegistroVentaCompletoDto } from '../dtos/registro-venta.dtos';
import type { CreateRegistroVentaDto, CreateRegistroVentaCompletoDto } from '../dtos/registro-venta.dtos';

export abstract class RegistroVentaRepository {
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;
  abstract pagedResult: Signal<PagedResult<RegistroVenta> | null>;

  abstract createRegistroVenta(dto: CreateRegistroVentaDto): Observable<number>;
  abstract createRegistroVentaCompleto(dto: CreateRegistroVentaCompletoDto): Observable<void>;
  abstract getRegistrosVentaPaged(params: QueryParameters): Observable<PagedResult<RegistroVenta>>;
  abstract getMisVentasPaged(params: QueryParameters): Observable<PagedResult<RegistroVenta>>;
  abstract getVentaCompleta(ventaID: number): Observable<VentaCompleta>;
  abstract deleteRegistroVenta(ventaID: number): Observable<void>;
}
