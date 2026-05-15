import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page';
import { MainPage } from './components/main-page/main-page';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';
import { PersonasLayout } from './layouts/personas-layout/personas-layout';
import { HomePersonasPage } from './modules/personas/home-personas-page/home-personas-page';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: LoginPage },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'main',
    component: MainLayout,
    children: [
      { path: 'main', component: MainPage },
      { path: '', redirectTo: 'main', pathMatch: 'full' }
    ]
  },
  {
    path: 'personas',
    component: PersonasLayout,
    children:[
      {path: 'home', component: HomePersonasPage},
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];
