import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Calendario } from '../entities/calendario.entity';

export abstract class CalendarioRepository {
  abstract calendarios: Signal<Calendario[]>;
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;

  abstract getCalendarios(): Observable<Calendario[]>;
  abstract getCalendarioById(id: number): Observable<Calendario>;
  abstract updateCalendario(data: {
    calendarioID: number;
    horaInicio: string;
    horaFin: string;
    diasAnticipacionMaxima: number;
    intervaloSlots: number;
  }): Observable<Calendario>;
}
