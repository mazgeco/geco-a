import { describe,it,expect,vi } from 'vitest';
import { Injector,runInInjectionContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ItinerarioReservaService } from './itinerario-reserva.service';
import { AuthService } from './auth.service';
const prepara=()=>{const http={post:vi.fn(()=>of({})),get:vi.fn(()=>of({})),delete:vi.fn(()=>of({}))};const injector=Injector.create({providers:[{provide:HttpClient,useValue:http},{provide:AuthService,useValue:{idUsuario:()=> 'gabby'}}]});return {http,api:runInInjectionContext(injector,()=>new ItinerarioReservaService())};};
describe('Contrato de itinerario e insumos',()=>{
 it('normaliza números, fechas vacías y horas del formulario sin enviar auditoría',()=>{const {http,api}=prepara();api.guardaInsumo({idInsumo:30,idItinerarioRes:1,horaEjecucion:'08:30',fechaInicioInsumo:'2026-10-08T08:30',fechaPagoInsumo:'',idUsuarioCrea:'otro'}).subscribe();const [url,body]=http.post.mock.calls[0] as unknown as [string,any];expect(url).toMatch(/reservas\/gabby\/insumosxitinerariosreserva$/);expect(body.horaEjecucion).toBe('08:30:00');expect(body.fechaInicioInsumo).toBe('2026-10-08T08:30:00');expect(body.fechaPagoInsumo).toBeNull();expect(body.idUsuarioCrea).toBeUndefined();});
 it('normaliza la hora de la ficha del día',()=>{const {http,api}=prepara();api.guardaDia({idDetalleReserva:1,horaInicio:'08:30'}).subscribe();const [,body]=http.post.mock.calls[0] as unknown as [string,any];expect(body.horaInicio).toBe('08:30:00');expect(body.horaFin).toBeNull();});
 it('elimina el día usando el ID de reserva y el usuario actual',()=>{const {http,api}=prepara();api.borraDia(5).subscribe();const [url,options]=http.delete.mock.calls[0] as unknown as [string,any];expect(url).toMatch(/reservas\/gabby\/itinerariosreserva$/);expect(options.params.get('idItinerarioRes')).toBe('5');});
});
