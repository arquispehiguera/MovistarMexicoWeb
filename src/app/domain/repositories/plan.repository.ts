import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Plan } from '../entities/plan.entity';

export interface CreatePlanDto {
  nombre: string;
  activo: boolean;
}

export interface UpdatePlanDto {
  planId: number;
  nombre: string;
  activo: boolean;
}

export abstract class PlanRepository {
  abstract planes: Signal<Plan[]>;
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;

  abstract getPlanes(): Observable<void>;
  abstract createPlan(dto: CreatePlanDto): Observable<void>;
  abstract updatePlan(dto: UpdatePlanDto): Observable<void>;
}
