import { Signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { Credentials } from '../entities/credentials.entity';
import { Usuario } from '../entities/usuario.entity';


export abstract class AuthRepository {
  // Signals de estado
  abstract user: WritableSignal<Usuario | null>;
  abstract isAuthenticated: Signal<boolean>;
  abstract loading: WritableSignal<boolean>;
  abstract error: WritableSignal<string | null>;

  // Métodos que modifican el estado (void, no retornan nada)
  abstract login(credentials: Credentials): Observable<void>;
  abstract logout(): Observable<void>;
  abstract getUserData(username: string): Observable<Usuario>;
  abstract refreshToken(): Observable<boolean>;
  abstract isTokenExpired(): boolean;
}
