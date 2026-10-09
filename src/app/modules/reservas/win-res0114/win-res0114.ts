import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FrmRes0018 } from './frm-res0018/frm-res0018';
@Component({selector:'app-win-res0114',imports:[FrmRes0018],template:`
  <section class="surface-card border-1 surface-border border-round p-3">
    <div class="mb-3"><strong>Itinerario e insumos · {{ nombreProducto }}</strong>
      <div class="text-500 mt-1">Datos operativos del producto en esta reserva</div></div>
    <app-frm-res0018 [idDetalleReserva]="idDetalleReserva" (modificado)="modificado.emit()" />
  </section>`})
export class WinRes0114 {
  @Input() idDetalleReserva=0;
  @Input() nombreProducto='';
  @Output() modificado=new EventEmitter<void>();
  @ViewChild(FrmRes0018) formulario?:FrmRes0018;
  puedeCerrar(){return this.formulario?.puedeSalir()??true;}
}
