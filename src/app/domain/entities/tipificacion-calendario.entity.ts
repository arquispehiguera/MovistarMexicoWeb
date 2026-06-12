export interface TipificacionCalendario {
  tipificacionCalendarioID: number;
  calendarioID: number;
  tipoCita: string;
  motivo: string;
  etapa: string;
  tiempoPrevio: number;
  tiempoAtencion: number;
  tiempoPost: number;
  integracionSGA: boolean;
  activo: boolean;
  fechaCreacion: string;
  usuarioCreacion: string;
  tiempoTotal: number;
}
