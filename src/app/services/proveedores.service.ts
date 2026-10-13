import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

import { SavedRow } from '../interfaces/general.interface';
import {
  ListaInsumosResponse,
  TipoInsumoResponse,
  PersonaProveedorResponse,
  ProveedoresResponse,
  SuperTipoInsumo,
  SuperTipoInsumoResponse,
  PersonaProveedor,
  Proveedores,
  TipoInsumo,
  InsumosResponse,
  PrecioInsumoResponse,
  PrecioInsumo,
  ListaPrecioInsumoResponse,
  ListaImpuestoXInsumoResponse,
  ImpuestoXInsumo,
  Insumos,
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
          idProveedor: proveedor.idProveedor,
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
  buscaInsumos(nombre: string): Observable<ListaInsumosResponse> {
    return this.http.get<ListaInsumosResponse>(`${this.apiUrl}proveedores/insumos/busqueda`, {
      params: new HttpParams().set('nombre', nombre),
    });
  }

  //CARGA INSUMO
  cargaInsumo(idInsumo: number): Observable<InsumosResponse> {
    return this.http.get<InsumosResponse>(`${this.apiUrl}proveedores/insumos/${idInsumo}`);
  }

  //GRABA INSUMO
  grabaInsumo(insumo: Insumos): Observable<SavedRow> {
    if (insumo.idInsumo === 0) {
      insumo.idInsumo = null;
      return this.http.post<SavedRow>(
        `${this.apiUrl}proveedores/${this.authService.idUsuario()}/insumos`,
        insumo,
      );
    } else {
      const params = new HttpParams().set('idInsumo', insumo.idInsumo!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}proveedores/${this.authService.idUsuario()}/insumos`,
        insumo,
        { params },
      );
    }
  }

  //BÚSQUEDA TIPO DE INSUMO
  buscaTipoInsumo(nombre: string): Observable<TipoInsumoResponse> {
    return this.http.get<TipoInsumoResponse>(
      `${this.apiUrl}proveedores/tipoinsumos/busqueda?nombre=${nombre}`,
    );
  }

  listaTipoInsumo(): Observable<TipoInsumoResponse> {
    return this.http.get<TipoInsumoResponse>(`${this.apiUrl}proveedores/tipoinsumos`);
  }

  grabaTipoInsumo(tipoInsumo: TipoInsumo): Observable<SavedRow> {
    return this.http.post<SavedRow>(
      `${this.apiUrl}proveedores/${this.authService.idUsuario()}/tipoinsumos`,
      tipoInsumo,
    );
  }

  eliminaTipoInsumo(idTipoInsumo: number): Observable<SavedRow> {
    return of({
      status: 'NOT_FOUND',
      message: 'Datos incompletos',
      idSecuencial: idTipoInsumo,
    } as SavedRow);
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

  //PRECIO INSUMO
  listaPrecioInsumo(idInsumo: number): Observable<ListaPrecioInsumoResponse> {
    return this.http.get<ListaPrecioInsumoResponse>(
      `${this.apiUrl}productos/precioinsumos/${idInsumo}`,
    );
  }

  grabaPrecioInsumo(superTipoInsumo: PrecioInsumo, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}productos/${this.authService.idUsuario()}/precioinsumos`,
        superTipoInsumo,
      );
    } else {
      const params = new HttpParams().set('idPrecioInsumo', superTipoInsumo.idPrecioInsumo!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}productos/${this.authService.idUsuario()}/precioinsumos`,
        superTipoInsumo,
        { params },
      );
    }
  }

  eliminaPrecioInsumo(idPrecioInsumo: number): Observable<SavedRow> {
    const params = new HttpParams().set('idPrecioInsumo', idPrecioInsumo!);
    return this.http.delete<SavedRow>(
      `${this.apiUrl}productos/${this.authService.idUsuario()}/precioinsumos`,
      {
        params,
      },
    );
  }

  //IMPUESTO X INSUMO
  listaImpuestoXInsumo(idInsumo: number): Observable<ListaImpuestoXInsumoResponse> {
    return this.http.get<ListaImpuestoXInsumoResponse>(
      `${this.apiUrl}productos/impuestosxinsumos/${idInsumo}`,
    );
  }

  grabaImpuestoXInsumo(impuestoXInsumo: ImpuestoXInsumo, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}productos/${this.authService.idUsuario()}/impuestosxinsumos`,
        impuestoXInsumo,
      );
    } else {
      const params = new HttpParams().set('idimpuestoXInsumo', impuestoXInsumo.idImpuestoXInsumo!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}productos/${this.authService.idUsuario()}/impuestosxinsumos`,
        impuestoXInsumo,
        { params },
      );
    }
  }

  eliminaImpuestoXInsumo(idImpuestoXInsumo: number): Observable<SavedRow> {
    const params = new HttpParams().set('idImpuestoXInsumo', idImpuestoXInsumo!);
    return this.http.delete<SavedRow>(
      `${this.apiUrl}productos/${this.authService.idUsuario()}/impuestosxinsumos`,
      {
        params,
      },
    );
  }
}
