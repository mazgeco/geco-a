import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GraficosResponse, IdentificacionesResponse, ListaDenominacionesResponse, ListaNacionalidadesResponse, ListaPaisesResponse, ListaPersonasResponse, ListaTipoEmpresasResponse, PersonaResponse, Personas, SavedRow } from '../interfaces/personas.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PersonasService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private idUsuario = "mgzapata";

  buscaPersona(nombre: string): Observable<ListaPersonasResponse> {
    return this.http.get<ListaPersonasResponse>(`${this.apiUrl}personas/busqueda?nombre=${nombre}`)
  }

  personaPorId(idPersona: number): Observable<PersonaResponse> {
    return this.http.get<PersonaResponse>(`${this.apiUrl}personas/${idPersona}`)
  }

  listaDenominaciones(): Observable<ListaDenominacionesResponse> {
    return this.http.get<ListaDenominacionesResponse>(`${this.apiUrl}personas/denominaciones`);
  }

  listaNacionalidades(): Observable<ListaNacionalidadesResponse> {
    return this.http.get<ListaNacionalidadesResponse>(`${this.apiUrl}personas/nacionalidades`);
  }

  listaPaises(): Observable<ListaPaisesResponse> {
    return this.http.get<ListaPaisesResponse>(`${this.apiUrl}personas/paises`);
  }

  listaTipoEmpresas(): Observable<ListaTipoEmpresasResponse> {
    return this.http.get<ListaTipoEmpresasResponse>(`${this.apiUrl}personas/tipoempresas`);
  }

  graficoNacionalidades(): Observable<GraficosResponse> {
    return this.http.get<GraficosResponse>(`${this.apiUrl}personas/graficonacionalidades`);
  }

  graficoTipoEmpresas(): Observable<GraficosResponse> {
    return this.http.get<GraficosResponse>(`${this.apiUrl}personas/graficotipoempresas`);
  }

  graficoPersonasModulos(): Observable<GraficosResponse> {
    return this.http.get<GraficosResponse>(`${this.apiUrl}personas/graficopersonasmodulos`);
  }

  listaIdentificaciones(idPersona: number): Observable<IdentificacionesResponse> {
    return this.http.get<IdentificacionesResponse>(`${this.apiUrl}personas/${idPersona}/identificaciones`);
  }

  grabaPersona(idPersona: number, persona: Personas): Observable<SavedRow> | null {

    let graba = true;

    if (persona.idPersona === 0) {
      if (persona.tipoPersona === 'J') {
        if (persona.razonSocial === '') {
          graba = false;
        }
      } else {
        if (persona.nombre1 === '' || persona.apellido1 === '') {
          graba = false;
        }
      }
      if (graba) {
        return this.http.post<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}`, persona);
      }
    } else {
      const params = new HttpParams().set('idPersona', idPersona);
      return this.http.put<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}`, persona, {params});
    }


    return null;
  }

}