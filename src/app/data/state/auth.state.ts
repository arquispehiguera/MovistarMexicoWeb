import { Injectable, Signal, WritableSignal, signal, computed } from '@angular/core';
import { Usuario } from '../../domain/entities/usuario.entity';

@Injectable({ providedIn: 'root' })
export class AuthState {
  readonly user: WritableSignal<Usuario | null> = signal<Usuario | null>(null);
  readonly loading: WritableSignal<boolean> = signal(false);
  readonly error: WritableSignal<string | null> = signal(null);
  readonly isAuthenticated: Signal<boolean> = computed(() => !!this.user());
}
