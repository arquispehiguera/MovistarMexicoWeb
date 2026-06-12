import { PlanDscto } from '../entities/plan-dscto.entity';

export class PlanDsctoMapper {
  static fromDto(data: any): PlanDscto {
    return new PlanDscto(
      data.planDsctoId,
      data.nombre,
      data.monto,
      data.activo,
      new Date(data.fechaCreacion)
    );
  }
}
