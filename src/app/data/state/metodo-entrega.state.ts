import { Injectable, signal } from '@angular/core';
import { MetodoEntrega } from '../../domain/entities/metodo-entrega.entity';

@Injectable({ providedIn: 'root' })
export class MetodoEntregaState {
  readonly metodosEntrega = signal<MetodoEntrega[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
