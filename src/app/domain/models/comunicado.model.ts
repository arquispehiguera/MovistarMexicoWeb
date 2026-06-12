/**
 * DTO para representar un comunicado
 */
export interface ComunicadoDto {
  comunicadoID: number;
  usuarioEmisorID: number;
  nombreEmisor: string;
  titulo: string;
  mensaje: string;
  fechaCreacion: string;
  activo: boolean;
  // Estadísticas de lectura (opcionales, depende del backend)
  totalEnviados?: number;
  totalLeidos?: number;
}

/**
 * DTO para crear un nuevo comunicado
 */
export interface CreateComunicadoDto {
  titulo: string;
  mensaje: string;
  usuariosDestinatarios?: number[];
}

/**
 * DTO para actualizar un comunicado
 */
export interface UpdateComunicadoDto {
  comunicadoID: number;
  titulo: string;
  mensaje: string;
  activo: boolean;
}

/**
 * Respuesta al crear un comunicado
 */
export interface CreateComunicadoResponse {
  comunicadoId: number;
  message: string;
  notificacionesEnviadas: number;
}
