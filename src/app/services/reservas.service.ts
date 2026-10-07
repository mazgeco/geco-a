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
  Reservas,
  EstadoReserva,
  TipoHabitacion,
  TipoHabitacionResponse,
  ListaArchivoReservaResponse,
  ArchivoReserva,
  ListaGuiaResponse,
  Guia,
  ListaObservacionGeneralResponse,
  ObservacionGeneral,
  ListaDetalleValorXReservaResponse,
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

  // CABECERA: crear o actualizar con fechas locales para LocalDate de Java.
  grabaReserva(reserva: Reservas): Observable<SavedRow> {
    const payload = {
      idReserva: reserva.idReserva || null,
      idPersona: reserva.idPersona,
      idPersonaContacto: reserva.idPersonaContacto || null,
      codigoAgencia: reserva.codigoAgencia,
      observacionReserva: reserva.observacionReserva,
      observacionPrivada: reserva.observacionPrivada,
      nroPax: reserva.nroPax,
      nroFacturaLocal: reserva.nroFacturaLocal,
      fechaGeneracion: this.fechaLocal(reserva.fechaGeneracion),
      fechaFacturacion: this.fechaLocal(reserva.fechaFacturacion),
    };
    const url = `${this.apiUrl}reservas/${this.authService.idUsuario()}`;
    return reserva.idReserva
      ? this.http.put<SavedRow>(url, payload, {
          params: new HttpParams().set('idReserva', reserva.idReserva),
        })
      : this.http.post<SavedRow>(url, { ...payload, estadoReserva: EstadoReserva.ING });
  }

  actualizaEstadoReserva(idReserva: number, estadoReserva: EstadoReserva): Observable<SavedRow> {
    return this.http.put<SavedRow>(
      `${this.apiUrl}reservas/${this.authService.idUsuario()}/estado`,
      { estadoReserva },
      {
        params: new HttpParams().set('idReserva', idReserva),
        headers: { Authorization: `Bearer ${this.authService.token() ?? ''}` },
      },
    );
  }

  private fechaHoraLocal(fecha: Date | string | null | undefined): string | null {
    if (!fecha) return null;
    if (typeof fecha === 'string') return fecha.replace(' ', 'T');
    const hora = [fecha.getHours(), fecha.getMinutes(), fecha.getSeconds()]
      .map((valor) => String(valor).padStart(2, '0'))
      .join(':');
    return `${this.fechaLocal(fecha)}T${hora}`;
  }

  private fechaLocal(fecha: Date | string | null | undefined): string | null {
    if (!fecha) return null;
    if (typeof fecha === 'string') return fecha.slice(0, 10);
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
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
      `${this.apiUrl}reservas/${this.authService.idUsuario()}/tiposhabitacion`,
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
      `${this.apiUrl}reservas/${this.authService.idUsuario()}/clasificaciones`,
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
      `${this.apiUrl}reservas/${this.authService.idUsuario()}/ordenesservicio`,
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
    const { idUsuarioCrea, fechaCrea, idUsuarioModifica, fechaModifica, ...datos } = detalleReserva;
    const payload = {
      ...datos,
      idDetalleReserva: nuevaFila ? null : detalleReserva.idDetalleReserva,
      fechaInicio: this.fechaHoraLocal(detalleReserva.fechaInicio),
      fechaFin: this.fechaHoraLocal(detalleReserva.fechaFin),
    };
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}reservas/${this.authService.idUsuario()}/detallesreserva`,
        payload,
      );
    } else {
      const params = new HttpParams().set('idDetalleReserva', detalleReserva.idDetalleReserva!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}reservas/${this.authService.idUsuario()}/detallesreserva`,
        payload,
        { params },
      );
    }
  }

  eliminaDetalleReserva(idDetalleReserva: number): Observable<SavedRow> {
    const params = new HttpParams().set('idDetalleReserva', idDetalleReserva!);
    return this.http.delete<SavedRow>(
      `${this.apiUrl}reservas/${this.authService.idUsuario()}/detallesreserva`,
      {
        params,
      },
    );
  }

  //DETALLE VALOR X RESERVA
  listaDetalleValorXReserva(
    idReserva: number,
  ): Observable<ListaDetalleValorXReservaResponse> {
    return this.http.get<ListaDetalleValorXDetalleReservaResponse>(
      `${this.apiUrl}reservas/detallesvalorreserva/${idReserva}`
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

  //ARCHIVOS RESERVA
  listaArchivoReserva(idReserva: number): Observable<ListaArchivoReservaResponse> {
    return this.http.get<ListaArchivoReservaResponse>(
      `${this.apiUrl}reservas/archivosreserva/${idReserva}`,
    );
  }

  grabaArchivoReserva(archivoReserva: ArchivoReserva, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}reservas/${this.authService.idUsuario()}/archivosreserva`,
        archivoReserva,
      );
    } else {
      const params = new HttpParams().set('idArchivoReserva', archivoReserva.idArchivoReserva!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}reservas/${this.authService.idUsuario()}/archivosreserva`,
        archivoReserva,
        { params },
      );
    }
  }

  eliminaArchivoReserva(idArchivoReserva: number): Observable<SavedRow> {
    const params = new HttpParams().set('idArchivoReserva', idArchivoReserva!);
    return this.http.delete<SavedRow>(
      `${this.apiUrl}reservas/${this.authService.idUsuario()}/archivosreserva`,
      {
        params,
      },
    );
  }

  //GUIA
  listaGuia(idReserva: number): Observable<ListaGuiaResponse> {
    return this.http.get<ListaGuiaResponse>(`${this.apiUrl}reservas/guias/${idReserva}`);
  }

  grabaGuia(guias: Guia, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}reservas/${this.authService.idUsuario()}/guias`,
        guias,
      );
    } else {
      const params = new HttpParams().set('idGuia', guias.idGuia!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}reservas/${this.authService.idUsuario()}/guias`,
        guias,
        { params },
      );
    }
  }

  eliminaGuia(idGuia: number): Observable<SavedRow> {
    const params = new HttpParams().set('idGuia', idGuia!);
    return this.http.delete<SavedRow>(
      `${this.apiUrl}reservas/${this.authService.idUsuario()}/guias`,
      {
        params,
      },
    );
  }

  //OBSERVACIONES GENERALES
  listaObservacionGeneral(idReserva: number): Observable<ListaObservacionGeneralResponse> {
    return this.http.get<ListaObservacionGeneralResponse>(`${this.apiUrl}reservas/observacionGenerals/${idReserva}`);
  }

  grabaObservacionGeneral(observacionGenerals: ObservacionGeneral, nuevaFila: boolean): Observable<SavedRow> {
    if (nuevaFila) {
      return this.http.post<SavedRow>(
        `${this.apiUrl}reservas/${this.authService.idUsuario()}/observacionesgenerales`,
        observacionGenerals,
      );
    } else {
      const params = new HttpParams().set('idObservacionGeneral', observacionGenerals.idObservacionGeneral!);
      return this.http.put<SavedRow>(
        `${this.apiUrl}reservas/${this.authService.idUsuario()}/observacionesgenerales`,
        observacionGenerals,
        { params },
      );
    }
  }

  eliminaObservacionGeneral(idObservacionGeneral: number): Observable<SavedRow> {
    const params = new HttpParams().set('idObservacionGeneral', idObservacionGeneral!);
    return this.http.delete<SavedRow>(
      `${this.apiUrl}reservas/${this.authService.idUsuario()}/observacionesgenerales`,
      {
        params,
      },
    );
  }

}
