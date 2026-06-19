import { Injectable, signal } from '@angular/core';
import { Fvc } from '../../domain/entities/fvc.entity';

@Injectable({ providedIn: 'root' })
export class FvcState {
  readonly fvcs = signal<Fvc[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
