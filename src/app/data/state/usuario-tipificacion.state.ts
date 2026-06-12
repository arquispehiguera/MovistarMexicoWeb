import { Injectable, signal } from '@angular/core';
import { UsuarioTipificacion } from '../../domain/entities/usuario-tipificacion.entity';

@Injectable({ providedIn: 'root' })
export class UsuarioTipificacionState {
  readonly usuariosTipificacion = signal<UsuarioTipificacion[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
