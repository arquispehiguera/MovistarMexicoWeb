import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Fvc } from '../entities/fvc.entity';

export interface CreateFvcDto {
  descripcion: string;
  activo: boolean;
}

export interface UpdateFvcDto {
  fvcId: number;
  descripcion: string;
  activo: boolean;
}

export abstract class FvcRepository {
  abstract fvcs: Signal<Fvc[]>;
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;

  abstract getFvcs(): Observable<void>;
  abstract createFvc(dto: CreateFvcDto): Observable<void>;
  abstract updateFvc(dto: UpdateFvcDto): Observable<void>;
}
