import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { repositoryProviders } from './infrastructure/di/providers';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { tokenRefreshInterceptor } from './core/interceptors/token-refresh.interceptor';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getSpanishPaginatorIntl } from './infrastructure/services/spanish-paginator-intl';
import { Idle, IdleExpiry, SimpleExpiry } from '@ng-idle/core';
import { provideNgxMask } from 'ngx-mask';
import { provideEchartsCore } from 'ngx-echarts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, tokenRefreshInterceptor, httpErrorInterceptor])
    ),
    provideAnimations(),
    provideToastr({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      progressBar: true,
      closeButton: true,
    }),
    provideNgxMask(),
    provideEchartsCore({ echarts: () => import('echarts') }),
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
    Idle,
    { provide: IdleExpiry, useClass: SimpleExpiry },
    ...repositoryProviders
  ]
};
