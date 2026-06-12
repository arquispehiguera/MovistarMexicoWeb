import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);

  const parseBadRequest = (error: HttpErrorResponse): string => {
    if (!error.error) return 'La solicitud es inválida.';
    if (typeof error.error === 'string') return error.error;
    if (error.error.details) return error.error.details;
    if (Array.isArray(error.error.validationErrors) && error.error.validationErrors.length > 0)
      return error.error.validationErrors.map((e: any) => e.message || e).join('\n');
    if (Array.isArray(error.error.errors))
      return error.error.errors.map((e: any) => e.message || e).join('\n');
    return error.error.message || 'La solicitud es inválida.';
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error instanceof ErrorEvent) {
        toast.error('Error de conexión', 'No se pudo conectar con el servidor. Verifica tu conexión a internet.');
        return throwError(() => error);
      }

      switch (error.status) {
        case 400:
          toast.warning('Error de validación', parseBadRequest(error));
          break;
        case 401:
          if (req.url.includes('/login')) {
            toast.warning('Credenciales inválidas', parseBadRequest(error));
          } else {
            localStorage.clear();
            router.navigate(['/']);
          }
          break;
        case 403:
          toast.error('Acceso denegado', 'No tienes permisos para realizar esta acción.');
          break;
        case 404:
          toast.warning('Recurso no encontrado', parseBadRequest(error));
          break;
        case 409:
          toast.warning('Conflicto', error.error?.message || 'Ya existe un registro con estos datos.');
          break;
        case 422:
          toast.warning('Error de validación', parseBadRequest(error));
          break;
        case 500:
          toast.error('Error del servidor', 'Ocurrió un error en el servidor. Por favor intenta más tarde.');
          break;
        case 503:
          toast.error('Servicio no disponible', 'El servicio está temporalmente fuera de línea. Intenta más tarde.');
          break;
        default:
          toast.error('Error inesperado', 'Ha ocurrido un error. Por favor intenta nuevamente.');
      }

      return throwError(() => error);
    })
  );
};
