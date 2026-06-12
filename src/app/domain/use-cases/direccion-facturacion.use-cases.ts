import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DireccionFacturacionRepository, CreateDireccionFacturacionDto } from '../repositories/direccion-facturacion.repository';

@Injectable({ providedIn: 'root' })
export class CreateDireccionFacturacionUseCase {
  constructor(private repo: DireccionFacturacionRepository) {}

  get loading() { return this.repo.loading; }
  get error() { return this.repo.error; }

  execute(dto: CreateDireccionFacturacionDto): Observable<void> {
    return this.repo.createDireccionFacturacion(dto);
  }
}
