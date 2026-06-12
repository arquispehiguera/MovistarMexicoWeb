import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { DireccionFacturacion } from '../entities/direccion-facturacion.entity';

export interface CreateDireccionFacturacionDto {
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

export abstract class DireccionFacturacionRepository {
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;
  abstract createDireccionFacturacion(dto: CreateDireccionFacturacionDto): Observable<void>;
  abstract getByVentaID(ventaID: number): Observable<DireccionFacturacion | null>;
}
