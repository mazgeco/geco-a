import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  // No enviar el JWT a dominios, assets o URLs ajenas a la API de GECO.
  const base = new URL(environment.apiUrl, document.baseURI);
  const url = new URL(request.url, document.baseURI);
  const apiPath = base.pathname.replace(/\/$/, '');
  const pertenece = url.origin === base.origin
    && (url.pathname === apiPath || url.pathname.startsWith(apiPath + '/'));
  const login = pertenece && request.method === 'POST'
    && url.pathname === apiPath + '/seguridades/usuarios/check';
  if (!pertenece) return next(request);

  const auth = inject(AuthService);
  const token = login ? null : auth.tokenVigente();
  if (!login && auth.token() && !token) {
    auth.sesionExpirada();
    return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Sesión vencida', url: request.url }));
  }
  const headers = request.headers.delete('Authorization');
  const enviada = request.clone({ headers: token ? headers.set('Authorization', `Bearer ${token}`) : headers });
  return next(enviada).pipe(catchError(error => {
    // Una respuesta tardía de la sesión anterior no debe cerrar un login nuevo.
    if (!login && error instanceof HttpErrorResponse && error.status === 401
        && token && auth.token() === token) auth.sesionExpirada();
    return throwError(() => error);
  }));
};
