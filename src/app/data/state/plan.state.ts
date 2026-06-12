import { Injectable, signal } from '@angular/core';
import { Plan } from '../../domain/entities/plan.entity';

@Injectable({ providedIn: 'root' })
export class PlanState {
  readonly planes = signal<Plan[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
