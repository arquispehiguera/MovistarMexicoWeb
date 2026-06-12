import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanRepository, CreatePlanDto, UpdatePlanDto } from '../repositories/plan.repository';

@Injectable({ providedIn: 'root' })
export class GetPlanesUseCase {
  constructor(private planRepository: PlanRepository) {}

  get planes() {
    return this.planRepository.planes;
  }

  get loading() {
    return this.planRepository.loading;
  }

  get error() {
    return this.planRepository.error;
  }

  execute(): Observable<void> {
    return this.planRepository.getPlanes();
  }
}

@Injectable({ providedIn: 'root' })
export class CreatePlanUseCase {
  constructor(private planRepository: PlanRepository) {}

  get loading() { return this.planRepository.loading; }
  get error() { return this.planRepository.error; }

  execute(dto: CreatePlanDto): Observable<void> {
    return this.planRepository.createPlan(dto);
  }
}

@Injectable({ providedIn: 'root' })
export class UpdatePlanUseCase {
  constructor(private planRepository: PlanRepository) {}

  get loading() { return this.planRepository.loading; }
  get error() { return this.planRepository.error; }

  execute(dto: UpdatePlanDto): Observable<void> {
    return this.planRepository.updatePlan(dto);
  }
}
