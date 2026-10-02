import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import {
  Clasificacion,
  ClasificacionResponse,
  GraficoVentasAnioResponse,
  OrdenServicio,
  OrdenServicioResponse,
  ReservasResponse,
  TipoHabitacion,
  TipoHabitacionResponse,
} from '../interfaces/reservas.interface';
import { GraficosResponse, SavedRow } from '../interfaces/general.interface';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private authService = inject(AuthService);

  //GRÁFICOS DASHBOARD
  graficoVentasXAnioXMes(): Observable<GraficoVentasAnioResponse> {
    return this.http.get<GraficoVentasAnioResponse>(
      `${this.apiUrl}reservas/grafico/ventasxanioxmes`,
    );
  }

  graficoReservasXEstado(): Observable<GraficosResponse> {
    return this.http.get<GraficosResponse>(`${this.apiUrl}reservas/grafico/xestado`);
  }

  graficoVentasXVendedor(): Observable<GraficosResponse> {
    return this.http.get<GraficosResponse>(`${this.apiUrl}reservas/grafico/xvendedor`);
  }

  //BÚSQUEDA DE RESERVAS
  buscaReservas(nombre: string): Observable<ReservasResponse> {
    return this.http.get<ReservasResponse>(`${this.apiUrl}reservas/busqueda?cliente=${nombre}`);
  }

  //TIPO HABITACIÓN
  listaTipoHabitacion(): Observable<TipoHabitacionResponse> {
    return this.http.get<TipoHabitacionResponse>(`${this.apiUrl}reservas/tiposhabitacion`);
  }

  grabaTipoHabitacion(tipoHabitacion: TipoHabitacion, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}reservas/${this.authService.idUsuario()}/tiposhabitacion`,
        tipoHabitacion,
      );
    } else {
      const params = new HttpParams().set('idTipoHabitacion', tipoHabitacion.idTipoHabitacion!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}reservas/${this.authService.idUsuario()}/tiposhabitacion`,
        tipoHabitacion,
        { params },
      );
    }
  }

  eliminaTipoHabitacion(idTipoHabitacion: number): Observable<SavedRow> {
    const params = new HttpParams().set('idTipoHabitacion', idTipoHabitacion!);
    return this.http.delete<SavedRow>(`${this.apiUrl}reservas/${this.authService.usuario}/tiposhabitacion`, {
      params,
    });
  }

  //CLASIFICACION
  listaClasificacion(): Observable<ClasificacionResponse> {
    return this.http.get<ClasificacionResponse>(`${this.apiUrl}reservas/clasificaciones`);
  }

  grabaClasificacion(clasificacion: Clasificacion, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}reservas/${this.authService.idUsuario()}/clasificaciones`,
        clasificacion,
      );
    } else {
      const params = new HttpParams().set('idClasificacion', clasificacion.idClasificacion!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}reservas/${this.authService.idUsuario()}/clasificaciones`,
        clasificacion,
        { params },
      );
    }
  }

  eliminaClasificacion(idClasificacion: number): Observable<SavedRow> {
    const params = new HttpParams().set('idClasificacion', idClasificacion!);
    return this.http.delete<SavedRow>(`${this.apiUrl}reservas/${this.authService.usuario}/clasificaciones`, {
      params,
    });
  }

  //PARAMETRIZACIÓN ORDEN DE SERVICIOS
  listaOrdenServicio(): Observable<OrdenServicioResponse> {
    return this.http.get<OrdenServicioResponse>(`${this.apiUrl}reservas/ordenesservicio`);
  }

  grabaOrdenServicio(ordenServicio: OrdenServicio, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}reservas/${this.authService.idUsuario()}/ordenesservicio`,
        ordenServicio,
      );
    } else {
      const params = new HttpParams().set('idOrdenServicio', ordenServicio.idOrdenServicio!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}reservas/${this.authService.idUsuario()}/ordenesservicio`,
        ordenServicio,
        { params },
      );
    }
  }

  eliminaOrdenServicio(idOrdenServicio: number): Observable<SavedRow> {
    const params = new HttpParams().set('idOrdenServicio', idOrdenServicio!);
    return this.http.delete<SavedRow>(`${this.apiUrl}reservas/${this.authService.usuario}/ordenesservicio`, {
      params,
    });
  }

}
