import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import CryptoJS from 'crypto-js';

import { environment } from '../../environments/environment';

import { GraficosResponse, SavedRow } from '../interfaces/general.interface';
import {
  UsuariosResponse,
  ListaUsuariosResponse,
  ListaPerfilesResponse,
  Usuarios,
  ListaObjetosResponse,
  UsuarioValidadoResponse,
} from '../interfaces/seguridades.interface';

@Injectable({
  providedIn: 'root',
})
export class SeguridadesService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private idUsuarioSistema = 'mgzapata';

  validaUsuario(idUsuario: string, pass: string): Observable<UsuarioValidadoResponse> {
    const md5 = CryptoJS.MD5(pass);
    const pseudo = CryptoJS.enc.Base64.stringify(md5);

    const body = {
      idUsuario: idUsuario,
      pseudoPass: pseudo,
    };

    return this.http.post<UsuarioValidadoResponse>(`${this.apiUrl}seguridades/usuarios/check`, body);
  }

  usuarioXToken(token: string): Observable<UsuariosResponse> {
    const params = new HttpParams().set('token', token);
    return this.http.get<UsuariosResponse>(`${this.apiUrl}seguridades/usuarios/token`, { params });
  }

  buscaUsuario(nombre: string): Observable<ListaUsuariosResponse> {
    return this.http.get<ListaUsuariosResponse>(
      `${this.apiUrl}seguridades/usuarios/busqueda?nombre=${nombre}`,
    );
  }

  usuarioPorId(idUsuario: string): Observable<UsuariosResponse> {
    return this.http.get<UsuariosResponse>(
      `${this.apiUrl}seguridades/usuarios/usuario/${idUsuario}`,
    );
  }

  listaPerfiles(): Observable<ListaPerfilesResponse> {
    return this.http.get<ListaPerfilesResponse>(`${this.apiUrl}seguridades/perfiles`);
  }

  graficoLogeoUsuarios(): Observable<GraficosResponse> {
    return this.http.get<GraficosResponse>(`${this.apiUrl}seguridades/usuarios/grafico/logeo`);
  }

  graficoNroUsuariosXPerfil(): Observable<GraficosResponse> {
    return this.http.get<GraficosResponse>(
      `${this.apiUrl}seguridades/usuarios/grafico/nrousrxperfil`,
    );
  }

  graficoNroPermisosXPerfil(): Observable<GraficosResponse> {
    return this.http.get<GraficosResponse>(
      `${this.apiUrl}seguridades/usuarios/grafico/nropermisoxperfil`,
    );
  }

  grabaUsuario(usuario: Usuarios): Observable<SavedRow> {
    return this.http.post<SavedRow>(
      `${this.apiUrl}seguridades/${this.idUsuarioSistema}/usuarios`,
      usuario,
    );
  }

  actualizaEstadoUsuario(idUsuario: string, estado: string): Observable<SavedRow> {
    const params = new HttpParams().set('idUsuario', idUsuario).set('estado', estado);
    return this.http.put<SavedRow>(
      `${this.apiUrl}seguridades/${this.idUsuarioSistema}/usuarios/estado`,
      null,
      { params },
    );
  }

  listaObjetos(): Observable<ListaObjetosResponse> {
    return this.http.get<ListaObjetosResponse>(`${this.apiUrl}seguridades/objetos`);
  }
}
