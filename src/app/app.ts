

import { Component, effect } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { IdleService } from './core/services/idle.service';
import { GetAuthStateUseCase } from './domain/use-cases/auth.use-cases';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(
    private idleService: IdleService,
    private authState: GetAuthStateUseCase,
    private router: Router
  ) {
    // Iniciar/detener idle service según el estado de autenticación
    effect(() => {
      const user = this.authState.user();

      if (user) {
        // Usuario autenticado: iniciar monitoreo de inactividad
        this.idleService.start();
      } else {
        // Usuario no autenticado: detener monitoreo
        this.idleService.stop();
      }
    });

    // Detener idle service en la página de login
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url === '/login' || event.url === '/') {
          this.idleService.stop();
        }
      });
  }
}
