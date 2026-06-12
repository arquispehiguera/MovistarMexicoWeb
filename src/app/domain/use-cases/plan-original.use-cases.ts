import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanOriginalRepository, CreatePlanOriginalDto, UpdatePlanOriginalDto } from '../repositories/plan-original.repository';

@Injectable({ providedIn: 'root' })
export class GetPlanesOriginalesUseCase {
  constructor(private planOriginalRepository: PlanOriginalRepository) {}

  get planesOriginales() {
    return this.planOriginalRepository.planesOriginales;
  }

  get loading() {
    return this.planOriginalRepository.loading;
  }

  get error() {
    return this.planOriginalRepository.error;
  }

  execute(): Observable<void> {
    return this.planOriginalRepository.getPlanesOriginales();
  }
}

@Injectable({ providedIn: 'root' })
export class CreatePlanOriginalUseCase {
  constructor(private planOriginalRepository: PlanOriginalRepository) {}

  get loading() { return this.planOriginalRepository.loading; }
  get error() { return this.planOriginalRepository.error; }

  execute(dto: CreatePlanOriginalDto): Observable<void> {
    return this.planOriginalRepository.createPlanOriginal(dto);
  }
}

@Injectable({ providedIn: 'root' })
export class UpdatePlanOriginalUseCase {
  constructor(private planOriginalRepository: PlanOriginalRepository) {}

  get loading() { return this.planOriginalRepository.loading; }
  get error() { return this.planOriginalRepository.error; }

  execute(dto: UpdatePlanOriginalDto): Observable<void> {
    return this.planOriginalRepository.updatePlanOriginal(dto);
  }
}
