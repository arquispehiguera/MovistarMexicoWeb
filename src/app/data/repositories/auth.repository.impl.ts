import { Injectable, Signal, WritableSignal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, finalize, switchMap } from 'rxjs/operators';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Credentials } from '../../domain/entities/credentials.entity';
import { Usuario } from '../../domain/entities/usuario.entity';
import { AuthResponse, RefreshTokenResponse } from '../../domain/dtos/login-response.dto';
import { UsuarioMapper } from '../../domain/mappers/usuario.mapper';
import { environment } from '../../../environments/environment';
import { UsuarioRepository } from '../../domain/repositories/usuario.repository';
import { ApiResponse } from '../../domain/models/api-response.model';
import { AuthState } from '../state/auth.state';


@Injectable()
export class AuthRepositoryImpl extends AuthRepository {

  private readonly apiUrl = `${environment.apiUrl}/Auth`;
  private usuarioRepository = inject(UsuarioRepository);
  private readonly state = inject(AuthState);

  get user(): WritableSignal<Usuario | null> { return this.state.user; }
  get loading(): WritableSignal<boolean> { return this.state.loading; }
  get error(): WritableSignal<string | null> { return this.state.error; }
  get isAuthenticated(): Signal<boolean> { return this.state.isAuthenticated; }

  constructor(private http: HttpClient) {
    super();
    // Recuperar usuario desde localStorage al inicializar
    this.loadUserFromStorage();
  }

  // Cargar usuario desde localStorage
  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user_data');
    if (userJson) {
      try {
        const raw = JSON.parse(userJson);
        const usuario = UsuarioMapper.fromStorage(raw);
        if (usuario) {
          this.state.user.set(usuario);
        } else {
          localStorage.removeItem('user_data');
        }
      } catch (error) {
        console.error('Error al recuperar usuario desde localStorage', error);
        localStorage.removeItem('user_data');
      }
    }
  }

  // =========================
  // LOGIN
  // =========================
  login(credentials: Credentials): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      switchMap(response => {
        if (!response) {
          throw new Error('Respuesta inválida del servidor');
        }

        // 1️⃣ Guardar tokens
        localStorage.setItem('access_token', response.token);
        localStorage.setItem('refresh_token', response.refreshToken);
        localStorage.setItem('expires_in', response.expiresIn.toString());

        // 2️⃣ Construir usuario (alineado a tu entidad Usuario)
        const usuario = UsuarioMapper.fromAuthResponse(response);

        // 3️⃣ Guardar usuario en localStorage
        localStorage.setItem('user_data', JSON.stringify(usuario));

        // 4️⃣ Actualizar estado
        this.state.user.set(usuario);

        // 5️⃣ Actualizar estado de conexión en el servidor
        return this.usuarioRepository.updateConnectionStatus(usuario.usuarioID, {
          lastConnection: new Date().toISOString(),
          isLogged: true
        });
      }),
      map(() => undefined),
      catchError(error => {
        const errorMessage =
          error?.error?.message ||
          error?.message ||
          'Error al iniciar sesión. Verifica tus credenciales.';
        this.state.error.set(errorMessage);
        return throwError(() => error);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }


  // =========================
  // LOGOUT
  // =========================
  logout(): Observable<void> {
    // Obtener el usuarioID antes de limpiar
    const currentUser = this.state.user();

    const cleanup = () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('expires_in');
      localStorage.removeItem('user_data');
      this.state.user.set(null);
      this.state.error.set(null);
    };

    // Actualizar estado de conexión en el servidor
    if (currentUser?.usuarioID) {
      return this.usuarioRepository.updateConnectionStatus(currentUser.usuarioID, {
        lastConnection: new Date().toISOString(),
        isLogged: false
      }).pipe(
        map(() => { cleanup(); }),
        catchError(err => {
          cleanup();
          return throwError(() => err);
        })
      );
    }

    cleanup();
    return of(undefined);
  }

  // =========================
  // GET USER DATA
  // =========================
  getUserData(username: string): Observable<Usuario> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/user/${username}`).pipe(
      map(wrapper => {
        if (!wrapper || !wrapper.data) {
          throw new Error('No se pudo obtener los datos del usuario');
        }

        const response = wrapper.data;

        return UsuarioMapper.fromAuthResponse({
          ...response,
          rolID: 0,
          grantDelete: response.grantDelete ?? 0,
          token: '',
          refreshToken: '',
          expiresIn: 0
        });
      }),
      catchError(err => throwError(() => err))
    );
  }

  // =========================
  // REFRESH TOKEN
  // =========================
  refreshToken(): Observable<boolean> {
    const currentRefreshToken = localStorage.getItem('refresh_token');

    if (!currentRefreshToken) {
      this.logout().subscribe();
      return of(false);
    }

    return this.http.post<ApiResponse<RefreshTokenResponse>>(`${this.apiUrl}/refresh`, {
      refreshToken: currentRefreshToken
    }).pipe(
      map(wrapper => {
        if (!wrapper || !wrapper.data) {
          throw new Error('No se pudo refrescar el token');
        }

        const response = wrapper.data;

        // Actualizar tokens
        localStorage.setItem('access_token', response.token);
        localStorage.setItem('refresh_token', response.refreshToken);
        localStorage.setItem('expires_in', response.expiresIn.toString());

        return true;
      }),
      catchError(error => {
        console.error('Error al refrescar token:', error);
        this.logout().subscribe();
        return of(false);
      })
    );
  }

  // =========================
  // IS TOKEN EXPIRED
  // =========================
  isTokenExpired(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return true;
    }

    try {
      // Decodificar el JWT para obtener la fecha de expiración
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(payload.exp * 1000);
      const now = new Date();

      // Considerar expirado si faltan menos de 5 minutos
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

      return expirationDate <= fiveMinutesFromNow;
    } catch (error) {
      console.error('Error al verificar expiración del token:', error);
      return true;
    }
  }
}
