import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TematicosRepository, CreateTematicoDto } from '../repositories/tematicos.repository';

@Injectable({ providedIn: 'root' })
export class GetTematicosUseCase {
  constructor(private tematicosRepository: TematicosRepository) {}

  get tematicos() {
    return this.tematicosRepository.tematicos;
  }

  get loading() {
    return this.tematicosRepository.loading;
  }

  get error() {
    return this.tematicosRepository.error;
  }

  execute(): Observable<void> {
    return this.tematicosRepository.getTematicos();
  }
}

@Injectable({ providedIn: 'root' })
export class CreateTematicoUseCase {
  constructor(private tematicosRepository: TematicosRepository) {}

  get loading() {
    return this.tematicosRepository.loading;
  }

  get error() {
    return this.tematicosRepository.error;
  }

  execute(dto: CreateTematicoDto): Observable<void> {
    return this.tematicosRepository.createTematico(dto);
  }
}

@Injectable({ providedIn: 'root' })
export class ToggleTematicoStatusUseCase {
  constructor(private tematicosRepository: TematicosRepository) {}

  get loading() {
    return this.tematicosRepository.loading;
  }

  get error() {
    return this.tematicosRepository.error;
  }

  execute(tematicoID: number, activo: boolean): Observable<void> {
    return this.tematicosRepository.toggleTematicoStatus(tematicoID, activo);
  }
}
