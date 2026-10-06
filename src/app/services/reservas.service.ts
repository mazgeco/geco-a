import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import {
  Clasificacion,
  ClasificacionResponse,
  DetalleReserva,
  GraficoVentasAnioResponse,
  ListaDetalleReservaResponse,
  ListaDetalleValorXDetalleReservaResponse,
  ListaReservasResponse,
  OrdenServicio,
  OrdenServicioResponse,
  ReservasResponse,
  TipoHabitacion,
  TipoHabitacionResponse,
} from '../interfaces/reservas.interfaces';
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
  buscaReservas(tipoFiltro: string, filtro: string): Observable<ListaReservasResponse> {
    return this.http.get<ListaReservasResponse>(
      `${this.apiUrl}reservas/busqueda/filtro?tipoFiltro=${tipoFiltro}&filtro=${filtro}`,
    );
  }

  reservaPorId(idReserva: number): Observable<ReservasResponse> {
    return this.http.get<ReservasResponse>(`${this.apiUrl}reservas/${idReserva}`);
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
    return this.http.delete<SavedRow>(
      `${this.apiUrl}reservas/${this.authService.usuario}/tiposhabitacion`,
      {
        params,
      },
    );
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
    return this.http.delete<SavedRow>(
      `${this.apiUrl}reservas/${this.authService.usuario}/clasificaciones`,
      {
        params,
      },
    );
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
    return this.http.delete<SavedRow>(
      `${this.apiUrl}reservas/${this.authService.usuario}/ordenesservicio`,
      {
        params,
      },
    );
  }

  //DETALLE RESERVA
  listaDetalleReserva(idReserva: number): Observable<ListaDetalleReservaResponse> {
    return this.http.get<ListaDetalleReservaResponse>(
      `${this.apiUrl}reservas/detallesreserva/${idReserva}`,
    );
  }

  grabaDetalleReserva(detalleReserva: DetalleReserva, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}reservas/${this.authService.idUsuario()}/detallesreserva`,
        detalleReserva,
      );
    } else {
      const params = new HttpParams().set('idDetalleReserva', detalleReserva.idDetalleReserva!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}reservas/${this.authService.idUsuario()}/detallesreserva`,
        detalleReserva,
        { params },
      );
    }
  }

  eliminaDetalleReserva(idDetalleReserva: number): Observable<SavedRow> {
    const params = new HttpParams().set('idDetalleReserva', idDetalleReserva!);
    return this.http.delete<SavedRow>(
      `${this.apiUrl}reservas/${this.authService.usuario}/detallesreserva`,
      {
        params,
      },
    );
  }

  //DETALLE VALOR X DETALLE RESERVA
  listaDetalleValorXDetalleReserva(
    idDetalleReserva: number,
  ): Observable<ListaDetalleValorXDetalleReservaResponse> {
    const params = new HttpParams().set('idDetalleReserva', idDetalleReserva!);
    return this.http.get<ListaDetalleValorXDetalleReservaResponse>(
      `${this.apiUrl}reservas/detallesvalordetallereserva`,
      { params },
    );
  }
}
