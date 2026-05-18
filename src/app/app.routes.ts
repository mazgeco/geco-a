import { Routes } from '@angular/router';
import  * as Layouts from './layouts/layouts.exports';
import  * as Personas from './modules/personas/personas.exports';

export const routes: Routes = [
  {
    path: 'login',
    component: Layouts.AuthLayout
  },
  {
    path: 'main',
    component: Layouts.MainLayout
  },
  {
    path: 'personas',
    component: Layouts.PersonasLayout,
    children: [
      { path: 'dash', component: Personas.DshPer0001 },
      { path: 'search', component: Personas.BsqPer0001 },
      { path: 'persona', component: Personas.WinPer0018 },
      { path: '', redirectTo: 'dash', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
