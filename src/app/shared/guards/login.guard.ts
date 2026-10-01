import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const loginGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔑 LOGIN GUARD');
  console.log('Autenticado:', authService.autenticado());
  console.log('Token:', authService.token());

  if (authService.autenticado()) {
    return router.createUrlTree(['/main']);
  }

   console.log('✅ LOGIN GUARD → PERMITIDO');

  return true;
};