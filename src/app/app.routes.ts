import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page';
import { MainPage } from './components/main-page/main-page';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';

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
  }
];
