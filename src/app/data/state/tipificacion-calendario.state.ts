import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TipificacionCalendarioState {
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
