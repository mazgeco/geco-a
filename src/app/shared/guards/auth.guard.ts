import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔐 AUTH GUARD');
  console.log('Autenticado:', authService.autenticado());
  console.log('Token:', authService.token());

  if (authService.autenticado()) {
    return true;
  }

  console.log('❌ AUTH GUARD → LOGIN');

  return router.createUrlTree(['/login']);
};