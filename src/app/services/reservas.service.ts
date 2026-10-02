import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import {
  GraficoVentasAnioResponse,
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

  buscaReservas(nombre: string): Observable<ReservasResponse> {
    return this.http.get<ReservasResponse>(`${this.apiUrl}reservas/busqueda?cliente=${nombre}`);
  }

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
    return this.http.delete<SavedRow>(`${this.apiUrl}personas/${this.authService.usuario}/tiposhabitacion`, {
      params,
    });
  }
}
