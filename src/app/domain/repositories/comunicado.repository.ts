import { Observable } from 'rxjs';
import {
  ComunicadoDto,
  CreateComunicadoDto,
  UpdateComunicadoDto,
  CreateComunicadoResponse
} from '../models/comunicado.model';

/**
 * Repository abstracto para la gestión de comunicados
 * Solo disponible para roles 1 y 2
 */
export abstract class ComunicadoRepository {
  /**
   * Obtiene todos los comunicados
   */
  abstract getAll(): Observable<ComunicadoDto[]>;

  /**
   * Obtiene un comunicado por su ID
   */
  abstract getById(id: number): Observable<ComunicadoDto>;

  /**
   * Crea un nuevo comunicado
   */
  abstract create(dto: CreateComunicadoDto): Observable<CreateComunicadoResponse>;

  /**
   * Actualiza un comunicado existente
   */
  abstract update(dto: UpdateComunicadoDto): Observable<void>;

  /**
   * Desactiva un comunicado (soft delete)
   */
  abstract delete(id: number): Observable<void>;
}
