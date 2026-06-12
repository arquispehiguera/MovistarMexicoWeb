import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipificacionCalendarioRepository } from '../repositories/tipificacion-calendario.repository';
import { TipificacionCalendario } from '../entities/tipificacion-calendario.entity';

@Injectable({ providedIn: 'root' })
export class GetAllTipificacionesUseCase {
  constructor(private tipificacionRepository: TipificacionCalendarioRepository) {}

  execute(): Observable<TipificacionCalendario[]> {
    return this.tipificacionRepository.getAll();
  }
}

@Injectable({ providedIn: 'root' })
export class GetTipificacionesByCalendarioUseCase {
  constructor(private tipificacionRepository: TipificacionCalendarioRepository) {}

  execute(calendarioId: number): Observable<TipificacionCalendario[]> {
    return this.tipificacionRepository.getByCalendarioId(calendarioId);
  }
}

export interface UpdateTipificacionCalendarioDto {
  tipificacionCalendarioID: number;
  calendarioID: number;
  tiempoPrevio: number;
  tiempoAtencion: number;
  tiempoPost: number;
  integracionSGA: boolean;
  activo: boolean;
}

@Injectable({ providedIn: 'root' })
export class UpdateTipificacionCalendarioUseCase {
  constructor(private tipificacionRepository: TipificacionCalendarioRepository) {}

  execute(data: UpdateTipificacionCalendarioDto): Observable<void> {
    return this.tipificacionRepository.update(data);
  }
}
