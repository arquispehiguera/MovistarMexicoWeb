import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadoMexico } from '../entities/estado-mexico.entity';

export interface CreateEstadoMexicoDto {
  nombre: string;
  activo: boolean;
}

export interface UpdateEstadoMexicoDto {
  estadoId: number;
  nombre: string;
  activo: boolean;
}

export abstract class EstadoMexicoRepository {
  abstract estados: Signal<EstadoMexico[]>;
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;

  abstract getEstados(): Observable<void>;
  abstract createEstado(dto: CreateEstadoMexicoDto): Observable<void>;
  abstract updateEstado(dto: UpdateEstadoMexicoDto): Observable<void>;
}
