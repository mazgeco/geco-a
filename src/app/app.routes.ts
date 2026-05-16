import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';
import { PersonasLayout } from './layouts/personas-layout/personas-layout';
import { DashPersonasPage } from './modules/personas/dash-personas-page/dash-personas-page';
import { PersonasPage } from './modules/personas/personas-page/personas-page';
import { BusquedaPersonasPage } from './modules/personas/busqueda-personas-page/busqueda-personas-page';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthLayout
  },
  {
    path: 'main',
    component: MainLayout
  },
  {
    path: 'personas',
    component: PersonasLayout,
    children: [
      { path: 'dash', component: DashPersonasPage },
      { path: 'search', component: BusquedaPersonasPage },
      { path: 'persona', component: PersonasPage },
      { path: '', redirectTo: 'dash', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
