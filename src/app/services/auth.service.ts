import { Injectable, computed, inject, signal, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioValidado } from '../interfaces/seguridades.interface';
import { leerJwt } from '../shared/security/jwt';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private readonly TOKEN_KEY = 'geco_token';
  private readonly USER_KEY = 'geco_user';
  private router = inject(Router);
  private readonly _token = signal<string | null>(null);
  private readonly _usuario = signal<UsuarioValidado | null>(null);
  private vencimiento?: ReturnType<typeof setTimeout>;

  readonly token = this._token.asReadonly();
  readonly usuario = this._usuario.asReadonly();
  readonly autenticado = computed(() => this.tokenVigente() !== null);
  readonly nombrePersona = computed(() => this._usuario()?.nombre ?? '');
  readonly idUsuario = computed(() => this._usuario()?.idUsuario ?? '');

  constructor() {
    try {
      const token = sessionStorage.getItem(this.TOKEN_KEY);
      const stored = sessionStorage.getItem(this.USER_KEY);
      const usuario = stored ? JSON.parse(stored) as UsuarioValidado : null;
      if (!usuario || usuario.token !== token || !this.login(usuario)) this.logout();
    } catch {
      this.logout();
    }
  }

  tokenVigente(): string | null {
    const token = this._token();
    const jwt = leerJwt(token);
    return jwt && jwt.exp * 1000 > Date.now() ? token : null;
  }

  login(usuario: UsuarioValidado): boolean {
    const jwt = leerJwt(usuario?.token);
    if (!jwt || jwt.sub !== usuario.idUsuario || jwt.exp * 1000 <= Date.now()) return false;
    clearTimeout(this.vencimiento);
    sessionStorage.setItem(this.TOKEN_KEY, usuario.token);
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
    this._token.set(usuario.token); this._usuario.set(usuario);
    this.vencimiento = setTimeout(() => this.sesionExpirada(), Math.min(jwt.exp * 1000 - Date.now(), 2147483647));
    return true;
  }

  logout(): void {
    clearTimeout(this.vencimiento); this.vencimiento = undefined;
    sessionStorage.removeItem(this.TOKEN_KEY); sessionStorage.removeItem(this.USER_KEY);
    this._token.set(null); this._usuario.set(null);
  }

  sesionExpirada(): void {
    this.logout();
    void this.router.navigate(['/login'], { queryParams: { sesion: 'expirada' } });
  }

  ngOnDestroy(): void { clearTimeout(this.vencimiento); }
}
