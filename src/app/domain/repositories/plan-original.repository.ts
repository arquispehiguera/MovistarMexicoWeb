import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanOriginal } from '../entities/plan-original.entity';

export interface CreatePlanOriginalDto {
  nombre: string;
  activo: boolean;
}

export interface UpdatePlanOriginalDto {
  planOriginalId: number;
  nombre: string;
  activo: boolean;
}

export abstract class PlanOriginalRepository {
  abstract planesOriginales: Signal<PlanOriginal[]>;
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;

  abstract getPlanesOriginales(): Observable<void>;
  abstract createPlanOriginal(dto: CreatePlanOriginalDto): Observable<void>;
  abstract updatePlanOriginal(dto: UpdatePlanOriginalDto): Observable<void>;
}
