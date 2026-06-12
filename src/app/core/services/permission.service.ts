import { Injectable, inject, computed, Signal } from '@angular/core';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Role } from '../../domain/enums/role.enum';

/**
 * Servicio de permisos basado en roles
 *
 * Roles:
 * - 1 (ADMIN): Control total
 * - 2 (SUPERVISOR): Control total
 * - 3 (EJECUTIVO): Registrar ventas y tipificar
 * - 4 (COORDINADOR): Solo visualizar, NO puede editar ni añadir
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private authRepository = inject(AuthRepository);

  /** Roles que tienen permisos de edición completos */
  private readonly EDIT_ROLES = [Role.Admin, Role.Manager]; // ADMIN, SUPERVISOR

  /** Roles que pueden crear/editar en sus áreas específicas */
  private readonly EJECUTIVO_ROLE = Role.Ejecutivo;

  /** Rol de solo lectura */
  private readonly COORDINADOR_ROLE = Role.Supervisor;

  /** Signal computado: ¿Puede el usuario editar/crear? */
  canEdit: Signal<boolean> = computed(() => {
    const user = this.authRepository.user();
    if (!user) return false;

    // Roles 1 y 2 pueden editar todo
    // Rol 3 puede editar en sus áreas (tipificación, ventas)
    return this.EDIT_ROLES.includes(user.rolID) || user.rolID === this.EJECUTIVO_ROLE;
  });

  /** Signal computado: ¿Es administrador o supervisor? */
  isAdmin: Signal<boolean> = computed(() => {
    const user = this.authRepository.user();
    if (!user) return false;
    return this.EDIT_ROLES.includes(user.rolID);
  });

  /** Signal computado: ¿Es coordinador (solo lectura)? */
  isReadOnly: Signal<boolean> = computed(() => {
    const user = this.authRepository.user();
    if (!user) return false;
    return user.rolID === this.COORDINADOR_ROLE;
  });

  /** Signal computado: ¿Es ejecutivo? */
  isEjecutivo: Signal<boolean> = computed(() => {
    const user = this.authRepository.user();
    if (!user) return false;
    return user.rolID === this.EJECUTIVO_ROLE;
  });

  /** Obtiene el rol actual del usuario */
  getCurrentRole(): number | null {
    const user = this.authRepository.user();
    return user?.rolID ?? null;
  }

  /** Verifica si el usuario puede realizar una acción específica */
  canPerformAction(action: 'create' | 'edit' | 'delete' | 'view'): boolean {
    const user = this.authRepository.user();
    if (!user) return false;

    switch (action) {
      case 'view':
        // Todos los roles pueden ver
        return true;

      case 'create':
      case 'edit':
      case 'delete':
        // Solo ADMIN y SUPERVISOR pueden crear/editar/eliminar en configuraciones
        // COORDINADOR no puede hacer nada de esto
        return this.EDIT_ROLES.includes(user.rolID);
    }
  }

  /** Verifica si puede editar en un módulo específico */
  canEditModule(module: 'generales' | 'usuarios' | 'regiones' | 'tematicos' | 'marca-modelo' | 'tipificacion' | 'ventas'): boolean {
    const user = this.authRepository.user();
    if (!user) return false;

    // ADMIN y SUPERVISOR pueden editar todo
    if (this.EDIT_ROLES.includes(user.rolID)) {
      return true;
    }

    // EJECUTIVO solo puede editar en tipificación y ventas
    if (user.rolID === this.EJECUTIVO_ROLE) {
      return ['tipificacion', 'ventas'].includes(module);
    }

    // COORDINADOR no puede editar nada
    return false;
  }
}
