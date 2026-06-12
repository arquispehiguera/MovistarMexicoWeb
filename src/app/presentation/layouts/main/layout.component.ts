import { Component, signal, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoaderService } from '../../../infrastructure/services/loader.service';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { NotificacionBackendRepository } from '../../../domain/repositories/notificacion-backend.repository';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './layout.html'
})
export class LayoutComponent implements OnInit, OnDestroy {
  // Estado del sidebar (abierto/cerrado en móvil)
  sidebarOpen = signal<boolean>(true);

  // Estado de collapse del sidebar (expandido/colapsado en desktop)
  sidebarCollapsed = signal<boolean>(false);

  // Detectar si estamos en móvil
  isMobile = signal<boolean>(false);

  constructor(
    public loader: LoaderService,
    private router: Router,
    private notificacionBackendRepo: NotificacionBackendRepository
  ) {
    // Inicializar según tamaño de pantalla
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const mobile = window.innerWidth < 768;
    this.isMobile.set(mobile);

    if (mobile) {
      // En móvil: sidebar cerrado por defecto
      this.sidebarOpen.set(false);
    } else {
      // En desktop: sidebar abierto por defecto
      this.sidebarOpen.set(true);
    }
  }

 ngOnInit(): void {
  this.loader.show();

  // Conectar SignalR para notificaciones en tiempo real
  this.notificacionBackendRepo.conectar();

  let firstNavigationHandled = false;
  this.router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      this.loader.show();
    }
    if (
      event instanceof NavigationEnd ||
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    ) {
      setTimeout(() => {
        this.loader.hide();
        firstNavigationHandled = true;
      }, 120);
    }
  });
  setTimeout(() => {
    if (!firstNavigationHandled) {
      this.loader.hide();
    }
  }, 2500);
}

  ngOnDestroy(): void {
    // Desconectar SignalR al salir del layout
    this.notificacionBackendRepo.desconectar();
  }
  // Toggle sidebar (usado por hamburguesa en móvil)
  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  // Toggle collapse (usado por botón de collapse en desktop)
  toggleCollapse() {
    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }
}
