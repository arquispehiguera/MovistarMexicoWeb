import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { CicloFacturacion } from '../entities/ciclo-facturacion.entity';

export interface CreateCicloFacturacionDto {
  codigo: string;
  activo: boolean;
}

export interface UpdateCicloFacturacionDto {
  cicloFacturacionId: number;
  codigo: string;
  activo: boolean;
}

export abstract class CicloFacturacionRepository {
  abstract ciclosFacturacion: Signal<CicloFacturacion[]>;
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;

  abstract getCiclosFacturacion(): Observable<void>;
  abstract createCicloFacturacion(dto: CreateCicloFacturacionDto): Observable<void>;
  abstract updateCicloFacturacion(dto: UpdateCicloFacturacionDto): Observable<void>;
}
