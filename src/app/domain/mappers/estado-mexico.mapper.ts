import { EstadoMexico } from '../entities/estado-mexico.entity';

export class EstadoMexicoMapper {
  static fromDto(data: any): EstadoMexico {
    return new EstadoMexico(
      data.estadoId,
      data.nombre,
      data.activo,
      new Date(data.fechaCreacion)
    );
  }
}
