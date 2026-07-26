import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Direcciones, DireccionesResponse, GraficosResponse, Identificaciones, IdentificacionesResponse, ListaDenominacionesResponse, ListaNacionalidadesResponse, ListaPaisesResponse, ListaPersonasResponse, ListaTipoEmpresasResponse, PersonaResponse, Personas } from '../interfaces/personas.interfaces';
import { SavedRow } from '../interfaces/general.interface'

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

  grabaPersona(idPersona: number, persona: Personas): Observable<SavedRow> {

    let graba = true;
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
      if (persona.idPersona === 0) {
        return this.http.post<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}`, persona);
      } else {
        const params = new HttpParams().set('idPersona', idPersona);
        return this.http.put<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}`, persona, { params });
      }
    }

    return of({
      status: 'NOT_FOUND',
      message: 'Datos incompletos',
      idSecuencial: persona.idPersona
    } as SavedRow);
  }

  listaIdentificaciones(idPersona: number): Observable<IdentificacionesResponse> {
    return this.http.get<IdentificacionesResponse>(`${this.apiUrl}personas/${idPersona}/identificaciones`);
  }


  grabaIdentificacion(identificacion: Identificaciones): Observable<SavedRow> {
    if (identificacion.idIdentificacion === 0) {
      identificacion.idIdentificacion = null;
      return this.http.post<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/identificaciones`, identificacion);
    } else {
      const params = new HttpParams().set('idIdentificacion', identificacion.idIdentificacion!);
      return this.http.put<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/identificaciones`, identificacion, { params });
    }
  }

  eliminaIdentificacion(idIdentificacion: number): Observable<SavedRow> {
    const params = new HttpParams().set('idIdentificacion', idIdentificacion!);
      return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/identificaciones`, { params });
  }

  listaDirecciones(idPersona: number): Observable<DireccionesResponse> {
    return this.http.get<DireccionesResponse>(`${this.apiUrl}personas/${idPersona}/direcciones`);
  }


  grabaDireccion(direccion: Direcciones): Observable<SavedRow> {
    if (direccion.idDireccion === 0) {
      direccion.idDireccion = null;
      return this.http.post<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/direcciones`, direccion);
    } else {
      const params = new HttpParams().set('idDireccion', direccion.idDireccion!);
      return this.http.put<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/direcciones`, direccion, { params });
    }
  }

  eliminaDireccion(idDireccion: number): Observable<SavedRow> {
    const params = new HttpParams().set('idDireccion', idDireccion!);
      return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/direcciones`, { params });
  }



}