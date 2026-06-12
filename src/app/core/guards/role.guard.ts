import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Role } from '../../domain/enums/role.enum';

/**
 * Guard para control de acceso basado en roles
 *
 * Reglas de acceso:
 * - Rol 1 (ADMIN), 2 (SUPERVISOR): Acceso a TODAS las vistas
 * - Rol 3 (EJECUTIVO): Acceso solo a Dashboard, Tipificar y Ventas Registradas
 * - Rol 4 (COORDINADOR): Acceso a todas las vistas pero SOLO LECTURA (no puede editar/añadir)
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const authRepository = inject(AuthRepository);
  const router = inject(Router);

  const user = authRepository.user();

  // Si no hay usuario autenticado, redirigir a login
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const userRole = user.rolID;

  // Roles 1 y 2: Acceso total
  if (userRole === Role.Admin || userRole === Role.Manager) {
    return true;
  }

  // Rol 3 (EJECUTIVO): Acceso restringido a ciertas rutas
  if (userRole === Role.Ejecutivo) {
    const allowedRoutes = ['/dashboard', '/tipificacion', '/ventas-registradas'];
    const currentPath = state.url;

    const isAllowed = allowedRoutes.some(route => currentPath.startsWith(route));

    if (!isAllowed) {
      router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }

  // Rol 4 (COORDINADOR): Acceso a todas las vistas (solo lectura)
  // El control de edición se maneja en los componentes con PermissionService
  if (userRole === Role.Supervisor) {
    return true;
  }

  // Si el rol no es reconocido, denegar acceso
  router.navigate(['/dashboard']);
  return false;
};

/**
 * Guard específico para rutas de administración
 * Permite acceso a roles 1, 2 y 4 (COORDINADOR puede ver pero no editar)
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authRepository = inject(AuthRepository);
  const router = inject(Router);

  const user = authRepository.user();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  // Roles 1, 2 y 4 pueden acceder a rutas administrativas
  // Rol 4 (COORDINADOR) puede ver pero la edición está bloqueada en los componentes
  if (user.rolID === Role.Admin || user.rolID === Role.Manager || user.rolID === Role.Supervisor) {
    return true;
  }

  // Redirigir a dashboard si no tiene permisos
  router.navigate(['/dashboard']);
  return false;
};
