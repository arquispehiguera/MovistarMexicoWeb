import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MetodoEntregaRepository, CreateMetodoEntregaDto, UpdateMetodoEntregaDto } from '../repositories/metodo-entrega.repository';

@Injectable({ providedIn: 'root' })
export class GetMetodosEntregaUseCase {
  constructor(private metodoEntregaRepository: MetodoEntregaRepository) {}

  get metodosEntrega() {
    return this.metodoEntregaRepository.metodosEntrega;
  }

  get loading() {
    return this.metodoEntregaRepository.loading;
  }

  get error() {
    return this.metodoEntregaRepository.error;
  }

  execute(): Observable<void> {
    return this.metodoEntregaRepository.getMetodosEntrega();
  }
}

@Injectable({ providedIn: 'root' })
export class CreateMetodoEntregaUseCase {
  constructor(private metodoEntregaRepository: MetodoEntregaRepository) {}

  get loading() { return this.metodoEntregaRepository.loading; }
  get error() { return this.metodoEntregaRepository.error; }

  execute(dto: CreateMetodoEntregaDto): Observable<void> {
    return this.metodoEntregaRepository.createMetodoEntrega(dto);
  }
}

@Injectable({ providedIn: 'root' })
export class UpdateMetodoEntregaUseCase {
  constructor(private metodoEntregaRepository: MetodoEntregaRepository) {}

  get loading() { return this.metodoEntregaRepository.loading; }
  get error() { return this.metodoEntregaRepository.error; }

  execute(dto: UpdateMetodoEntregaDto): Observable<void> {
    return this.metodoEntregaRepository.updateMetodoEntrega(dto);
  }
}
