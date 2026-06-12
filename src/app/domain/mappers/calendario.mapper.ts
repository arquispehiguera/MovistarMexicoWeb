import { Calendario } from '../entities/calendario.entity';

export class CalendarioMapper {
  static fromDto(data: any): Calendario {
    return new Calendario(
      data.calendarioID,
      data.nombreCalendario,
      data.descripcion,
      data.horaInicio,
      data.horaFin,
      data.diasAnticipacionMaxima,
      data.intervaloSlots,
      data.activo,
      new Date(data.fechaCreacion),
      data.usuarioCreacion
    );
  }
}
