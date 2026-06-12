import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioTipificacion } from '../entities/usuario-tipificacion.entity';

export abstract class UsuarioTipificacionRepository {
  abstract usuariosTipificacion: Signal<UsuarioTipificacion[]>;
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;

  abstract getByUsuarioCalendario(usuarioCalendarioID: number): Observable<void>;
  abstract create(data: {
    usuarioCalendarioID: number;
    tipificacionCalendarioID: number;
    activo: boolean;
  }): Observable<UsuarioTipificacion>;
  abstract update(
    usuarioTipificacionID: number,
    data: Partial<UsuarioTipificacion>
  ): Observable<UsuarioTipificacion>;
}
