import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DireccionEntregaState {
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
