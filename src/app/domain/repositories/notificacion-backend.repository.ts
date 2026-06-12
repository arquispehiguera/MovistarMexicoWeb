import { Observable } from 'rxjs';
import { Signal, WritableSignal } from '@angular/core';
import {
  NotificacionBackendDto,
  ContadorNotificacionesDto,
  MarcarLeidasResponse,
  NotificacionSignalRDto
} from '../dtos/notificacion-backend.dto';

/**
 * Repository abstracto para la gestión de notificaciones del backend
 * Disponible para todos los usuarios
 */
export abstract class NotificacionBackendRepository {
  /**
   * Signal con el contador de notificaciones (no leídas y total)
   */
  abstract contador: WritableSignal<ContadorNotificacionesDto>;

  /**
   * Signal que emite cuando llega una nueva notificación por SignalR
   */
  abstract nuevaNotificacion: WritableSignal<NotificacionSignalRDto | null>;

  /**
   * Signal que indica si SignalR está conectado
   */
  abstract isConnected: Signal<boolean>;

  /**
   * Obtiene las notificaciones del usuario
   * @param soloNoLeidas Si es true, solo retorna las no leídas
   */
  abstract getNotificaciones(soloNoLeidas?: boolean): Observable<NotificacionBackendDto[]>;

  /**
   * Obtiene el contador de notificaciones
   */
  abstract getContador(): Observable<ContadorNotificacionesDto>;

  /**
   * Carga el contador y actualiza el signal
   */
  abstract cargarContador(): void;

  /**
   * Marca notificaciones específicas como leídas
   */
  abstract marcarLeidas(ids: number[]): Observable<MarcarLeidasResponse>;

  /**
   * Marca todas las notificaciones como leídas
   */
  abstract marcarTodasLeidas(): Observable<MarcarLeidasResponse>;

  /**
   * Conecta al hub de SignalR
   */
  abstract conectar(): Promise<void>;

  /**
   * Desconecta del hub de SignalR
   */
  abstract desconectar(): Promise<void>;
}
