import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioCalendario } from '../entities/usuario-calendario.entity';

export abstract class UsuarioCalendarioRepository {
  abstract usuariosCalendario: Signal<UsuarioCalendario[]>;
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;

  abstract getUsuariosCalendario(): Observable<void>;
  abstract createUsuarioCalendario(data: {
    usuarioID: number;
    calendarioID: number;
    activo: boolean;
  }): Observable<UsuarioCalendario>;
  abstract updateUsuarioCalendario(
    usuarioCalendarioID: number,
    data: Partial<UsuarioCalendario>
  ): Observable<UsuarioCalendario>;
}
