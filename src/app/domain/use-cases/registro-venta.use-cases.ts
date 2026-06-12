import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistroVentaRepository } from '../repositories/registro-venta.repository';
import { CreateRegistroVentaDto, CreateRegistroVentaCompletoDto } from '../dtos/registro-venta.dtos';

@Injectable({ providedIn: 'root' })
export class CreateRegistroVentaUseCase {
  constructor(private registroVentaRepository: RegistroVentaRepository) {}

  get loading() {
    return this.registroVentaRepository.loading;
  }

  get error() {
    return this.registroVentaRepository.error;
  }

  execute(dto: CreateRegistroVentaDto): Observable<number> {
    return this.registroVentaRepository.createRegistroVenta(dto);
  }
}

@Injectable({ providedIn: 'root' })
export class CreateRegistroVentaCompletoUseCase {
  constructor(private registroVentaRepository: RegistroVentaRepository) {}

  get loading() { return this.registroVentaRepository.loading; }
  get error()   { return this.registroVentaRepository.error; }

  execute(dto: CreateRegistroVentaCompletoDto): Observable<void> {
    return this.registroVentaRepository.createRegistroVentaCompleto(dto);
  }
}
