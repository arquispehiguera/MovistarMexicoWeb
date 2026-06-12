import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoLinea } from '../entities/tipo-linea.entity';

export interface CreateTipoLineaDto {
  nombre: string;
  activo: boolean;
}

export interface UpdateTipoLineaDto {
  tipoLineaId: number;
  nombre: string;
  activo: boolean;
}

export abstract class TipoLineaRepository {
  abstract tiposLinea: Signal<TipoLinea[]>;
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;

  abstract getTiposLinea(): Observable<void>;
  abstract createTipoLinea(dto: CreateTipoLineaDto): Observable<void>;
  abstract updateTipoLinea(dto: UpdateTipoLineaDto): Observable<void>;
}
