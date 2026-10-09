import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

import { SavedRow } from '../interfaces/general.interface';
import {
  InsumosResponse,
  TipoInsumoResponse,
  PersonaProveedorResponse,
  ProveedoresResponse,
  SuperTipoInsumo,
  SuperTipoInsumoResponse,
  PersonaProveedor,
  Proveedores,
} from '../interfaces/proveedores.interfaces';
import { GraficosResponse } from '../interfaces/general.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private authService = inject(AuthService);

  //BÚSQUEDA PROVEEDOR
  buscaProveedor(nombre: string): Observable<ProveedoresResponse> {
    return this.http.get<ProveedoresResponse>(
      `${this.apiUrl}proveedores/busqueda?nombre=${nombre}`,
    );
  }

  //OBTIENE UNA PERSONA PROVEEDOR POR ID PROVEEDOR
  personaProveedorXIdProveedor(idProveedor: number): Observable<PersonaProveedorResponse> {
    return this.http.get<PersonaProveedorResponse>(
      `${this.apiUrl}proveedores/proveedor?idProveedor=${idProveedor}`,
    );
  }

  //GRABA PROVEEDOR
  grabaProveedor(proveedor: PersonaProveedor): Observable<SavedRow> {
    let esPersonaProveedor = true;
    
    if (proveedor.idProveedor === 0) {
      proveedor.idProveedor = null;
      if (proveedor.idPersona !== 0) {
        const proveedorSimple: Proveedores = {
          idPersona: proveedor.idPersona,
          estadoProveedor: 'I',
          tipoIdentificacionAts: proveedor.tipoIdentificacion!,
        };
        return this.http.post<SavedRow>(
          `${this.apiUrl}proveedores/${this.authService.idUsuario()}`,
          proveedorSimple,
        );
      } else {
        esPersonaProveedor = true;
      }
    }

    if (esPersonaProveedor) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}proveedores/persona/${this.authService.idUsuario()}`,
        proveedor,
      );
    }

    return of({
      status: 'NOT_FOUND',
      message: 'Datos incompletos',
      idSecuencial: proveedor.idProveedor!,
    } as SavedRow);
  }

  //BÚSQUEDA INSUMO
  buscaInsumos(nombre: string): Observable<InsumosResponse> {
    return this.http.get<InsumosResponse>(`${this.apiUrl}proveedores/insumos/busqueda`, {
      params: new HttpParams().set('nombre', nombre),
    });
  }

  //BÚSQUEDA TIPO DE INSUMO
  buscaTipoInsumo(nombre: string): Observable<TipoInsumoResponse> {
    return this.http.get<TipoInsumoResponse>(
      `${this.apiUrl}proveedores/tipoinsumos/busqueda?nombre=${nombre}`,
    );
  }

  //GRÁFICOS DEL DASHBOARD
  graficoProveedorPorClasificador(): Observable<GraficosResponse> {
    return this.http.get<GraficosResponse>(`${this.apiUrl}proveedores/grafico/clasificador`);
  }

  graficoProveedorPorEstado(): Observable<GraficosResponse> {
    return this.http.get<GraficosResponse>(`${this.apiUrl}proveedores/grafico/estado`);
  }

  graficoProveedorPorAnio(): Observable<GraficosResponse> {
    return this.http.get<GraficosResponse>(`${this.apiUrl}proveedores/grafico/anio`);
  }

  //SÚPER TIPO DE INSUMO
  listaSuperTipoInsumo(): Observable<SuperTipoInsumoResponse> {
    return this.http.get<SuperTipoInsumoResponse>(`${this.apiUrl}proveedores/supertipoinsumos`);
  }

  grabaSuperTipoInsumo(superTipoInsumo: SuperTipoInsumo, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}proveedores/${this.authService.idUsuario()}/supertipoinsumos`,
        superTipoInsumo,
      );
    } else {
      const params = new HttpParams().set('idSuperTipoInsumo', superTipoInsumo.idSuperTipoInsumo!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}proveedores/${this.authService.idUsuario()}/supertipoinsumos`,
        superTipoInsumo,
        { params },
      );
    }
  }

  eliminaSuperTipoInsumo(idSuperTipoInsumo: number): Observable<SavedRow> {
    const params = new HttpParams().set('idSuperTipoInsumo', idSuperTipoInsumo!);
    return this.http.delete<SavedRow>(
      `${this.apiUrl}proveedores/${this.authService.idUsuario()}/supertipoinsumos`,
      {
        params,
      },
    );
  }
}
