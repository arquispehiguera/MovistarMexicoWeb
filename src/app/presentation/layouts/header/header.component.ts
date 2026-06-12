import { Component, ElementRef, HostListener, EventEmitter, Output, Input, computed } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { APP_ICONS } from '../../../core/config/icons.config';
import { AvatarService } from '../../../infrastructure/services/avatar.service';
import { NotificacionBackendRepository } from '../../../domain/repositories/notificacion-backend.repository';
import { AuthRepository } from '../../../domain/repositories/auth.repository';
import { PerfilRepository } from '../../../domain/repositories/perfil.repository';
import { LogoutUseCase } from '../../../domain/use-cases/auth.use-cases';
import { TourService } from '../../../infrastructure/services/tour.service';
import { NotificationsDropdownComponent } from '../../components/notifications-dropdown/notifications-dropdown.component';
import { CreateComunicadoModalComponent } from '../../components/create-comunicado-modal/create-comunicado-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideAngularModule, NotificationsDropdownComponent, CreateComunicadoModalComponent],
  templateUrl: './header.html',
})
export class HeaderComponent {

  open = false;
  avatarUrl = '';
  notificationsOpen = false;
  comunicadoModalOpen = false;

  // Input del layout
  @Input() isMobile: boolean = false;

  @Output() toggleSidebar = new EventEmitter<void>();

  // Lucide Icons desde configuración centralizada
  readonly Menu = APP_ICONS.Menu;
  readonly SettingsIcon = APP_ICONS.Settings;
  readonly LogOut = APP_ICONS.LogOut;
  readonly UserIcon = APP_ICONS.User;
  readonly Bell = APP_ICONS.Bell;
  readonly MessageCircle = APP_ICONS.MessageCircle;
  readonly ChevronRight = APP_ICONS.ChevronRight;
  readonly HelpCircle = APP_ICONS.HelpCircle;

  // Computed signals para datos del usuario
  userName = computed(() => {
    const user = this.authRepo.user();
    if (!user) return 'Usuario';

    const nombreCompleto = [
      user.nombres,
      user.apellidoPaterno,
      user.apellidoMaterno
    ].filter(Boolean).join(' ');

    return nombreCompleto || 'Usuario';
  });

  userRole = computed(() => {
    const user = this.authRepo.user();
    if (!user) return 'Sin rol';

    const perfil = this.perfilRepo.perfiles().find(p => p.rolID === user.rolID);
    return perfil?.nombreRol || 'Sin rol';
  });

  // Verificar si el usuario puede enviar comunicados (Admin, Supervisor, Coordinador)
  // Roles 1, 2 y 4 pueden enviar. Rol 3 (Ejecutivo) solo lee
  canSendComunicados = computed(() => {
    const user = this.authRepo.user();
    return user?.rolID === 1 || user?.rolID === 2 || user?.rolID === 4;
  });

  // Contador de notificaciones no leídas
  notificacionesNoLeidas = computed(() => this.notificacionBackendRepo.contador().noLeidas);

  constructor(
    private eRef: ElementRef,
    private avatarService: AvatarService,
    public notificacionBackendRepo: NotificacionBackendRepository,
    private authRepo: AuthRepository,
    private perfilRepo: PerfilRepository,
    private logoutUseCase: LogoutUseCase,
    private router: Router,
    private tourService: TourService
  ) {}

  startTour(): void {
    this.open = false; // Cerrar el menú del avatar
    // Pequeño delay para que se cierre el menú antes de iniciar el tour
    setTimeout(() => {
      this.tourService.startTour();
    }, 300);
  }

  ngOnInit() {
    // Cargar perfiles para poder mostrar el rol del usuario
    this.perfilRepo.getPerfiles().subscribe();

    // Generar avatar con los datos del usuario actual
    const user = this.authRepo.user();
    if (user) {
      const nombreCompleto = [
        user.nombres,
        user.apellidoPaterno,
        user.apellidoMaterno
      ].filter(Boolean).join(' ');

      this.avatarUrl = this.avatarService.buildAvatarUrl(nombreCompleto || 'Usuario', 60);
    } else {
      this.avatarUrl = this.avatarService.buildAvatarUrl('Usuario', 60);
    }
  }

  toggle() {
    this.open = !this.open;
  }

  toggleNotifications() {
    this.notificationsOpen = !this.notificationsOpen;
    // Cerrar menú de usuario si está abierto
    if (this.notificationsOpen) {
      this.open = false;
    }
  }

  closeNotifications() {
    this.notificationsOpen = false;
  }

  openComunicadoModal() {
    this.comunicadoModalOpen = true;
  }

  closeComunicadoModal() {
    this.comunicadoModalOpen = false;
  }

  logout(): void {
    this.logoutUseCase.execute().subscribe({
      complete: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.open = false;
      this.notificationsOpen = false;
    }
  }
}
