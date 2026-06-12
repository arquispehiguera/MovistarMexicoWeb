import { Tematico } from '../entities/tematico.entity';

export class TematicoMapper {
  static fromDto(data: any): Tematico {
    return new Tematico(
      data.tematicoID,
      data.resultado,
      data.motivo,
      data.activo,
      new Date(data.fechaCreacion)
    );
  }
}
