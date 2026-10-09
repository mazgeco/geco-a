import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { defer } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { CatalogosItinerario, DiaReserva, TextoDiaReserva, InsumoDiaReserva, RespuestaItinerario } from '../interfaces/itinerario-reserva.interfaces';

@Injectable({providedIn:'root'})
export class ItinerarioReservaService {
  private http=inject(HttpClient);
  private auth=inject(AuthService);
  private base=environment.apiUrl+'reservas/';
  catalogos(){return this.http.get<RespuestaItinerario<CatalogosItinerario>>(this.base+'itinerariosreserva/catalogos');}
  dias(id:number){return this.http.get<RespuestaItinerario<DiaReserva[]>>(this.base+'itinerariosreserva/'+id);}
  textos(id:number){return this.http.get<RespuestaItinerario<TextoDiaReserva[]>>(this.base+'idiomasxitinerariosreserva/'+id);}
  insumos(id:number){return this.http.get<RespuestaItinerario<InsumoDiaReserva[]>>(this.base+'insumosxitinerariosreserva/'+id);}
  guardaDia(dto:DiaReserva){return this.http.post<RespuestaItinerario<DiaReserva>>(this.base+this.auth.idUsuario()+'/itinerariosreserva',{...dto,horaInicio:this.hora(dto.horaInicio),horaFin:this.hora(dto.horaFin)});}
  guardaTexto(dto:TextoDiaReserva){return this.http.post<RespuestaItinerario<TextoDiaReserva>>(this.base+this.auth.idUsuario()+'/idiomasxitinerariosreserva',dto);}
  guardaInsumo(dto:InsumoDiaReserva){return defer(()=>this.http.post<RespuestaItinerario<InsumoDiaReserva>>(this.base+this.auth.idUsuario()+'/insumosxitinerariosreserva',this.payload(dto)));}
  borraDia(id:number){return this.http.delete<RespuestaItinerario<null>>(this.base+this.auth.idUsuario()+'/itinerariosreserva',{params:new HttpParams().set('idItinerarioRes',id)});}
  borraInsumo(id:number){return this.http.delete<RespuestaItinerario<null>>(this.base+this.auth.idUsuario()+'/insumosxitinerariosreserva',{params:new HttpParams().set('idInsumoXItinerarioRes',id)});}
  private hora(v:string|null|undefined){return !v?null:v.length===5?v+':00':v;}
  private payload(dto:InsumoDiaReserva){
    const payload:Record<string,unknown>={...dto};
    for(const k of ['descripcionInsumo','totalReal','totalPresupuestado','idUsuarioCrea','fechaCrea','idUsuarioModifica','fechaModifica'])delete payload[k];
    const numeros=['idInsumoXItinerarioRes','idItinerarioRes','idInsumo','idPrecioInsumo','idPrecioXTemporada','idProductoXPrecioProducto','idProveedor','idInsumoXItinerarioRes2','idMotivoDescuento','cantidadInsumo','nroPaxInsumo','precioFijo','factorPrecio','costoPresupuestado','totalImpuesto','costoReal','descuentoInsumo','utilidadXInsumo','costoRealSinImpuesto'];
    for(const k of numeros){const v=payload[k];payload[k]=v===null||v===undefined||v===''?null:Number(v);if(payload[k]!==null&&!Number.isFinite(payload[k]))throw new Error('El campo '+k+' debe ser numérico.');}
    for(const k of ['fechaMaxPago','fechaPagoInsumo','fechaConfirmacion','timeLimit'])if(payload[k]==='')payload[k]=null;
    for(const k of ['fechaInicioInsumo','fechaFinInsumo']){const v=payload[k];if(v==='')payload[k]=null;else if(typeof v==='string'&&v.length===16)payload[k]=v+':00';}
    payload['horaEjecucion']=this.hora(dto.horaEjecucion);
    return payload;
  }
}
