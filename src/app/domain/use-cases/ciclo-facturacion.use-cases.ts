import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CicloFacturacionRepository, CreateCicloFacturacionDto, UpdateCicloFacturacionDto } from '../repositories/ciclo-facturacion.repository';

@Injectable({ providedIn: 'root' })
export class GetCiclosFacturacionUseCase {
  constructor(private cicloFacturacionRepository: CicloFacturacionRepository) {}

  get ciclosFacturacion() {
    return this.cicloFacturacionRepository.ciclosFacturacion;
  }

  get loading() {
    return this.cicloFacturacionRepository.loading;
  }

  get error() {
    return this.cicloFacturacionRepository.error;
  }

  execute(): Observable<void> {
    return this.cicloFacturacionRepository.getCiclosFacturacion();
  }
}

@Injectable({ providedIn: 'root' })
export class CreateCicloFacturacionUseCase {
  constructor(private cicloFacturacionRepository: CicloFacturacionRepository) {}

  get loading() { return this.cicloFacturacionRepository.loading; }
  get error() { return this.cicloFacturacionRepository.error; }

  execute(dto: CreateCicloFacturacionDto): Observable<void> {
    return this.cicloFacturacionRepository.createCicloFacturacion(dto);
  }
}

@Injectable({ providedIn: 'root' })
export class UpdateCicloFacturacionUseCase {
  constructor(private cicloFacturacionRepository: CicloFacturacionRepository) {}

  get loading() { return this.cicloFacturacionRepository.loading; }
  get error() { return this.cicloFacturacionRepository.error; }

  execute(dto: UpdateCicloFacturacionDto): Observable<void> {
    return this.cicloFacturacionRepository.updateCicloFacturacion(dto);
  }
}
