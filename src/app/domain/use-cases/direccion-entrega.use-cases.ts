import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DireccionEntregaRepository, CreateDireccionEntregaDto } from '../repositories/direccion-entrega.repository';

@Injectable({ providedIn: 'root' })
export class CreateDireccionEntregaUseCase {
  constructor(private repo: DireccionEntregaRepository) {}

  get loading() { return this.repo.loading; }
  get error() { return this.repo.error; }

  execute(dto: CreateDireccionEntregaDto): Observable<void> {
    return this.repo.createDireccionEntrega(dto);
  }
}
