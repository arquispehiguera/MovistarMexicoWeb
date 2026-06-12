import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { driver, DriveStep, Config } from 'driver.js';
import { filter } from 'rxjs/operators';

export interface TourConfig {
  steps: DriveStep[];
  onComplete?: () => void;
}

@Injectable({ providedIn: 'root' })
export class TourService {
  private router = inject(Router);
  private currentRoute = '';

  constructor() {
    // Detectar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });

    // Ruta inicial
    this.currentRoute = this.router.url;
  }

  /**
   * Inicia el tour para la vista actual
   */
  startTour(): void {
    const config = this.getTourConfig();
    if (!config) return;

    const driverInstance = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      stagePadding: 10,
      stageRadius: 8,
      popoverClass: 'movistar-tour-popover',
      progressText: '{{current}} de {{total}}',
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      steps: config.steps,
      onDestroyStarted: () => {
        if (config.onComplete) {
          config.onComplete();
        }
        driverInstance.destroy();
      }
    });

    driverInstance.drive();
  }

  /**
   * Obtiene la configuración del tour según la ruta actual
   */
  private getTourConfig(): TourConfig | null {
    // Normalizar la ruta
    const route = this.currentRoute.split('?')[0];

    // Tours por ruta
    const tours: Record<string, TourConfig> = {
      '/dashboard': this.getDashboardTour(),
      '/usuarios': this.getUsuariosTour(),
      '/calendarios/generales': this.getCalendariosTour(),
      '/ventas-registradas': this.getVentasTour(),
    };

    // Buscar tour exacto o por prefijo
    if (tours[route]) {
      return tours[route];
    }

    // Buscar por prefijo
    for (const [path, tour] of Object.entries(tours)) {
      if (route.startsWith(path)) {
        return tour;
      }
    }

    // Tour genérico si no hay específico
    return this.getGenericTour();
  }

  /**
   * Tour del Dashboard
   */
  private getDashboardTour(): TourConfig {
    return {
      steps: [
        {
          element: 'app-header',
          popover: {
            title: 'Barra de navegación',
            description: 'Aquí encontrarás las notificaciones, tu perfil y configuración del sistema.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '.sidebar-container, app-sidebar, nav',
          popover: {
            title: 'Menú lateral',
            description: 'Navega entre las diferentes secciones del sistema: Dashboard, Usuarios, Calendarios y más.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '[data-tour="notifications"]',
          popover: {
            title: 'Notificaciones',
            description: 'Recibe alertas en tiempo real sobre comunicados y actualizaciones importantes.',
            side: 'bottom',
            align: 'end'
          }
        },
        {
          element: '[data-tour="stats-cards"]',
          popover: {
            title: 'Estadísticas principales',
            description: 'Visualiza las métricas clave del día: ventas, agendamientos y rendimiento.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '[data-tour="chart"]',
          popover: {
            title: 'Gráficos de rendimiento',
            description: 'Analiza las tendencias de ventas y operaciones en el tiempo.',
            side: 'top',
            align: 'center'
          }
        }
      ]
    };
  }

  /**
   * Tour de Usuarios
   */
  private getUsuariosTour(): TourConfig {
    return {
      steps: [
        {
          element: '[data-tour="user-search"]',
          popover: {
            title: 'Búsqueda de usuarios',
            description: 'Filtra usuarios por nombre, RUT o correo electrónico.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '[data-tour="user-filters"]',
          popover: {
            title: 'Filtros avanzados',
            description: 'Filtra por rol, estado activo/inactivo y otros criterios.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '[data-tour="new-user"]',
          popover: {
            title: 'Crear usuario',
            description: 'Agrega nuevos usuarios al sistema con sus datos y permisos.',
            side: 'left',
            align: 'start'
          }
        },
        {
          element: '[data-tour="user-table"]',
          popover: {
            title: 'Lista de usuarios',
            description: 'Visualiza, edita y gestiona todos los usuarios del sistema.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '[data-tour="export-options"]',
          popover: {
            title: 'Exportar datos',
            description: 'Descarga la información en formato CSV o PDF.',
            side: 'left',
            align: 'start'
          }
        }
      ]
    };
  }

  /**
   * Tour de Calendarios
   */
  private getCalendariosTour(): TourConfig {
    return {
      steps: [
        {
          element: '[data-tour="calendar-nav"]',
          popover: {
            title: 'Navegación de fechas',
            description: 'Usa las flechas para moverte entre semanas o meses.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '[data-tour="calendar-view"]',
          popover: {
            title: 'Vista del calendario',
            description: 'Visualiza los bloques de tiempo disponibles y ocupados.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '[data-tour="calendar-actions"]',
          popover: {
            title: 'Acciones rápidas',
            description: 'Crea, edita o elimina bloques de tiempo desde aquí.',
            side: 'left',
            align: 'start'
          }
        }
      ]
    };
  }

  /**
   * Tour de Ventas Registradas
   */
  private getVentasTour(): TourConfig {
    return {
      steps: [
        {
          element: '[data-tour="ventas-filters"]',
          popover: {
            title: 'Filtros de ventas',
            description: 'Filtra por fecha, ejecutivo, estado y tipo de venta.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '[data-tour="ventas-table"]',
          popover: {
            title: 'Registro de ventas',
            description: 'Consulta el detalle de cada venta registrada en el sistema.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '[data-tour="ventas-detail"]',
          popover: {
            title: 'Ver detalle',
            description: 'Haz clic en el ícono del ojo para ver toda la información de la venta.',
            side: 'left',
            align: 'center'
          }
        }
      ]
    };
  }

  /**
   * Tour genérico para vistas sin tour específico
   */
  private getGenericTour(): TourConfig {
    return {
      steps: [
        {
          element: 'app-header',
          popover: {
            title: 'Bienvenido al sistema',
            description: 'Este es tu centro de control. Desde aquí puedes acceder a todas las funcionalidades.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '.sidebar-container, app-sidebar, nav',
          popover: {
            title: 'Menú de navegación',
            description: 'Explora las diferentes secciones disponibles según tu rol.',
            side: 'right',
            align: 'start'
          }
        },
        {
          popover: {
            title: '¿Necesitas ayuda?',
            description: 'Puedes iniciar este tour en cualquier momento desde el menú de tu perfil > Ayuda.',
          }
        }
      ]
    };
  }
}
