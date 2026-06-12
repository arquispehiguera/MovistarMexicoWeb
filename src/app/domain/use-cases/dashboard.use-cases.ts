import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardRepository } from '../repositories/dashboard.repository';
import { DashboardStats, DashboardFiltros } from '../models/dashboard-stats.model';

@Injectable({
  providedIn: 'root'
})
export class GetDashboardStatsUseCase {
  constructor(private dashboardRepo: DashboardRepository) {}

  execute(filtros: DashboardFiltros): Observable<DashboardStats> {
    return this.dashboardRepo.getDashboardStats(filtros);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetDashboardStatsByUsuarioUseCase {
  constructor(private dashboardRepo: DashboardRepository) {}

  execute(usuarioID: number, filtros: DashboardFiltros): Observable<DashboardStats> {
    return this.dashboardRepo.getDashboardStatsByUsuario(usuarioID, filtros);
  }
}
