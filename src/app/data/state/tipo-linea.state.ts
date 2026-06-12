import { Injectable, signal } from '@angular/core';
import { TipoLinea } from '../../domain/entities/tipo-linea.entity';

@Injectable({ providedIn: 'root' })
export class TipoLineaState {
  readonly tiposLinea = signal<TipoLinea[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
