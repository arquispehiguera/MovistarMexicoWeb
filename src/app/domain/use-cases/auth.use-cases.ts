import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../repositories/auth.repository';
import { Credentials } from '../entities/credentials.entity';
import { Usuario } from '../entities/usuario.entity';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  get user() {
    return this.authRepository.user;
  }

  get loading() {
    return this.authRepository.loading;
  }

  get error() {
    return this.authRepository.error;
  }

  execute(credentials: Credentials): Observable<void> {
    return this.authRepository.login(credentials);
  }
}

@Injectable({ providedIn: 'root' })
export class LogoutUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(): Observable<void> {
    return this.authRepository.logout();
  }
}

@Injectable({ providedIn: 'root' })
export class GetUserDataUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(username: string): Observable<Usuario> {
    return this.authRepository.getUserData(username);
  }
}

@Injectable({ providedIn: 'root' })
export class GetAuthStateUseCase {
  constructor(private authRepository: AuthRepository) {}

  get user() {
    return this.authRepository.user;
  }

  get isAuthenticated() {
    return this.authRepository.isAuthenticated;
  }
}
