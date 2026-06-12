import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideEnvironmentNgxMask } from 'ngx-mask';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideEnvironmentNgxMask()
  ]
}).catch(err => console.error(err));
