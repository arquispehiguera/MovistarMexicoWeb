import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { DashboardRepository } from '../../domain/repositories/dashboard.repository';
import { DashboardStats, DashboardFiltros } from '../../domain/models/dashboard-stats.model';
import { environment } from '../../../environments/environment';
import { DashboardState } from '../state/dashboard.state';

@Injectable()
export class DashboardRepositoryImpl extends DashboardRepository {
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;
  private readonly state = inject(DashboardState);

  get loading() { return this.state.loading; }
  get error() { return this.state.error; }
  get stats() { return this.state.stats; }

  constructor(private http: HttpClient) {
    super();
  }

  private buildParams(filtros: DashboardFiltros): HttpParams {
    let params = new HttpParams()
      .set('tipoFiltro', filtros.tipoFiltro)
      .set('anio', filtros.anio.toString());

    if (filtros.mes !== undefined && filtros.mes !== null) {
      params = params.set('mes', filtros.mes.toString());
    }
    if (filtros.semana !== undefined && filtros.semana !== null) {
      params = params.set('semana', filtros.semana.toString());
    }
    if (filtros.dia !== undefined && filtros.dia !== null) {
      params = params.set('dia', filtros.dia.toString());
    }
    if (filtros.ejecutivoId !== undefined && filtros.ejecutivoId !== null) {
      params = params.set('ejecutivoId', filtros.ejecutivoId.toString());
    }

    return params;
  }

  getDashboardStats(filtros: DashboardFiltros): Observable<DashboardStats> {
    this.state.loading.set(true);
    this.state.error.set(null);

    const params = this.buildParams(filtros);

    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`, { params }).pipe(
      map(response => {
        this.state.stats.set(response);
        return response;
      }),
      catchError(err => {
        console.error('Error al obtener estadísticas del dashboard:', err);
        this.state.error.set('Error al cargar las estadísticas');
        return of(this.getEmptyStats(filtros));
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  getDashboardStatsByUsuario(usuarioID: number, filtros: DashboardFiltros): Observable<DashboardStats> {
    this.state.loading.set(true);
    this.state.error.set(null);

    const params = this.buildParams(filtros);

    return this.http.get<DashboardStats>(`${this.apiUrl}/stats/usuario/${usuarioID}`, { params }).pipe(
      map(response => {
        this.state.stats.set(response);
        return response;
      }),
      catchError(err => {
        console.error('Error al obtener estadísticas del usuario:', err);
        this.state.error.set('Error al cargar las estadísticas del usuario');
        return of(this.getEmptyStats(filtros));
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  private getEmptyStats(filtros: DashboardFiltros): DashboardStats {
    return {
      filtros,
      totalVentas: 0,
      totalGestiones: 0,
      periodoVentas: '-',
      tasaConversion: 0,
      contactosNoEfectivos: 0,
      noContactos: 0,
      tiempoPromedioGestion: 0,
      tiempoHastaVenta: 0,
      ratioIntentosExito: 0,
      ejecutivosLogueados: 0,
      mejorHorarioContacto: '-',
      distribucionResultados: [],
      motivosRechazo: [],
      portabilidadPorCompania: [],
      ventasPorTipoLinea: [],
      ventasPorPlan: [],
      ventasPorMetodoEntrega: [],
      ventasPorCicloFacturacion: [],
      ventasPorPeriodo: [],
      tendenciaConversion: [],
      topEjecutivos: []
    };
  }
}
