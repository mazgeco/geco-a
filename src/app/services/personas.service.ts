import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Caracteristicas,
  CaracteristicasResponse,
  Ciudades,
  CiudadesResponse,
  Denominaciones,
  Direcciones,
  DireccionesResponse,
  FichasMedicas,
  FichasMedicasResponse,
  GraficosResponse,
  Identificaciones,
  IdentificacionesResponse,
  ListaDenominacionesResponse,
  ListaNacionalidadesResponse,
  ListaPaisesResponse,
  ListaPersonasResponse,
  ListaTipoEmpresasResponse,
  Nacionalidades,
  Paises,
  PersonaResponse,
  Personas,
  Provincias,
  ProvinciasResponse,
  Telefonos,
  TelefonosResponse,
  TipoCaracteristicas,
  TipoCaracteristicasResponse,
  TipoDirecciones,
  TipoDireccionesResponse,
  TipoEmpresas,
  TipoFichasMedicas,
  TipoFichasMedicasResponse,
  TipoIdentificaciones,
  TipoIdentificacionesResponse,
  TipoTelefonos,
  TipoTelefonosResponse,
} from '../interfaces/personas.interfaces';
import { SavedRow } from '../interfaces/general.interface';

@Injectable({
  providedIn: 'root',
})
export class PersonasService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private idUsuario = 'mgzapata';

  buscaPersona(nombre: string): Observable<ListaPersonasResponse> {
    return this.http.get<ListaPersonasResponse>(`${this.apiUrl}personas/busqueda?nombre=${nombre}`);
  }

  buscaPersonaParaCrearUsuario(nombre: string): Observable<ListaPersonasResponse> {
    return this.http.get<ListaPersonasResponse>(`${this.apiUrl}personas/naturales/nousuarios?nombre=${nombre}`);
  }

  personaPorId(idPersona: number): Observable<PersonaResponse> {
    return this.http.get<PersonaResponse>(`${this.apiUrl}personas/${idPersona}`);
  }

  listaDenominaciones(): Observable<ListaDenominacionesResponse> {
    return this.http.get<ListaDenominacionesResponse>(`${this.apiUrl}personas/denominaciones`);
  }

  grabaDenominacion(denominacion: Denominaciones, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/denominaciones`,
        denominacion,
      );
    } else {
      const params = new HttpParams().set('idDenominacion', denominacion.idDenominacion!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/denominaciones`,
        denominacion,
        { params },
      );
    }
  }

  eliminaDenominacion(idDenominacion: string): Observable<SavedRow> {
    const params = new HttpParams().set('idDenominacion', idDenominacion!);
    return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/denominaciones`, {
      params,
    });
  }

  listaTiposIdentificacion(): Observable<TipoIdentificacionesResponse> {
    return this.http.get<TipoIdentificacionesResponse>(`${this.apiUrl}personas/tipoidentificaciones`);
  }

  grabaTipoIdentificacion(tipoIdentificacion: TipoIdentificaciones, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/tipoidentificaciones`,
        tipoIdentificacion,
      );
    } else {
      const params = new HttpParams().set('idTipoIdentificacion', tipoIdentificacion.idTipoIdentificacion!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/tipoidentificaciones`,
        tipoIdentificacion,
        { params },
      );
    }
  }

  eliminaTipoIdentificacion(idTipoIdentificacion: string): Observable<SavedRow> {
    const params = new HttpParams().set('idTipoIdentificacion', idTipoIdentificacion!);
    return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/tipoidentificaciones`, {
      params,
    });
  }

  listaPaises(): Observable<ListaPaisesResponse> {
    return this.http.get<ListaPaisesResponse>(`${this.apiUrl}personas/paises`);
  }

  listaTipoEmpresas(): Observable<ListaTipoEmpresasResponse> {
    return this.http.get<ListaTipoEmpresasResponse>(`${this.apiUrl}personas/tipoempresas`);
  }

  grabaTipoEmpresa(tipoEmpresa: TipoEmpresas, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/tipoempresas`,
        tipoEmpresa,
      );
    } else {
      const params = new HttpParams().set('idTipoEmpresa', tipoEmpresa.idTipoEmpresa!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/tipoempresas`,
        tipoEmpresa,
        { params },
      );
    }
  }

  eliminaTipoEmpresa(idTipoEmpresa: string): Observable<SavedRow> {
    const params = new HttpParams().set('idTipoEmpresa', idTipoEmpresa!);
    return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/tipoempresas`, {
      params,
    });
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
        persona.idPersona = null;
        return this.http.post<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}`, persona);
      } else {
        const params = new HttpParams().set('idPersona', idPersona);
        return this.http.put<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}`, persona, {
          params,
        });
      }
    }

    return of({
      status: 'NOT_FOUND',
      message: 'Datos incompletos',
      idSecuencial: persona.idPersona,
    } as SavedRow);
  }

  actualizaEstadoPersona(idPersona: number, estado: string): Observable<SavedRow> {
    const params = new HttpParams().set('idPersona', idPersona).set('estadoPersona', estado);
    return this.http.put<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/estado`, null, { params });
  }

  listaIdentificaciones(idPersona: number): Observable<IdentificacionesResponse> {
    return this.http.get<IdentificacionesResponse>(
      `${this.apiUrl}personas/${idPersona}/identificaciones`,
    );
  }

  grabaIdentificacion(identificacion: Identificaciones, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      identificacion.idIdentificacion = null;
      return this.http.post<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/identificaciones`,
        identificacion,
      );
    } else {
      const params = new HttpParams().set('idIdentificacion', identificacion.idIdentificacion!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/identificaciones`,
        identificacion,
        { params },
      );
    }
  }

  listaTipoDirecciones(): Observable<TipoDireccionesResponse> {
    return this.http.get<TipoDireccionesResponse>(`${this.apiUrl}personas/tipodirecciones`);
  }

  grabaTipoDireccion(tipoDireccion: TipoDirecciones, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/tipodirecciones`,
        tipoDireccion,
      );
    } else {
      const params = new HttpParams().set('idTipoDireccion', tipoDireccion.idTipoDireccion!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/tipodirecciones`,
        tipoDireccion,
        { params },
      );
    }
  }

  eliminaTipoDireccion(idTipoDireccion: string): Observable<SavedRow> {
    const params = new HttpParams().set('idTipoDireccion', idTipoDireccion!);
    return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/tipodirecciones`, {
      params,
    });
  }

  eliminaIdentificacion(idIdentificacion: number): Observable<SavedRow> {
    const params = new HttpParams().set('idIdentificacion', idIdentificacion!);
    return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/identificaciones`, {
      params,
    });
  }

  listaDirecciones(idPersona: number): Observable<DireccionesResponse> {
    return this.http.get<DireccionesResponse>(`${this.apiUrl}personas/${idPersona}/direcciones`);
  }

  grabaDireccion(direccion: Direcciones): Observable<SavedRow> {
    if (direccion.idDireccion === 0) {
      direccion.idDireccion = null;
      return this.http.post<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/direcciones`,
        direccion,
      );
    } else {
      const params = new HttpParams().set('idDireccion', direccion.idDireccion!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/direcciones`,
        direccion,
        { params },
      );
    }
  }

  eliminaDireccion(idDireccion: number): Observable<SavedRow> {
    const params = new HttpParams().set('idDireccion', idDireccion!);
    return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/direcciones`, {
      params,
    });
  }

  listaTiposTelefonos(): Observable<TipoTelefonosResponse> {
    return this.http.get<TipoTelefonosResponse>(`${this.apiUrl}personas/tipotelefonos`);
  }

  grabaTipoTelefono(tipoTelefono: TipoTelefonos, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/tipotelefonos`,
        tipoTelefono,
      );
    } else {
      const params = new HttpParams().set('idTipoTelefono', tipoTelefono.idTipoTelefono!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/tipotelefonos`,
        tipoTelefono,
        { params },
      );
    }
  }

  eliminaTipoTelefono(idTipoTelefono: string): Observable<SavedRow> {
    const params = new HttpParams().set('idTipoTelefono', idTipoTelefono!);
    return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/tipotelefonos`, {
      params,
    });
  }

  listaTelefonos(idPersona: number): Observable<TelefonosResponse> {
    return this.http.get<TelefonosResponse>(`${this.apiUrl}personas/${idPersona}/telefonos`);
  }

  grabaTelefono(telefono: Telefonos): Observable<SavedRow> {
    if (telefono.idTelefono === 0) {
      telefono.idTelefono = null;
      return this.http.post<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/telefonos`,
        telefono,
      );
    } else {
      const params = new HttpParams().set('idTelefono', telefono.idTelefono!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/telefonos`,
        telefono,
        { params },
      );
    }
  }

  eliminaTelefono(idTelefono: number): Observable<SavedRow> {
    const params = new HttpParams().set('idTelefono', idTelefono!);
    return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/telefonos`, {
      params,
    });
  }

  listaTiposCaracteristicas(): Observable<TipoCaracteristicasResponse> {
    return this.http.get<TipoCaracteristicasResponse>(`${this.apiUrl}personas/tipocaracteristicas`);
  }

  grabaTipoCaracteristica(tipoCaracteristica: TipoCaracteristicas, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      tipoCaracteristica.idTipoCaracteristica = null;
      return this.http.post<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/tipocaracteristicas`,
        tipoCaracteristica,
      );
    } else {
      const params = new HttpParams().set('idTipoCaracteristica', tipoCaracteristica.idTipoCaracteristica!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/tipocaracteristicas`,
        tipoCaracteristica,
        { params },
      );
    }
  }

  eliminaTipoCaracteristica(idTipoCaracteristica: number): Observable<SavedRow> {
    const params = new HttpParams().set('idTipoCaracteristica', idTipoCaracteristica!);
    return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/tipocaracteristicas`, {
      params,
    });
  }

  listaCaracteristicas(idPersona: number): Observable<CaracteristicasResponse> {
    return this.http.get<CaracteristicasResponse>(
      `${this.apiUrl}personas/${idPersona}/caracteristicas`,
    );
  }

  grabaCaracteristica(caracteristica: Caracteristicas): Observable<SavedRow> {
    if (caracteristica.idCaracteristica === 0) {
      caracteristica.idCaracteristica = null;
      return this.http.post<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/caracteristicas`,
        caracteristica,
      );
    } else {
      const params = new HttpParams().set('idCaracteristica', caracteristica.idCaracteristica!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/caracteristicas`,
        caracteristica,
        { params },
      );
    }
  }

  eliminaCaracteristica(idCaracteristica: number): Observable<SavedRow> {
    const params = new HttpParams().set('idCaracteristica', idCaracteristica!);
    return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/caracteristicas`, {
      params,
    });
  }

  listaTiposFichasMedicas(): Observable<TipoFichasMedicasResponse> {
    return this.http.get<TipoFichasMedicasResponse>(`${this.apiUrl}personas/tipofichasmedicas`);
  }

  grabaTipoFichaMedica(tipoFichaMedica: TipoFichasMedicas, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/tipofichasmedicas`,
        tipoFichaMedica,
      );
    } else {
      const params = new HttpParams().set('idTipoFichaMedica', tipoFichaMedica.idTipoFichaMedica!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/tipofichasmedicas`,
        tipoFichaMedica,
        { params },
      );
    }
  }

  eliminaTipoFichaMedica(idTipoFichaMedica: string): Observable<SavedRow> {
    const params = new HttpParams().set('idTipoFichaMedica', idTipoFichaMedica!);
    return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/tipofichasmedicas`, {
      params,
    });
  }

  listaFichasMedicas(idPersona: number): Observable<FichasMedicasResponse> {
    return this.http.get<FichasMedicasResponse>(
      `${this.apiUrl}personas/${idPersona}/fichasmedicas`,
    );
  }

  grabaFichaMedica(fichaMedica: FichasMedicas): Observable<SavedRow> {
    if (fichaMedica.idFichaMedica === 0) {
      fichaMedica.idFichaMedica = null;
      return this.http.post<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/fichasmedicas`,
        fichaMedica,
      );
    } else {
      const params = new HttpParams().set('idFichaMedica', fichaMedica.idFichaMedica!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/fichasmedicas`,
        fichaMedica,
        { params },
      );
    }
  }

  eliminaFichaMedica(idFichaMedica: number): Observable<SavedRow> {
    const params = new HttpParams().set('idFichaMedica', idFichaMedica!);
    return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/fichasmedicas`, {
      params,
    });
  }

  grabaPais(pais: Paises, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/paises`,
        pais,
      );
    } else {
      const params = new HttpParams().set('idPais', pais.idPais!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/paises`,
        pais,
        { params },
      );
    }
  }

  eliminaPais(idPais: number): Observable<SavedRow> {
    const params = new HttpParams().set('idPais', idPais!);
    return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/paises`, {
      params,
    });
  }

  listaProvincias(): Observable<ProvinciasResponse> {
    return this.http.get<ProvinciasResponse>(`${this.apiUrl}personas/provincias`);
  }

  grabaProvincia(provincia: Provincias, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/provincias`,
        provincia,
      );
    } else {
      const params = new HttpParams().set('idProvincia', provincia.idProvincia!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/provincias`,
        provincia,
        { params },
      );
    }
  }

  eliminaProvincia(idProvincia: number): Observable<SavedRow> {
    const params = new HttpParams().set('idProvincia', idProvincia!);
    return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/provincias`, {
      params,
    });
  }

  listaCiudades(): Observable<CiudadesResponse> {
    return this.http.get<CiudadesResponse>(`${this.apiUrl}personas/ciudades`);
  }

  grabaCiudad(ciudad: Ciudades, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/ciudades`,
        ciudad,
      );
    } else {
      const params = new HttpParams().set('idCiudad', ciudad.idCiudad!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/ciudades`,
        ciudad,
        { params },
      );
    }
  }

  eliminaCiudad(idCiudad: number): Observable<SavedRow> {
    const params = new HttpParams().set('idCiudad', idCiudad!);
    return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/ciudades`, {
      params,
    });
  }

  listaNacionalidades(): Observable<ListaNacionalidadesResponse> {
    return this.http.get<ListaNacionalidadesResponse>(`${this.apiUrl}personas/nacionalidades`);
  }

  grabaNacionalidad(nacionalidad: Nacionalidades, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/nacionalidades`,
        nacionalidad,
      );
    } else {
      const params = new HttpParams().set('idNacionalidad', nacionalidad.idNacionalidad!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}personas/${this.idUsuario}/nacionalidades`,
        nacionalidad,
        { params },
      );
    }
  }

  eliminaNacionalidad(idNacionalidad: number): Observable<SavedRow> {
    const params = new HttpParams().set('idNacionalidad', idNacionalidad!);
    return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.idUsuario}/nacionalidades`, {
      params,
    });
  }

}