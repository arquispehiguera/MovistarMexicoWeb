import { PlanOriginal } from '../entities/plan-original.entity';

export class PlanOriginalMapper {
  static fromDto(data: any): PlanOriginal {
    return new PlanOriginal(
      data.planOriginalId,
      data.nombre,
      data.activo,
      new Date(data.fechaCreacion)
    );
  }
}
