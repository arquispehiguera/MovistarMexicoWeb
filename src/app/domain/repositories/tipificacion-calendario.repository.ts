import { Observable } from 'rxjs';
import { TipificacionCalendario } from '../entities/tipificacion-calendario.entity';
import { UpdateTipificacionCalendarioDto } from '../use-cases/tipificacion-calendario.use-cases';

export abstract class TipificacionCalendarioRepository {
  abstract getAll(): Observable<TipificacionCalendario[]>;
  abstract getByCalendarioId(calendarioId: number): Observable<TipificacionCalendario[]>;
  abstract update(data: UpdateTipificacionCalendarioDto): Observable<void>;
}
