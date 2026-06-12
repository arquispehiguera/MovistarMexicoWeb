import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { LucideAngularModule } from 'lucide-angular';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { APP_ICONS } from '../../../core/config/icons.config';
import { GetDashboardStatsUseCase, GetDashboardStatsByUsuarioUseCase } from '../../../domain/use-cases/dashboard.use-cases';
import { DashboardStats, DashboardFiltros, TipoFiltro } from '../../../domain/models/dashboard-stats.model';
import { GetAuthStateUseCase } from '../../../domain/use-cases/auth.use-cases';
import { SpinnerComponent } from '../../components/spinner/spinner';
import { DashboardChartsConfigService } from './dashboard-charts-config.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    LucideAngularModule,
    NgxEchartsDirective,
    SpinnerComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  // Icons
  readonly TrendingUp = APP_ICONS.TrendingUp;
  readonly ShoppingCart = APP_ICONS.ShoppingCart;
  readonly Clock = APP_ICONS.Clock;
  readonly Users = APP_ICONS.Users;
  readonly RefreshCw = APP_ICONS.RefreshCw;
  readonly Target = APP_ICONS.Target;
  readonly Phone = APP_ICONS.Phone;
  readonly CheckCircle = APP_ICONS.CheckCircle;
  readonly XCircle = APP_ICONS.XCircle;
  readonly BarChart3 = APP_ICONS.BarChart3;
  readonly BarChart2 = APP_ICONS.BarChart2;
  readonly CalendarX2 = APP_ICONS.CalendarX2;
  readonly Calendar = APP_ICONS.Calendar;

  stats = signal<DashboardStats | null>(null);
  isLoading = signal(true);

  selectedTipoFiltro = signal<TipoFiltro>('mes');
  selectedAnio = signal(new Date().getFullYear());
  selectedMes = signal(new Date().getMonth() + 1);
  selectedSemana = signal(1);
  selectedDia = signal(new Date().getDate());

  tiposFiltro: { value: TipoFiltro; label: string }[] = [
    { value: 'dia', label: 'Día' },
    { value: 'semana', label: 'Semana' },
    { value: 'mes', label: 'Mes' },
    { value: 'anio', label: 'Año' }
  ];

  anios: number[] = [];
  meses = [
    { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' }, { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' }, { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' }
  ];
  semanas = [
    { value: 1, label: 'Semana 1' }, { value: 2, label: 'Semana 2' },
    { value: 3, label: 'Semana 3' }, { value: 4, label: 'Semana 4' },
    { value: 5, label: 'Semana 5' }
  ];
  dias: number[] = [];

  showMesSelector = computed(() => ['dia', 'semana', 'mes'].includes(this.selectedTipoFiltro()));
  showSemanaSelector = computed(() => this.selectedTipoFiltro() === 'semana');
  showDiaSelector = computed(() => this.selectedTipoFiltro() === 'dia');

  canViewGlobalMetrics = computed(() => {
    const user = this.authState.user();
    return user ? [1, 2, 4].includes(user.rolID) : false;
  });

  // Chart options
  resultadosDonutOptions!: EChartsOption;
  areaChartOptions!: EChartsOption;
  barChartOptions!: EChartsOption;
  tendenciaOptions!: EChartsOption;
  portabilidadCompaniaOptions!: EChartsOption;
  tipoLineaOptions!: EChartsOption;
  planOptions!: EChartsOption;
  metodoEntregaOptions!: EChartsOption;
  cicloFacturacionOptions!: EChartsOption;

  // Visibility signals
  hasVentasPorPeriodo = signal(false);
  hasDistribucionResultados = signal(false);
  hasTendenciaConversion = signal(false);
  hasPortabilidadPorCompania = signal(false);
  hasTopEjecutivos = signal(false);
  hasVentasPorTipoLinea = signal(false);
  hasVentasPorPlan = signal(false);
  hasVentasPorMetodoEntrega = signal(false);
  hasVentasPorCicloFacturacion = signal(false);

  constructor(
    private getDashboardStatsUseCase: GetDashboardStatsUseCase,
    private getDashboardStatsByUsuarioUseCase: GetDashboardStatsByUsuarioUseCase,
    private authState: GetAuthStateUseCase,
    private chartsConfig: DashboardChartsConfigService
  ) {
    const currentYear = new Date().getFullYear();
    for (let year = 2024; year <= currentYear + 1; year++) this.anios.push(year);
    for (let day = 1; day <= 31; day++) this.dias.push(day);
  }

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.isLoading.set(true);
    const user = this.authState.user();
    const tipoFiltro = this.selectedTipoFiltro();

    const filtros: DashboardFiltros = { tipoFiltro, anio: this.selectedAnio() };
    if (['dia', 'semana', 'mes'].includes(tipoFiltro)) filtros.mes = this.selectedMes();
    if (tipoFiltro === 'semana') filtros.semana = this.selectedSemana();
    if (tipoFiltro === 'dia') filtros.dia = this.selectedDia();

    const stats$ = this.canViewGlobalMetrics()
      ? this.getDashboardStatsUseCase.execute(filtros)
      : this.getDashboardStatsByUsuarioUseCase.execute(user!.usuarioID, filtros);

    stats$.subscribe({
      next: (data) => {
        this.stats.set(data);
        this.buildCharts(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onFiltroChange(): void { this.loadDashboardStats(); }
  refreshData(): void { this.loadDashboardStats(); }

  getMesNombre(mes: number): string {
    return this.meses.find(m => m.value === mes)?.label || '';
  }

  private hasData(arr: any[] | undefined): boolean {
    if (!arr || arr.length === 0) return false;
    return arr.some(item =>
      (item.cantidad && item.cantidad > 0) ||
      (item.efectivos && item.efectivos > 0) ||
      (item.intentos && item.intentos > 0) ||
      (item.ventas && item.ventas > 0)
    );
  }

  private buildCharts(data: DashboardStats): void {
    this.hasVentasPorPeriodo.set(false);
    this.hasDistribucionResultados.set(false);
    this.hasTendenciaConversion.set(false);
    this.hasPortabilidadPorCompania.set(false);
    this.hasTopEjecutivos.set(false);
    this.hasVentasPorTipoLinea.set(false);
    this.hasVentasPorPlan.set(false);
    this.hasVentasPorMetodoEntrega.set(false);
    this.hasVentasPorCicloFacturacion.set(false);

    if (this.hasData(data.ventasPorPeriodo)) {
      this.areaChartOptions = this.chartsConfig.buildAreaChart(data);
      this.hasVentasPorPeriodo.set(true);
    }
    if (this.hasData(data.distribucionResultados)) {
      this.resultadosDonutOptions = this.chartsConfig.buildResultadosDonut(data);
      this.hasDistribucionResultados.set(true);
    }
    if (this.hasData(data.tendenciaConversion)) {
      this.tendenciaOptions = this.chartsConfig.buildTendencia(data);
      this.hasTendenciaConversion.set(true);
    }
    if (this.hasData(data.portabilidadPorCompania)) {
      this.portabilidadCompaniaOptions = this.chartsConfig.buildPortabilidadCompania(data);
      this.hasPortabilidadPorCompania.set(true);
    }
    if (this.hasData(data.topEjecutivos)) {
      this.barChartOptions = this.chartsConfig.buildBarChart(data);
      this.hasTopEjecutivos.set(true);
    }
    if (this.hasData(data.ventasPorTipoLinea)) {
      this.tipoLineaOptions = this.chartsConfig.buildCategoriaBar(data.ventasPorTipoLinea, 'tipoLinea');
      this.hasVentasPorTipoLinea.set(true);
    }
    if (this.hasData(data.ventasPorPlan)) {
      this.planOptions = this.chartsConfig.buildCategoriaBar(data.ventasPorPlan, 'plan');
      this.hasVentasPorPlan.set(true);
    }
    if (this.hasData(data.ventasPorMetodoEntrega)) {
      this.metodoEntregaOptions = this.chartsConfig.buildCategoriaBar(data.ventasPorMetodoEntrega, 'metodoEntrega');
      this.hasVentasPorMetodoEntrega.set(true);
    }
    if (this.hasData(data.ventasPorCicloFacturacion)) {
      this.cicloFacturacionOptions = this.chartsConfig.buildCategoriaBar(data.ventasPorCicloFacturacion, 'cicloFacturacion');
      this.hasVentasPorCicloFacturacion.set(true);
    }
  }
}
