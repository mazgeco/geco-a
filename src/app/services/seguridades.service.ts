import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

import { GraficosResponse, SavedRow } from '../interfaces/general.interface';
import { UsuariosResponse, ListaUsuariosResponse, ListaPerfilesResponse, Usuarios} from '../interfaces/seguridades.interface';

@Injectable({
  providedIn: 'root',
})
export class SeguridadesService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private idUsuario = 'mgzapata';

  buscaUsuario(nombre: string): Observable<ListaUsuariosResponse> {
    return this.http.get<ListaUsuariosResponse>(`${this.apiUrl}seguridades/usuarios/busqueda?nombre=${nombre}`);
  }

  usuarioPorId(idUsuario: string): Observable<UsuariosResponse>{
    return this.http.get<UsuariosResponse>(`${this.apiUrl}seguridades/usuarios/usuario/${idUsuario}`);
  }

  listaPerfiles(): Observable<ListaPerfilesResponse> {
    return this.http.get<ListaPerfilesResponse>(`${this.apiUrl}seguridades/perfiles`);
  }

  graficoLogeoUsuarios(): Observable<GraficosResponse>{
    return this.http.get<GraficosResponse>(`${this.apiUrl}seguridades/usuarios/grafico/logeo`);
  }

  graficoNroUsuariosXPerfil(): Observable<GraficosResponse>{
    return this.http.get<GraficosResponse>(`${this.apiUrl}seguridades/usuarios/grafico/nrousrxperfil`);
  }

  graficoNroPermisosXPerfil(): Observable<GraficosResponse>{
    return this.http.get<GraficosResponse>(`${this.apiUrl}seguridades/usuarios/grafico/nropermisoxperfil`);
  }

  grabaUsuario(usuario: Usuarios): Observable<SavedRow>{
    return this.http.post<SavedRow>(`${this.apiUrl}seguridades/${this.idUsuario}/usuarios`, usuario);
  }

}
