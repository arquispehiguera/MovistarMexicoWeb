import { Plan } from '../entities/plan.entity';

export class PlanMapper {
  static fromDto(data: any): Plan {
    return new Plan(
      data.planId,
      data.nombre,
      data.activo,
      new Date(data.fechaCreacion)
    );
  }
}
