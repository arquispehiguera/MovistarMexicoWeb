import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateFvcDto, FvcRepository, UpdateFvcDto } from '../repositories/fvc.repository';

@Injectable({ providedIn: 'root' })
export class GetFvcsUseCase {
  constructor(private fvcRepository: FvcRepository) {}

  get fvcs() { return this.fvcRepository.fvcs; }
  get loading() { return this.fvcRepository.loading; }
  get error() { return this.fvcRepository.error; }

  execute(): Observable<void> {
    return this.fvcRepository.getFvcs();
  }
}

@Injectable({ providedIn: 'root' })
export class CreateFvcUseCase {
  constructor(private fvcRepository: FvcRepository) {}

  get loading() { return this.fvcRepository.loading; }
  get error() { return this.fvcRepository.error; }

  execute(dto: CreateFvcDto): Observable<void> {
    return this.fvcRepository.createFvc(dto);
  }
}

@Injectable({ providedIn: 'root' })
export class UpdateFvcUseCase {
  constructor(private fvcRepository: FvcRepository) {}

  get loading() { return this.fvcRepository.loading; }
  get error() { return this.fvcRepository.error; }

  execute(dto: UpdateFvcDto): Observable<void> {
    return this.fvcRepository.updateFvc(dto);
  }
}
