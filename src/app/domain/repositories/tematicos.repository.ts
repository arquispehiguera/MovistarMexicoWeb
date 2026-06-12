import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Tematico } from '../entities/tematico.entity';

export interface CreateTematicoDto {
  resultado: string;
  motivo: string;
  activo: boolean;
}

export abstract class TematicosRepository {
  abstract tematicos: Signal<Tematico[]>;
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;

  abstract getTematicos(): Observable<void>;
  abstract createTematico(dto: CreateTematicoDto): Observable<void>;
  abstract toggleTematicoStatus(tematicoID: number, activo: boolean): Observable<void>;
}
