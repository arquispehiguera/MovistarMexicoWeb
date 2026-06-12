import { Injectable, signal } from '@angular/core';
import { UsuarioCalendario } from '../../domain/entities/usuario-calendario.entity';

@Injectable({ providedIn: 'root' })
export class UsuarioCalendarioState {
  readonly usuariosCalendario = signal<UsuarioCalendario[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
