import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, filter, switchMap, take, throwError, from } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Router } from '@angular/router';
import { TokenRefreshStateService } from '../services/token-refresh-state.service';

export const tokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authRepository = inject(AuthRepository);
  const router = inject(Router);
  const refreshState = inject(TokenRefreshStateService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 &&
        !req.url.includes('/api/Auth/login') &&
        !req.url.includes('/api/Auth/refresh')
      ) {
        if (refreshState.isRefreshing) {
          return refreshState.result$.pipe(
            filter(result => result !== null),
            take(1),
            switchMap(success => {
              if (success) {
                const token = localStorage.getItem('access_token');
                return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
              }
              return throwError(() => error);
            })
          );
        }

        refreshState.start();

        return from(authRepository.refreshToken()).pipe(
          switchMap(success => {
            refreshState.complete(success);
            if (success) {
              const token = localStorage.getItem('access_token');
              return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
            }
            router.navigate(['/login']);
            return throwError(() => error);
          }),
          catchError(err => {
            refreshState.complete(false);
            router.navigate(['/login']);
            return throwError(() => err);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
