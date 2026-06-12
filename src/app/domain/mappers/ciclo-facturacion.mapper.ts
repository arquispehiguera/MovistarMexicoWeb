import { CicloFacturacion } from '../entities/ciclo-facturacion.entity';

export class CicloFacturacionMapper {
  static fromDto(data: any): CicloFacturacion {
    return new CicloFacturacion(
      data.cicloFacturacionId,
      data.codigo,
      data.activo,
      new Date(data.fechaCreacion)
    );
  }
}
