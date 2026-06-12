import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { MetodoEntrega } from '../entities/metodo-entrega.entity';

export interface CreateMetodoEntregaDto {
  nombre: string;
  activo: boolean;
}

export interface UpdateMetodoEntregaDto {
  metodoEntregaId: number;
  nombre: string;
  activo: boolean;
}

export abstract class MetodoEntregaRepository {
  abstract metodosEntrega: Signal<MetodoEntrega[]>;
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;

  abstract getMetodosEntrega(): Observable<void>;
  abstract createMetodoEntrega(dto: CreateMetodoEntregaDto): Observable<void>;
  abstract updateMetodoEntrega(dto: UpdateMetodoEntregaDto): Observable<void>;
}
