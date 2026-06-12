import { Component, input, output, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { APP_ICONS } from '../../../core/config/icons.config';
import { NotificacionBackendRepository } from '../../../domain/repositories/notificacion-backend.repository';
import { NotificacionBackendDto } from '../../../domain/dtos/notificacion-backend.dto';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-notifications-dropdown',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './notifications-dropdown.component.html'
})
export class NotificationsDropdownComponent {
  isOpen = input<boolean>(false);
  canSendComunicados = input<boolean>(false);

  close = output<void>();
  createComunicado = output<void>();

  notificaciones: NotificacionBackendDto[] = [];
  loading = false;
  expandedId: number | null = null; // Para expandir mensaje largo

  // Icons
  readonly BellIcon = APP_ICONS.Bell;
  readonly CheckIcon = APP_ICONS.Check;
  readonly CheckCheckIcon = APP_ICONS.CheckCheck;
  readonly MegaphoneIcon = APP_ICONS.Megaphone;
  readonly InboxIcon = APP_ICONS.Inbox;
  readonly XIcon = APP_ICONS.X;
  readonly Loader2Icon = APP_ICONS.Loader2;

  // Computed para el contador
  contador = computed(() => this.notificacionBackendRepo.contador());

  constructor(
    public notificacionBackendRepo: NotificacionBackendRepository,
    private toast: ToastService
  ) {
    // Cargar notificaciones cuando se abre el dropdown
    effect(() => {
      if (this.isOpen()) {
        this.cargarNotificaciones();
      }
    });
  }

  cargarNotificaciones(): void {
    this.loading = true;
    this.expandedId = null;
    this.notificacionBackendRepo.getNotificaciones(false).subscribe({
      next: (data) => {
        // Ordenar por fecha descendente y limitar a las últimas 10
        this.notificaciones = data
          .sort((a, b) => new Date(b.fechaEnvio).getTime() - new Date(a.fechaEnvio).getTime())
          .slice(0, 10);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.error('Error', 'No se pudieron cargar las notificaciones');
      }
    });
  }

  toggleExpand(notifId: number): void {
    this.expandedId = this.expandedId === notifId ? null : notifId;
  }

  isExpanded(notifId: number): boolean {
    return this.expandedId === notifId;
  }

  marcarComoLeida(notificacion: NotificacionBackendDto): void {
    if (notificacion.leido) return;

    this.notificacionBackendRepo.marcarLeidas([notificacion.notificacionID]).subscribe({
      next: () => {
        notificacion.leido = true;
        notificacion.fechaLectura = new Date().toISOString();
      }
    });
  }

  marcarTodasLeidas(): void {
    this.notificacionBackendRepo.marcarTodasLeidas().subscribe({
      next: () => {
        this.notificaciones.forEach(n => {
          n.leido = true;
          n.fechaLectura = new Date().toISOString();
        });
        this.toast.success('Listo', 'Todas las notificaciones marcadas como leídas');
      }
    });
  }

  onCreateComunicado(): void {
    this.createComunicado.emit();
    this.close.emit();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;

    return date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' });
  }
}
