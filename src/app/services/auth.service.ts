import {
  Injectable, computed, inject, signal, OnDestroy
} from '@angular/core';
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

  private readonly sincronizarSesion = (event: StorageEvent): void => {
    if (event.storageArea !== localStorage) return;

    // USER_KEY se escribe al final del login y del logout.
    if (event.key !== this.USER_KEY && event.key !== null) return;

    this.restaurarSesion();

    if (!this.tokenVigente()) {
      void this.router.navigate(['/login']);
    }
  };

  constructor() {
    // Elimina los datos del almacenamiento anterior.
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);

    this.restaurarSesion();
    window.addEventListener('storage', this.sincronizarSesion);
  }

  private restaurarSesion(): void {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const stored = localStorage.getItem(this.USER_KEY);
      const usuario = stored
        ? JSON.parse(stored) as UsuarioValidado
        : null;

      if (usuario && usuario.token === token && this.aplicarSesion(usuario)) {
        return;
      }
    } catch {
      // Los datos almacenados no representan una sesión válida.
    }

    this.limpiarEstado();
  }

  private aplicarSesion(usuario: UsuarioValidado): boolean {
    const jwt = leerJwt(usuario?.token);

    if (
      !jwt ||
      jwt.sub !== usuario.idUsuario ||
      jwt.exp * 1000 <= Date.now()
    ) {
      return false;
    }

    clearTimeout(this.vencimiento);
    this._token.set(usuario.token);
    this._usuario.set(usuario);

    this.vencimiento = setTimeout(
      () => this.sesionExpirada(),
      Math.min(jwt.exp * 1000 - Date.now(), 2147483647)
    );

    return true;
  }

  tokenVigente(): string | null {
    const token = this._token();
    const jwt = leerJwt(token);

    return jwt && jwt.exp * 1000 > Date.now() ? token : null;
  }

  login(usuario: UsuarioValidado): boolean {
    if (!this.aplicarSesion(usuario)) return false;

    localStorage.setItem(this.TOKEN_KEY, usuario.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));

    return true;
  }

  private limpiarEstado(): void {
    clearTimeout(this.vencimiento);
    this.vencimiento = undefined;
    this._token.set(null);
    this._usuario.set(null);
  }

  logout(): void {
    this.limpiarEstado();
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  sesionExpirada(): void {
    // Puede haberse iniciado una nueva sesión desde otra pestaña.
    this.restaurarSesion();
    if (this.tokenVigente()) return;

    this.logout();
    void this.router.navigate(
      ['/login'],
      { queryParams: { sesion: 'expirada' } }
    );
  }

  ngOnDestroy(): void {
    clearTimeout(this.vencimiento);
    window.removeEventListener('storage', this.sincronizarSesion);
  }
}