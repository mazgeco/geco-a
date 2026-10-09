import { Component, Input, Output, EventEmitter, inject, signal, computed, OnChanges, OnDestroy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { ItinerarioReservaService } from '../../../../services/itinerario-reserva.service';
import { InsumoDiaReserva } from '../../../../interfaces/itinerario-reserva.interfaces';
import { FrmRes0011 } from '../frm-res0011/frm-res0011';
@Component({selector:'app-grd-res0019',imports:[...PRIMENG_MODULES,DecimalPipe,FrmRes0011],providers:[ConfirmationService],templateUrl:'./grd-res0019.html'})
export class GrdRes0019 implements OnChanges,OnDestroy {
  @Input() idItinerarioRes=0;@Output() modificado=new EventEmitter<void>();
  private api=inject(ItinerarioReservaService);private confirmar=inject(ConfirmationService);
  filas=signal<InsumoDiaReserva[]>([]);edicion=signal<InsumoDiaReserva|null>(null);ocupado=signal(false);cargando=signal(false);mensaje=signal('');
  totalPresupuestado=computed(()=>this.filas().reduce((s,f)=>s+(f.totalPresupuestado??0),0));
  totalReal=computed(()=>this.filas().reduce((s,f)=>s+(f.totalReal??0),0));
  private carga?:Subscription;private escritura?:Subscription;private version=0;
  puedeSalir(){return !this.edicion()&&!this.ocupado();}
  ngOnChanges(){this.edicion.set(null);this.cargar();}
  cargar(){this.carga?.unsubscribe();const version=++this.version;this.filas.set([]);if(!this.idItinerarioRes)return;this.cargando.set(true);
    this.carga=this.api.insumos(this.idItinerarioRes).subscribe({next:r=>{if(version!==this.version)return;this.filas.set(r.data);this.cargando.set(false);},error:e=>{this.cargando.set(false);this.mensaje.set(e.error?.message??'No se pudieron cargar los insumos.');}});}
  insertar(){if(!this.puedeSalir()||!this.idItinerarioRes)return;this.edicion.set({idItinerarioRes:this.idItinerarioRes,cantidadInsumo:1,factorPrecio:1,darAnticipo:'N',insumoPagado:'N',insumoFacturado:'N',apruebaPago:'N',inventarioDescargado:'N',tipoInsumoXItinerario:'I'});}
  editar(f:InsumoDiaReserva){if(this.puedeSalir())this.edicion.set({...f});}
  guardado(f:InsumoDiaReserva){this.edicion.set(null);this.ocupado.set(false);this.filas.update(v=>[...v.filter(x=>x.idInsumoXItinerarioRes!==f.idInsumoXItinerarioRes),f].sort((a,b)=>a.idInsumoXItinerarioRes!-b.idInsumoXItinerarioRes!));this.mensaje.set('');this.modificado.emit();}
  eliminar(f:InsumoDiaReserva){if(!this.puedeSalir())return;this.confirmar.confirm({header:'Eliminar insumo',message:'¿Eliminar este insumo del día y recalcular los totales?',acceptLabel:'Eliminar',rejectLabel:'Cancelar',accept:()=>{
    this.ocupado.set(true);this.escritura=this.api.borraInsumo(f.idInsumoXItinerarioRes!).subscribe({next:()=>{this.filas.update(v=>v.filter(x=>x!==f));this.ocupado.set(false);this.modificado.emit();},error:e=>{this.ocupado.set(false);this.mensaje.set(e.error?.message??'No se pudo eliminar el insumo.');}});
  }});}
  ngOnDestroy(){this.version++;this.carga?.unsubscribe();this.escritura?.unsubscribe();}
}
