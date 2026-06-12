import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { DireccionEntrega } from '../entities/direccion-entrega.entity';

export interface CreateDireccionEntregaDto {
  ventaID: number;
  calle: string | null;
  numeroExterior: string | null;
  numeroInterior: string | null;
  entreCalles: string | null;
  referencias: string | null;
  codigoPostal: string | null;
  colonia: string | null;
  delegacionMunicipio: string | null;
  estado: string | null;
  direccionCompleta: string | null;
}

export abstract class DireccionEntregaRepository {
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;
  abstract createDireccionEntrega(dto: CreateDireccionEntregaDto): Observable<void>;
  abstract getByVentaID(ventaID: number): Observable<DireccionEntrega | null>;
}
