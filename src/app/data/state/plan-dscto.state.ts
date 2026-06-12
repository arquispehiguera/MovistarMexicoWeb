import { Injectable, signal } from '@angular/core';
import { PlanDscto } from '../../domain/entities/plan-dscto.entity';

@Injectable({ providedIn: 'root' })
export class PlanDsctoState {
  readonly planesDscto = signal<PlanDscto[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
