import { Injectable, signal } from '@angular/core';
import { RegistroVenta } from '../../domain/entities/registro-venta.entity';
import { PagedResult } from '../../domain/models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class RegistroVentaState {
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly pagedResult = signal<PagedResult<RegistroVenta> | null>(null);
}
