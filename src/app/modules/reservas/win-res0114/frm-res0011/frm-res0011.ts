import { Component, Input, Output, EventEmitter, inject, signal, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { Insumos } from '../../../../interfaces/proveedores.interfaces';
import { InsumoDiaReserva } from '../../../../interfaces/itinerario-reserva.interfaces';
import { ItinerarioReservaService } from '../../../../services/itinerario-reserva.service';
import { ProveedoresService } from '../../../../services/proveedores.service';
interface Campo { clave:string; etiqueta:string; tipo:'number'|'text'|'date'|'datetime-local'|'time'|'sn'; }
@Component({selector:'app-frm-res0011',imports:[...PRIMENG_MODULES],templateUrl:'./frm-res0011.html'})
export class FrmRes0011 implements OnChanges,OnDestroy {
  @Input() fila:InsumoDiaReserva={};
  @Output() guardado=new EventEmitter<InsumoDiaReserva>();
  @Output() cancelado=new EventEmitter<void>();
  @Output() ocupado=new EventEmitter<boolean>();
  private api=inject(ItinerarioReservaService);private proveedores=inject(ProveedoresService);
  modelo:Record<string,any>={};insumo:Insumos|null=null;
  sugerencias=signal<Insumos[]>([]);guardando=signal(false);sucio=signal(false);mensaje=signal('');
  private consulta?:Subscription;private escritura?:Subscription;
  readonly siNo=[{codigo:'S',etiqueta:'Sí'},{codigo:'N',etiqueta:'No'}];
  readonly grupos:{titulo:string;campos:Campo[]}[]=[
    {titulo:'Cantidades y costos',campos:[
      {clave:'cantidadInsumo',etiqueta:'Cantidad',tipo:'number'},{clave:'nroPaxInsumo',etiqueta:'Pax del insumo',tipo:'number'},
      {clave:'costoPresupuestado',etiqueta:'Costo presupuestado unitario',tipo:'number'},{clave:'costoRealSinImpuesto',etiqueta:'Costo real unitario sin impuestos',tipo:'number'},
      {clave:'tipoPrecio',etiqueta:'Tipo de precio (L / P / F)',tipo:'text'},{clave:'precioFijo',etiqueta:'Precio fijo',tipo:'number'},
      {clave:'factorPrecio',etiqueta:'Factor de precio',tipo:'number'},{clave:'utilidadXInsumo',etiqueta:'Utilidad del insumo',tipo:'number'},
      {clave:'descuentoInsumo',etiqueta:'Descuento del insumo',tipo:'number'}]},
    {titulo:'Operación y confirmación',campos:[
      {clave:'idProveedor',etiqueta:'ID proveedor',tipo:'number'},{clave:'idUsuarioResponsable',etiqueta:'Usuario responsable',tipo:'text'},
      {clave:'horaEjecucion',etiqueta:'Hora de ejecución',tipo:'time'},{clave:'fechaInicioInsumo',etiqueta:'Inicio del servicio',tipo:'datetime-local'},
      {clave:'fechaFinInsumo',etiqueta:'Fin del servicio',tipo:'datetime-local'},{clave:'lugar',etiqueta:'Lugar',tipo:'text'},
      {clave:'codigoConfirmaProveedor',etiqueta:'Código de confirmación',tipo:'text'},{clave:'fechaConfirmacion',etiqueta:'Fecha de confirmación',tipo:'date'},
      {clave:'centroCostos',etiqueta:'Centro de costos',tipo:'text'}]},
    {titulo:'Pago y comprobante',campos:[
      {clave:'darAnticipo',etiqueta:'Dar anticipo',tipo:'sn'},{clave:'fechaMaxPago',etiqueta:'Fecha máxima de pago',tipo:'date'},
      {clave:'timeLimit',etiqueta:'Time limit',tipo:'date'},{clave:'fechaPagoInsumo',etiqueta:'Fecha de pago',tipo:'date'},
      {clave:'nroComprobanteInsumo',etiqueta:'N.º comprobante',tipo:'text'},{clave:'insumoPagado',etiqueta:'Pagado',tipo:'sn'},
      {clave:'insumoFacturado',etiqueta:'Facturado',tipo:'sn'},{clave:'apruebaPago',etiqueta:'Pago aprobado',tipo:'sn'},
      {clave:'inventarioDescargado',etiqueta:'Inventario descargado',tipo:'sn'}]},
  ];
  ngOnChanges(){this.modelo={...this.fila};this.insumo=this.fila.idInsumo?{idInsumo:this.fila.idInsumo,descripcionInsumo:this.fila.descripcionInsumo??String(this.fila.idInsumo)}:null;this.sucio.set(false);this.mensaje.set('');}
  cambio(){this.sucio.set(true);}
  buscar(event:{query:string}){this.consulta?.unsubscribe();const nombre=event.query.trim();if(nombre.length<3){this.sugerencias.set([]);return;}
    this.consulta=this.proveedores.buscaInsumos(nombre).subscribe({next:r=>this.sugerencias.set(r.data),error:e=>this.mensaje.set(e.error?.message??'No se pudo buscar el insumo.')});}
  seleccionar(event:{value:Insumos}){this.insumo=event.value;this.modelo['idInsumo']=event.value.idInsumo;
    if(!this.modelo['idInsumoXItinerarioRes']){const costo=event.value.costoPresupuestado??event.value.costoPromedio??0;this.modelo['costoPresupuestado']=costo;this.modelo['costoRealSinImpuesto']=costo;this.modelo['idProveedor']=event.value.idProveedor;}
    this.cambio();}
  limpiar(){this.insumo=null;this.modelo['idInsumo']=null;this.cambio();}
  get totalPresupuestado(){return (Number(this.modelo['costoPresupuestado']??0)+Number(this.modelo['totalImpuesto']??0))*Number(this.modelo['cantidadInsumo']??0);}
  get totalReal(){return (Number(this.modelo['costoRealSinImpuesto']??0)+Number(this.modelo['totalImpuesto']??0))*Number(this.modelo['cantidadInsumo']??0);}
  guardar(){if(this.guardando())return;if(!this.insumo?.idInsumo||this.insumo.idInsumo!==this.modelo['idInsumo']){this.mensaje.set('Seleccione un insumo de la lista.');return;}
    if(Number(this.modelo['cantidadInsumo'])<0){this.mensaje.set('La cantidad no puede ser negativa.');return;}
    this.guardando.set(true);this.ocupado.emit(true);this.escritura=this.api.guardaInsumo(this.modelo as InsumoDiaReserva).subscribe({
      next:r=>{this.guardando.set(false);this.ocupado.emit(false);this.sucio.set(false);this.guardado.emit(r.data);},
      error:e=>{this.guardando.set(false);this.ocupado.emit(false);this.mensaje.set(e.error?.message??e.message??'No se pudo guardar el insumo.');}});
  }
  cancelar(){if(this.guardando())return;if(this.sucio()){this.mensaje.set('Hay cambios pendientes. Use Descartar y cerrar si desea salir sin guardarlos.');return;}this.cancelado.emit();}
  descartar(){if(!this.guardando())this.cancelado.emit();}
  ngOnDestroy(){this.consulta?.unsubscribe();this.escritura?.unsubscribe();}
}
