import { Injectable, signal } from '@angular/core';
import { Calendario } from '../../domain/entities/calendario.entity';

@Injectable({ providedIn: 'root' })
export class CalendarioState {
  readonly calendarios = signal<Calendario[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
