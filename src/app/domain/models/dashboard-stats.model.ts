export type TipoFiltro = 'dia' | 'semana' | 'mes' | 'anio';

export interface DashboardFiltros {
  tipoFiltro: TipoFiltro;
  anio: number;
  mes?: number;
  semana?: number;
  dia?: number;
  ejecutivoId?: number | null;
}

export interface DashboardStats {
  filtros: DashboardFiltros;

  totalVentas: number;
  totalGestiones: number;
  periodoVentas: string;
  tasaConversion: number;
  contactosNoEfectivos: number;
  noContactos: number;
  tiempoPromedioGestion: number;
  tiempoHastaVenta: number;
  ratioIntentosExito: number;
  ejecutivosLogueados: number;
  mejorHorarioContacto: string;

  distribucionResultados: DistribucionResultado[];
  motivosRechazo: MotivoRechazo[];
  portabilidadPorCompania: PortabilidadCompania[];
  ventasPorTipoLinea: VentasPorCategoria[];
  ventasPorPlan: VentasPorCategoria[];
  ventasPorMetodoEntrega: VentasPorCategoria[];
  ventasPorCicloFacturacion: VentasPorCategoria[];
  ventasPorPeriodo: VentasPorPeriodo[];
  tendenciaConversion: TendenciaConversion[];
  topEjecutivos: TopEjecutivo[];
}

export interface VentasPorPeriodo {
  fecha: string;
  cantidad: number;
}

export interface VentasPorCategoria {
  nombre: string;
  cantidad: number;
  porcentaje: number;
}

export interface TopEjecutivo {
  usuarioID: number;
  nombre: string;
  ventas: number;
  totalGestiones: number;
  tasaConversion: number;
}

export interface DistribucionResultado {
  resultado: string;
  cantidad: number;
  porcentaje: number;
  color: string;
}

export interface MotivoRechazo {
  motivo: string;
  cantidad: number;
  porcentaje: number;
}

export interface TendenciaConversion {
  fecha: string;
  efectivos: number;
  totalGestiones: number;
  tasaConversion: number;
}

export interface PortabilidadCompania {
  compania: string;
  intentos: number;
  efectivos: number;
  tasaExito: number;
}
