import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // No añadir token a peticiones de login y obtener usuario
  // El endpoint de refresh no necesita el access token en el header
  const excludedEndpoints = ['/api/Auth/login', '/api/Auth/user', '/api/Auth/refresh'];

  if (excludedEndpoints.some(endpoint => req.url.includes(endpoint))) {
    return next(req);
  }

  // Obtener el token del localStorage
  const token = localStorage.getItem('access_token');

  // Si no hay token, continuar sin modificar la petición
  if (!token) {
    return next(req);
  }

  // Clonar la petición y añadir el header de Authorization
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(clonedRequest);
};
