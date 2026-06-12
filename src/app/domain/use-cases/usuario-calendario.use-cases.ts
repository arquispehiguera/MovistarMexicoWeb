import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioCalendarioRepository } from '../repositories/usuario-calendario.repository';
import { UsuarioCalendario } from '../entities/usuario-calendario.entity';

@Injectable({ providedIn: 'root' })
export class GetUsuariosCalendarioUseCase {
  constructor(private usuarioCalendarioRepository: UsuarioCalendarioRepository) {}

  execute(): Observable<void> {
    return this.usuarioCalendarioRepository.getUsuariosCalendario();
  }
}

@Injectable({ providedIn: 'root' })
export class CreateUsuarioCalendarioUseCase {
  constructor(private usuarioCalendarioRepository: UsuarioCalendarioRepository) {}

  execute(data: {
    usuarioID: number;
    calendarioID: number;
    activo: boolean;
  }): Observable<UsuarioCalendario> {
    return this.usuarioCalendarioRepository.createUsuarioCalendario(data);
  }
}

@Injectable({ providedIn: 'root' })
export class UpdateUsuarioCalendarioUseCase {
  constructor(private usuarioCalendarioRepository: UsuarioCalendarioRepository) {}

  execute(
    usuarioCalendarioID: number,
    data: Partial<UsuarioCalendario>
  ): Observable<UsuarioCalendario> {
    return this.usuarioCalendarioRepository.updateUsuarioCalendario(usuarioCalendarioID, data);
  }
}
