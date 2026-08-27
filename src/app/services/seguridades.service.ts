import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

import { SavedRow } from '../interfaces/general.interface';
import { ListaUsuariosResponse, UsuariosResponse } from '../interfaces/seguridades.interface';

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



}
