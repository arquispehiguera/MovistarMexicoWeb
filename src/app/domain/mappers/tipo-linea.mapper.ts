import { TipoLinea } from '../entities/tipo-linea.entity';

export class TipoLineaMapper {
  static fromDto(data: any): TipoLinea {
    return new TipoLinea(
      data.tipoLineaId,
      data.nombre,
      data.activo,
      new Date(data.fechaCreacion)
    );
  }
}
