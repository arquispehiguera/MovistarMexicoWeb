import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { LogoutUseCase } from '../../domain/use-cases/auth.use-cases';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleTime = 900;
  private timeoutTime = 30;

  constructor(
    private idle: Idle,
    private router: Router,
    private logoutUseCase: LogoutUseCase,
    private toast: ToastService
  ) {
    this.configureIdle();
  }

  private configureIdle(): void {
    this.idle.setIdle(this.idleTime);
    this.idle.setTimeout(this.timeoutTime);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleStart.subscribe(() => {
      this.toast.warning(
        'Inactividad detectada',
        `Por inactividad, serás desconectado en ${this.timeoutTime} segundos.`
      );
    });

    this.idle.onTimeout.subscribe(() => {
      this.toast.error('Sesión cerrada', 'Tu sesión ha sido cerrada por inactividad.');
      this.logoutUseCase.execute().subscribe({
        complete: () => { this.router.navigate(['/login']); this.stop(); },
        error: () => { this.router.navigate(['/login']); this.stop(); }
      });
    });

    this.idle.onIdleEnd.subscribe(() => {});

    this.idle.onTimeoutWarning.subscribe(() => {});
  }

  start(): void { this.idle.watch(); }
  stop(): void { this.idle.stop(); }
}
