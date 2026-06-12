import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardStats, DashboardFiltros } from '../models/dashboard-stats.model';

export abstract class DashboardRepository {
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;
  abstract stats: Signal<DashboardStats | null>;

  abstract getDashboardStats(filtros: DashboardFiltros): Observable<DashboardStats>;
  abstract getDashboardStatsByUsuario(usuarioID: number, filtros: DashboardFiltros): Observable<DashboardStats>;
}
