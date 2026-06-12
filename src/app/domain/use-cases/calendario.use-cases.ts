import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CalendarioRepository } from '../repositories/calendario.repository';
import { Calendario } from '../entities/calendario.entity';

@Injectable({ providedIn: 'root' })
export class GetCalendariosUseCase {
  constructor(private calendarioRepository: CalendarioRepository) {}

  execute(): Observable<Calendario[]> {
    return this.calendarioRepository.getCalendarios();
  }
}

@Injectable({ providedIn: 'root' })
export class GetCalendarioByIdUseCase {
  constructor(private calendarioRepository: CalendarioRepository) {}

  execute(id: number): Observable<Calendario> {
    return this.calendarioRepository.getCalendarioById(id);
  }
}

@Injectable({ providedIn: 'root' })
export class UpdateCalendarioUseCase {
  constructor(private calendarioRepository: CalendarioRepository) {}

  execute(data: {
    calendarioID: number;
    horaInicio: string;
    horaFin: string;
    diasAnticipacionMaxima: number;
    intervaloSlots: number;
  }): Observable<Calendario> {
    return this.calendarioRepository.updateCalendario(data);
  }
}
