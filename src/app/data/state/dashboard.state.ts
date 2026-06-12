import { Injectable, signal } from '@angular/core';
import { DashboardStats } from '../../domain/models/dashboard-stats.model';

@Injectable({ providedIn: 'root' })
export class DashboardState {
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly stats = signal<DashboardStats | null>(null);
}
