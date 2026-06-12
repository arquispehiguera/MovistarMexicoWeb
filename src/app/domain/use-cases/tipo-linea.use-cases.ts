import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTipoLineaDto, TipoLineaRepository, UpdateTipoLineaDto } from '../repositories/tipo-linea.repository';

@Injectable({ providedIn: 'root' })
export class GetTiposLineaUseCase {
  constructor(private tipoLineaRepository: TipoLineaRepository) {}

  get tiposLinea() {
    return this.tipoLineaRepository.tiposLinea;
  }

  get loading() {
    return this.tipoLineaRepository.loading;
  }

  get error() {
    return this.tipoLineaRepository.error;
  }

  execute(): Observable<void> {
    return this.tipoLineaRepository.getTiposLinea();
  }
}

@Injectable({ providedIn: 'root' })
export class CreateTipoLineaUseCase {
  constructor(private tipoLineaRepository: TipoLineaRepository) {}

  get loading() {
    return this.tipoLineaRepository.loading;
  }

  get error() {
    return this.tipoLineaRepository.error;
  }

  execute(dto: CreateTipoLineaDto): Observable<void> {
    return this.tipoLineaRepository.createTipoLinea(dto);
  }
}

@Injectable({ providedIn: 'root' })
export class UpdateTipoLineaUseCase {
  constructor(private tipoLineaRepository: TipoLineaRepository) {}

  get loading() {
    return this.tipoLineaRepository.loading;
  }

  get error() {
    return this.tipoLineaRepository.error;
  }

  execute(dto: UpdateTipoLineaDto): Observable<void> {
    return this.tipoLineaRepository.updateTipoLinea(dto);
  }
}
