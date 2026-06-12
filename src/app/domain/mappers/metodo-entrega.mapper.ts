import { MetodoEntrega } from '../entities/metodo-entrega.entity';

export class MetodoEntregaMapper {
  static fromDto(data: any): MetodoEntrega {
    return new MetodoEntrega(
      data.metodoEntregaId,
      data.nombre,
      data.activo,
      new Date(data.fechaCreacion)
    );
  }
}
