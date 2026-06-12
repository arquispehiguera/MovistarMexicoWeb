import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioTipificacionRepository } from '../repositories/usuario-tipificacion.repository';
import { UsuarioTipificacion } from '../entities/usuario-tipificacion.entity';

@Injectable({ providedIn: 'root' })
export class GetUsuarioTipificacionesByUsuarioCalendarioUseCase {
  constructor(private usuarioTipificacionRepository: UsuarioTipificacionRepository) {}

  execute(usuarioCalendarioID: number): Observable<void> {
    return this.usuarioTipificacionRepository.getByUsuarioCalendario(usuarioCalendarioID);
  }
}

@Injectable({ providedIn: 'root' })
export class CreateUsuarioTipificacionUseCase {
  constructor(private usuarioTipificacionRepository: UsuarioTipificacionRepository) {}

  execute(data: {
    usuarioCalendarioID: number;
    tipificacionCalendarioID: number;
    activo: boolean;
  }): Observable<UsuarioTipificacion> {
    return this.usuarioTipificacionRepository.create(data);
  }
}

@Injectable({ providedIn: 'root' })
export class UpdateUsuarioTipificacionUseCase {
  constructor(private usuarioTipificacionRepository: UsuarioTipificacionRepository) {}

  execute(
    usuarioTipificacionID: number,
    data: Partial<UsuarioTipificacion>
  ): Observable<UsuarioTipificacion> {
    return this.usuarioTipificacionRepository.update(usuarioTipificacionID, data);
  }
}
