import { Component, signal, Input, Output, EventEmitter, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { APP_ICONS } from '../../../core/config/icons.config';
import { AuthRepository } from '../../../domain/repositories/auth.repository';
import { PerfilRepository } from '../../../domain/repositories/perfil.repository';
import { LogoutUseCase } from '../../../domain/use-cases/auth.use-cases';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SidebarComponent {
  // Inputs del layout
  @Input() isMobile: boolean = false;
  @Input() isOpen: boolean = true;
  @Input() isCollapsed: boolean = false;

  // Outputs para comunicar al layout
  @Output() onToggleCollapse = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  // Lucide Icons desde configuración centralizada
  readonly LayoutDashboard = APP_ICONS.LayoutDashboard;
  readonly Users = APP_ICONS.Users;
  readonly ChevronLeft = APP_ICONS.ChevronLeft;
  readonly ChevronRight = APP_ICONS.ChevronRight;
  readonly LogOut = APP_ICONS.LogOut;
  readonly X = APP_ICONS.X;
  readonly BookCheck = APP_ICONS.BookCheck;
  readonly Settings2 = APP_ICONS.Settings2;
  readonly ClipboardList = APP_ICONS.ClipboardList;
  readonly Database = APP_ICONS.Database;

  // Computed signals para datos del usuario desde localStorage
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

  userAvatar = computed(() => {
    const user = this.authRepo.user();
    if (!user) return 'U';

    // Obtener iniciales del nombre completo
    const nombres = user.nombres?.trim().split(' ') || [];
    const apellidoPaterno = user.apellidoPaterno?.trim() || '';

    const primeraInicial = nombres[0]?.[0]?.toUpperCase() || '';
    const segundaInicial = apellidoPaterno[0]?.toUpperCase() || '';

    return primeraInicial + segundaInicial || 'U';
  });

  // Computed para verificar si el usuario tiene acceso administrativo (roles 1 y 2)
  isAdmin = computed(() => {
    const user = this.authRepo.user();
    if (!user) return false;
    return user.rolID === 1 || user.rolID === 2;
  });

  // Computed para verificar si puede ver todo el sidebar (roles 1, 2 y 4)
  // Rol 4 (COORDINADOR) puede ver pero no editar
  canViewAll = computed(() => {
    const user = this.authRepo.user();
    if (!user) return false;
    return user.rolID === 1 || user.rolID === 2 || user.rolID === 4;
  });

  constructor(
    private authRepo: AuthRepository,
    private perfilRepo: PerfilRepository,
    private logoutUseCase: LogoutUseCase,
    private router: Router
  ) {}

  async ngOnInit() {
    // Cargar perfiles para poder mostrar el rol del usuario
    await this.perfilRepo.getPerfiles();
  }

  // Toggle collapse (desktop) o close (mobile)
  toggleSidebar(): void {
    if (this.isMobile) {
      this.onClose.emit();
    } else {
      this.onToggleCollapse.emit();
    }
  }

  // Logout con lógica real
  logout(): void {
    this.logoutUseCase.execute().subscribe({
      complete: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}
