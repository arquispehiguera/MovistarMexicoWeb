import { Injectable, signal } from '@angular/core';
import { PlanOriginal } from '../../domain/entities/plan-original.entity';

@Injectable({ providedIn: 'root' })
export class PlanOriginalState {
  readonly planesOriginales = signal<PlanOriginal[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
