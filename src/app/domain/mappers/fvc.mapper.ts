import { Fvc } from '../entities/fvc.entity';

export class FvcMapper {
  static fromDto(data: any): Fvc {
    return new Fvc(
      data.fvcId,
      data.descripcion,
      data.activo,
      new Date(data.fechaCreacion)
    );
  }
}
