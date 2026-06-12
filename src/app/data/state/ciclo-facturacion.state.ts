import { Injectable, signal } from '@angular/core';
import { CicloFacturacion } from '../../domain/entities/ciclo-facturacion.entity';

@Injectable({ providedIn: 'root' })
export class CicloFacturacionState {
  readonly ciclosFacturacion = signal<CicloFacturacion[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
