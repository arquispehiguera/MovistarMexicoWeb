import { RegistroVenta } from '../entities/registro-venta.entity';
import { DireccionEntrega } from '../entities/direccion-entrega.entity';
import { DireccionFacturacion } from '../entities/direccion-facturacion.entity';

export interface VentaCompleta {
  venta: RegistroVenta;
  direccionEntrega: DireccionEntrega | null;
  direccionFacturacion: DireccionFacturacion | null;
}
