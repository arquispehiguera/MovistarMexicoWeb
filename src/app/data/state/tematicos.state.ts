import { Injectable, signal } from '@angular/core';
import { Tematico } from '../../domain/entities/tematico.entity';

@Injectable({ providedIn: 'root' })
export class TematicosState {
  readonly tematicos = signal<Tematico[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
