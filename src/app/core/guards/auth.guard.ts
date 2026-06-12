import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthRepository } from '../../domain/repositories/auth.repository';

export const authGuard: CanActivateFn = async (route, state) => {
  const authRepository = inject(AuthRepository);
  const router = inject(Router);

  // Verificar si el usuario está autenticado
  if (!authRepository.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Verificar si el token está expirado
  if (authRepository.isTokenExpired()) {
    // Intentar refrescar el token
    const refreshed = await authRepository.refreshToken();

    if (!refreshed) {
      router.navigate(['/login']);
      return false;
    }
  }

  return true;
};

export const publicGuard: CanActivateFn = (route, state) => {
  const authRepository = inject(AuthRepository);
  const router = inject(Router);

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (authRepository.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
