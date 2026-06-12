import { Routes } from '@angular/router';
import { LayoutComponent } from './presentation/layouts/main/layout.component';
import { authGuard, publicGuard } from './core/guards/auth.guard';
import { roleGuard, adminGuard } from './core/guards/role.guard';

export const routes: Routes = [

  // 🔥 1. Siempre que arranque en "/", redirige a /login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // 🔐 2. Login sin Layout (protegido con publicGuard)
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./presentation/pages/login/login.component')
        .then(m => m.LoginComponent)
  },

  // 🔐 3. Rutas privadas con Layout (protegidas con authGuard y roleGuard)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      // ✅ Rutas accesibles para roles 1, 2 y 3
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./presentation/pages/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'tipificacion',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./presentation/pages/tipificacion/tipificacion.component')
            .then(m => m.TipificacionComponent)
      },
      {
        path: 'ventas-registradas',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./presentation/pages/ventas-registradas/ventas-registradas.component')
            .then(m => m.VentasRegistradasComponent)
      },

      // 🔒 Rutas administrativas - Solo roles 1 y 2
      {
        path: 'usuarios',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./presentation/pages/usuarios/usuarios.component')
            .then(m => m.Usuarios)
      },
      {
        path: 'tematicos',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./presentation/pages/tematicos/tematicos.component')
            .then(m => m.TematicosComponent)
      },
      {
        path: 'generales',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./presentation/pages/generales/generales.component')
            .then(m => m.GeneralesComponent)
      }
    ]
  },

  // 🔥 4. Wildcard → Login
  { path: '**', redirectTo: 'login' }
];
