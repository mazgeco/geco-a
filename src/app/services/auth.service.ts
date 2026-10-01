import { Injectable, computed, signal } from '@angular/core';
import { Usuarios, UsuarioValidado } from '../interfaces/seguridades.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'geco_token';
  private readonly USER_KEY = 'geco_user';

  private readonly _token = signal<string | null>(
    sessionStorage.getItem(this.TOKEN_KEY)
  );

  private readonly _usuario = signal<UsuarioValidado | null>(
    this.obtenerUsuarioStorage()
  );

  readonly token = this._token.asReadonly();

  readonly usuario = this._usuario.asReadonly();

  readonly autenticado = computed(() => {
    return !!this._token();
  });

  readonly nombrePersona = computed(() => {
    return this._usuario()?.nombre ?? '';
  });


  login(usuario: UsuarioValidado): void {

    if (!usuario.token) {
      return;
    }

    sessionStorage.setItem(
      this.TOKEN_KEY,
      usuario.token
    );

    sessionStorage.setItem(
      this.USER_KEY,
      JSON.stringify(usuario)
    );

    // Actualizamos los signals
    this._token.set(usuario.token);
    this._usuario.set(usuario);
  }


  logout(): void {

    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);

    // Actualizamos los signals
    this._token.set(null);
    this._usuario.set(null);
  }


  private obtenerUsuarioStorage(): UsuarioValidado | null {

    const usuario = sessionStorage.getItem(this.USER_KEY);

    if (!usuario) {
      return null;
    }

    try {
      return JSON.parse(usuario) as UsuarioValidado;
    } catch {
      sessionStorage.removeItem(this.USER_KEY);
      return null;
    }
  }
}