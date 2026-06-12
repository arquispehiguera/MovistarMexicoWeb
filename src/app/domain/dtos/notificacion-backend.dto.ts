export interface NotificacionBackendDto {
  notificacionID: number;
  comunicadoID: number;
  usuarioDestinatarioID: number;
  leido: boolean;
  fechaEnvio: string;
  fechaLectura: string | null;
  titulo: string;
  mensaje: string;
  nombreEmisor: string;
}

export interface ContadorNotificacionesDto {
  noLeidas: number;
  total: number;
}

export interface MarcarLeidasDto {
  notificacionIDs: number[];
}

export interface MarcarLeidasResponse {
  message: string;
  contador: ContadorNotificacionesDto;
}

export interface NotificacionSignalRDto {
  notificacionID: number;
  comunicadoID: number;
  usuarioDestinatarioID: number;
  titulo: string;
  mensaje: string;
  nombreEmisor: string;
  fechaEnvio: string;
}
