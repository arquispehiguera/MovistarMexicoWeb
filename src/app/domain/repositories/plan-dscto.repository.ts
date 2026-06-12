import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanDscto } from '../entities/plan-dscto.entity';

export interface CreatePlanDsctoDto {
  nombre: string;
  monto: number;
  activo: boolean;
}

export interface UpdatePlanDsctoDto {
  planDsctoId: number;
  nombre: string;
  monto: number;
  activo: boolean;
}

export abstract class PlanDsctoRepository {
  abstract planesDscto: Signal<PlanDscto[]>;
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;

  abstract getPlanesDscto(): Observable<void>;
  abstract createPlanDscto(dto: CreatePlanDsctoDto): Observable<void>;
  abstract updatePlanDscto(dto: UpdatePlanDsctoDto): Observable<void>;
}
