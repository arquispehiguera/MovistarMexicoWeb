import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanDsctoRepository, CreatePlanDsctoDto, UpdatePlanDsctoDto } from '../repositories/plan-dscto.repository';

@Injectable({ providedIn: 'root' })
export class GetPlanesDsctoUseCase {
  constructor(private planDsctoRepository: PlanDsctoRepository) {}

  get planesDscto() {
    return this.planDsctoRepository.planesDscto;
  }

  get loading() {
    return this.planDsctoRepository.loading;
  }

  get error() {
    return this.planDsctoRepository.error;
  }

  execute(): Observable<void> {
    return this.planDsctoRepository.getPlanesDscto();
  }
}

@Injectable({ providedIn: 'root' })
export class CreatePlanDsctoUseCase {
  constructor(private planDsctoRepository: PlanDsctoRepository) {}

  get loading() { return this.planDsctoRepository.loading; }
  get error() { return this.planDsctoRepository.error; }

  execute(dto: CreatePlanDsctoDto): Observable<void> {
    return this.planDsctoRepository.createPlanDscto(dto);
  }
}

@Injectable({ providedIn: 'root' })
export class UpdatePlanDsctoUseCase {
  constructor(private planDsctoRepository: PlanDsctoRepository) {}

  get loading() { return this.planDsctoRepository.loading; }
  get error() { return this.planDsctoRepository.error; }

  execute(dto: UpdatePlanDsctoDto): Observable<void> {
    return this.planDsctoRepository.updatePlanDscto(dto);
  }
}
