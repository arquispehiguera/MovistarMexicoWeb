import { Injectable, signal } from '@angular/core';
import { EstadoMexico } from '../../domain/entities/estado-mexico.entity';

@Injectable({ providedIn: 'root' })
export class EstadoMexicoState {
  readonly estados = signal<EstadoMexico[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
