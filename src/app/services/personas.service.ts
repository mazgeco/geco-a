import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GraficosResponse, IdentificacionesResponse, ListaDenominacionesResponse, ListaNacionalidadesResponse, ListaPaisesResponse, ListaPersonasResponse, ListaTipoEmpresasResponse, PersonaResponse } from '../interfaces/personas.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PersonasService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;


  buscaPersona(nombre: string): Observable<ListaPersonasResponse>{
    return this.http.get<ListaPersonasResponse>(`${this.apiUrl}personas/busqueda?nombre=${nombre}`)
  }

  personaPorId(idPersona: number): Observable<PersonaResponse>{
    return this.http.get<PersonaResponse>(`${this.apiUrl}personas/${idPersona}`)
  }
  
  listaDenominaciones(): Observable<ListaDenominacionesResponse>{
    return this.http.get<ListaDenominacionesResponse>(`${this.apiUrl}personas/denominaciones`);
  }

  listaNacionalidades(): Observable<ListaNacionalidadesResponse>{
    return this.http.get<ListaNacionalidadesResponse>(`${this.apiUrl}personas/nacionalidades`);
  }

  listaPaises(): Observable<ListaPaisesResponse>{
    return this.http.get<ListaPaisesResponse>(`${this.apiUrl}personas/paises`);
  }

  listaTipoEmpresas(): Observable<ListaTipoEmpresasResponse>{
    return this.http.get<ListaTipoEmpresasResponse>(`${this.apiUrl}personas/tipoempresas`);
  }

  graficoNacionalidades(): Observable<GraficosResponse>{
    return this.http.get<GraficosResponse>(`${this.apiUrl}personas/graficonacionalidades`);
  }

  graficoTipoEmpresas(): Observable<GraficosResponse>{
    return this.http.get<GraficosResponse>(`${this.apiUrl}personas/graficotipoempresas`);
  }

  graficoPersonasModulos(): Observable<GraficosResponse>{
    return this.http.get<GraficosResponse>(`${this.apiUrl}personas/graficopersonasmodulos`);
  }

  listaIdentificaciones(idPersona: number): Observable<IdentificacionesResponse>{
    return this.http.get<IdentificacionesResponse>(`${this.apiUrl}personas/${idPersona}/identificaciones`);
  }
  
}