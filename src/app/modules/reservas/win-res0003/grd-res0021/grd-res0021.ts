import { WinRes0114 } from '../../win-res0114/win-res0114';
import { Component, computed, inject, Input, OnChanges, OnDestroy, SimpleChanges, signal, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { AccionCalculoProducto, CalculoProductoReservado, DetalleReservaJSON, ValorProductoCalculado } from '../../../../interfaces/producto-reservado.interfaces';
import { StateService } from '../../state-service';
import { AutoCompleteCompleteEvent } from 'primeng/types/autocomplete';

import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { FuntionsService } from '../../../../services/functions.service';
import { ReservasService } from '../../../../services/reservas.service';
import { ToastService } from '../../../../services/toast.service';
import { MessageService } from '../../../../services/message.service';
import { Combo, FilaTabla, StatusMessage } from '../../../../interfaces/general.interface';
import {
  DetalleReserva,
  DetalleValorXDetalleReserva,
} from '../../../../interfaces/reservas.interfaces';
import { Productos } from '../../../../interfaces/productos.interfaces';
import { ProductosService } from '../../../../services/productos.service';

type FilaReserva = FilaTabla<DetalleReserva> & {
  _rowId: string;
  _producto: Pick<Productos, 'idProducto' | 'nombreCorto'> | null;
  _calculo?: CalculoProductoReservado;
  _valores?: ValorProductoCalculado[];
};

@Component({
  selector: 'app-grd-res0021',
  imports: [...PRIMENG_MODULES, DatePipe, DecimalPipe, WinRes0114],
  providers: [ConfirmationService],
  templateUrl: './grd-res0021.html',
})
export class GrdRes0021 implements OnChanges, OnDestroy {
  //LLAMADA AL ID Master
  @Input()
  idReserva!: number;
  itinerarioAbierto = signal<string|null>(null);
  paginaProductos=0;
  alPaginar(event:{first?:number},tabla:{first:number|null|undefined}):void {
    if(this.winItinerario && !this.winItinerario.puedeCerrar()) {
      tabla.first=this.paginaProductos;
      this.toastService.showMessage('warn','Itinerario','Guarde o descarte los cambios antes de cambiar de página.');return;
    }
    this.paginaProductos=event.first??0;this.itinerarioAbierto.set(null);
  }
  @ViewChild(WinRes0114) winItinerario?: WinRes0114;
  private actualizacionItinerario?: Subscription;
  verItinerario(fila: FilaReserva): void {
    if(!fila.idDetalleReserva || this.guardando()[fila._rowId] || this.ediciones[fila._rowId]) return;
    if(this.winItinerario && !this.winItinerario.puedeCerrar()) {
      this.toastService.showMessage('warn','Itinerario','Guarde o descarte los cambios y cierre la ficha del insumo antes de salir.');return;
    }
    this.itinerarioAbierto.set(this.itinerarioAbierto()===fila._rowId?null:fila._rowId);
  }
  actualizaDesdeItinerario(fila: FilaReserva): void {
    this.actualizacionItinerario?.unsubscribe();const reserva=this.idReserva;
    this.actualizacionItinerario=this.reservasService.listaDetalleReserva(reserva).subscribe({
      next:r=>{if(reserva!==this.idReserva || !this.filas().includes(fila))return;
        const actual=r.data.find(d=>d.idDetalleReserva===fila.idDetalleReserva);
        if(actual){Object.assign(fila,actual,{fechaInicio:this.fechaDesdeBack(actual.fechaInicio),fechaFin:this.fechaDesdeBack(actual.fechaFin)});fila._calculo=undefined;this.filas.update(v=>[...v]);this.cargaTotales(fila);}},
      error:e=>this.toastService.showMessage('error','Reserva',e.error?.message??'No se pudo actualizar el detalle después de editar el itinerario.')
    });
  }


  /******************************************************************************************
   * DECLARACIÓN DE VARIABLES
   *******************************************************************************************/

  //DEFINICIONES PRINCIPALES PROPIAS DEL OBJETO
  idContenedor = signal<string>('WinRes0003');
  idObjeto = signal<string>('GrdRes0021');
  idTabla = signal<string>('449');
  permiso = signal<string>('w');
  newRow: boolean = false;
  campoId: 'idDetalleReserva' = 'idDetalleReserva';
  nuevaFila: DetalleReserva = {
    idDetalleReserva: 0,
    idProducto: null,
    idProductoXPrecioProducto: null,
    idPrecioXTemporada: null,
    nombreProducto: '',
    fechaInicio: null,
    fechaFin: null,
    cantidadTotal: 0,
    precioUnitario: 0,
    porcentajeDescuento: 0,
    nroPax: 1,
    nroUnidades: 1,
    precioTotal: 0,
    blankCopy: 'N',
    comisionFija: null,
    porcentajeUtilidad: null,
    cantidadParcial: 1,
    idMotivoIngresoManual: null,
    observacionDetalle: '',
    idUsuarioCrea: '',
    fechaCrea: '',
    idUsuarioModifica: '',
    fechaModifica: '',
  };

  //INJECTIONS PÚBLICAS
  funciones = inject(FuntionsService);
  //INJECTIONS PRIVADAS
  private confirmationService = inject(ConfirmationService);
  private reservasService = inject(ReservasService);
  private toastService = inject(ToastService);
  private productosService = inject(ProductosService);
  private stateService = inject(StateService);
  //VARIABLES PARA EL MANEJO DE LOS MENSAJES
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  barraMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msg' + this.idObjeto()),
  );
  //DECLARACIÓN DE VARIABLES
  total = signal<number>(0);
  selectedRows!: DetalleReserva[];
  metaKey: boolean = true;
  filas = signal<FilaReserva[]>([]);
  calculando = signal<Record<string, boolean>>({});
  guardando = signal<Record<string, boolean>>({});
  errorCalculo = signal<Record<string, boolean>>({});
  ediciones: Record<string, boolean> = {};
  private originales = new Map<string, FilaReserva>();
  private calculos = new Map<string, Subscription>();
  private versiones = new Map<string, number>();
  private pendientes = new Map<string, ReturnType<typeof setTimeout>>();
  private busqueda?: Subscription;
  private carga?: Subscription;
  private activo: string | null = null;
  detalleValor = signal<ValorProductoCalculado[]>([]);
  productos = signal<Productos[]>([]);
  opcionSN = signal<Combo[]>([
    {
      codigo: 'S',
      etiqueta: 'Si',
    },
    {
      codigo: 'N',
      etiqueta: 'No',
    },
  ]);

  get totalPrecio(): number {
    return this.filas().reduce((total, fila) => total + (fila.precioTotal ?? 0), 0);
  }

  /******************************************************************************************
   * MÉTODOS QUE EJECUTAN LOS PROCESOS
   *******************************************************************************************/

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idReserva']) {
      this.limpiaCalculos();
      this.ediciones = {};
      this.originales.clear();
      this.selectedRows = [];
      this.detalleValor.set([]);
      this.cargaDatos(this.idReserva);
    }
  }

  //MÉTODO QUE INSERTA UNA FILA EN EL GRID
  insertarFila(): void {
    const pax = this.stateService.reserva()?.idReserva === this.idReserva
      ? this.stateService.reserva()?.nroPax ?? 1 : 1;
    const nuevaFila: FilaReserva = { ...this.nuevaFila, idReserva: this.idReserva, nroPax: pax,
      _rowId: crypto.randomUUID(), _producto: null };
    const mensaje = this.funciones.insertRowA(
      this.filas,
      nuevaFila,
      this.idReserva > 0,
      'btn' + this.idObjeto() + '60',
    );
    if (mensaje !== '') {
      this.toastService.showMessage('error', 'Error', mensaje);
    } else {
      this.newRow = true;
      this.ediciones[nuevaFila._rowId] = true;
      this.activo = nuevaFila._rowId;
      this.detalleValor.set([]);
    }
  }

  saveRow(fila: FilaReserva): void {
    const key = fila._rowId;
    if (this.guardando()[key] || this.calculando()[key]) return;
    if (!(this.idReserva > 0) || !fila.idProducto || fila._producto?.idProducto !== fila.idProducto || !fila.fechaInicio || !fila.fechaFin) {
      this.toastService.showMessage('warn', 'Reserva', 'Indique el producto y sus fechas, y guarde primero la cabecera.');
      return;
    }
    if (this.errorCalculo()[key]) {
      this.toastService.showMessage('warn', 'Cálculo', 'Corrija los datos y vuelva a calcular antes de guardar.');
      return;
    }
    fila.idReserva = this.idReserva;
    this.guardando.update(v => ({ ...v, [key]: true }));
    this.reservasService.grabaProductoReservado(fila).subscribe({
      next: resp => {
        // Una respuesta de otra reserva no debe modificar la pantalla actual.
        if (fila.idReserva !== this.idReserva || !this.filas().includes(fila)) return;
        Object.assign(fila, this.desdeJSON(resp.data));
        fila.idDetalleReserva = resp.idSecuencial;
        fila._producto = { idProducto: fila.idProducto!, nombreCorto: fila.nombreProducto ?? '' };
        fila._estadoFila = 'NORMAL';
        this.filas.update(v => [...v]);
        delete this.ediciones[key];
        this.originales.delete(key);
        this.guardando.update(v => ({ ...v, [key]: false }));
        this.newRow = false;
        this.cargaTotales(fila);
        this.messageService.mostrar(this.statusMessages, 'msg' + this.idObjeto(), 'success', resp.message);
      },
      error: err => {
        this.guardando.update(v => ({ ...v, [key]: false }));
        this.toastService.showMessage('error', 'Error', err.error?.message ?? err.message ?? 'No se pudo guardar el producto.');
      },
    });
  }

  //MÉTODO QUE CARGA TODAS LAS IDENTIFICACIONES EN EL GRID
  refrescar(): void {
    if(this.winItinerario && !this.winItinerario.puedeCerrar()) {
      this.toastService.showMessage('warn','Itinerario','Guarde o descarte la ficha antes de actualizar la lista.');return;
    }
    this.cargaDatos(this.idReserva);
  }
  cargaDatos(idReserva: number): void {
    this.itinerarioAbierto.set(null);
    this.paginaProductos=0;
    this.actualizacionItinerario?.unsubscribe();
    this.carga?.unsubscribe();
    this.limpiaCalculos();
    this.ediciones = {};
    this.originales.clear();
    this.filas.set([]);
    if (!(idReserva > 0)) return;
    this.carga = this.reservasService.listaDetalleReserva(idReserva).subscribe({
      next: (resp) => {
        if (idReserva !== this.idReserva) return;
        //Coloca las filas en la estructura
        this.filas.set(
          resp.data.map((item) => ({
            ...item,
            _producto: item.idProducto ? { idProducto: item.idProducto, nombreCorto: item.nombreProducto ?? '' } : null,
            blankCopy: item.blankCopy ?? 'N',
            fechaInicio: this.fechaDesdeBack(item.fechaInicio),
            fechaFin: this.fechaDesdeBack(item.fechaFin),
            _rowId: crypto.randomUUID(),
            _estadoFila: 'NORMAL',
          })),
        );
        //Envía un mensaje de carga exitosa
        this.messageService.mostrar(
          this.statusMessages,
          'msg' + this.idObjeto(),
          'success',
          'Datos cargados correctamente.',
        );
      },
      error: (err) => {
        this.toastService.showMessage(
          'error',
          'Error',
          'Ha ocurrido un error al cargar los datos: ' + err.error.message,
          err.error.status,
        );
        //Envía un mensaje de carga exitosa
        this.messageService.mostrar(
          this.statusMessages,
          'msg' + this.idObjeto(),
          'error',
          'Hubo un error al cargar los datos.',
        );
      },
    });
  }

  //MÉTODO QUE ELIMINA UNA FILA DEL GRID
  eliminarFila(rowData: FilaReserva): void {
    if(this.itinerarioAbierto()===rowData._rowId) {this.toastService.showMessage('warn','Reserva','Cierre primero el itinerario del producto.');return;}
    if (rowData[this.campoId] === 0) {
      this.filas.set(this.filas().filter(item => item._rowId !== rowData._rowId));
    } else {
      this.confirmationService.confirm({
        message: '¿Desea eliminar la fila?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.reservasService.eliminaDetalleReserva(rowData[this.campoId]!).subscribe({
            next: (resp) => {
              this.filas.set(
                this.filas().filter((item) => item[this.campoId] != resp.idSecuencial),
              );
              //Envía un mensaje de carga exitosa
              this.messageService.mostrar(
                this.statusMessages,
                'msg' + this.idObjeto(),
                'success',
                'Fila eliminada correctamente.',
              );
            },
            error: (err) => {
              this.toastService.showMessage(
                'error',
                'Error',
                'Ha ocurrido un error: ' + err.error.message,
                err.error.status,
              );
              //Envía un mensaje de carga exitosa
              this.messageService.mostrar(
                this.statusMessages,
                'msg' + this.idObjeto(),
                'error',
                'Hubo un error al eliminar la fila.',
              );
            },
          });
        },
      });
    }
  }

  //MÉTODO QUE ELIMINA VARIAS FILAS SELECCIONADAS DEL GRID
  eliminarVarias(): void {
    if(this.itinerarioAbierto()) {this.toastService.showMessage('warn','Reserva','Cierre primero el itinerario antes de eliminar productos.');return;}
    const selected = this.selectedRows;
    if (selected.length > 0) {
      this.confirmationService.confirm({
        message: '¿Desea eliminar todas las filas seleccionadas?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          for (let i = 0; i < selected.length; i++) {
            let idFila = selected[i][this.campoId];
            this.reservasService.eliminaDetalleReserva(idFila!).subscribe({
              next: (resp) => {
                this.filas.set(
                  this.filas().filter((item) => item[this.campoId] != resp.idSecuencial),
                );
              },
              error: (err) => {
                this.toastService.showMessage(
                  'error',
                  'Error',
                  'Ha ocurrido un error: ' + err.error.message,
                  err.error.status,
                );
                //Envía un mensaje de carga exitosa
                this.messageService.mostrar(
                  this.statusMessages,
                  'msg' + this.idObjeto(),
                  'error',
                  'Hubo un error al eliminar una fila.',
                );
                return;
              },
            });
          }
          //Envía un mensaje de carga exitosa
          this.messageService.mostrar(
            this.statusMessages,
            'msg' + this.idObjeto(),
            'success',
            'Filas eliminadas correctamente.',
          );
        },
      });
    } else {
      this.toastService.showMessage('error', 'Error', 'Seleccione varias filas');
    }
  }

  //MÉTODO QUE MUESTRA LA AUDITORÍA DEL REGISTRO SELECCIONADO
  muestraAuditoriaRegistro(): void {
    const selected = this.selectedRows || [];
    if (selected.length === 1) {
      this.funciones.muestraAuditoria(selected[0][this.campoId], this.idTabla(), selected[0]);
    } else {
      this.toastService.showMessage(
        'error',
        'Error',
        'Seleccione un registro para ver la auditoría',
      );
    }
  }

  //CARGA TOTALES
  cargaTotales(row: DetalleReserva): void {
    const key = (row as FilaReserva)._rowId;
    this.activo = key;
    const version = this.versiones.get(key);
    this.detalleValor.set([]);
    const idDetalleReserva = row.idDetalleReserva ?? 0;
    if (idDetalleReserva !== null && idDetalleReserva !== 0) {
      this.reservasService.listaDetalleValorXDetalleReserva(idDetalleReserva).subscribe({
        next: (resp) => {
          const datos = resp.data.map((item) => ({
            ...item,
            etiqueta:
              item.tipoDetalleValor === 'T'
                ? 'Total'
                : item.tipoDetalleValor === 'S'
                  ? 'Subtotal'
                  : `Impuesto ${item.nombreImpuesto} ${item.porcentajeImpuesto}%`,
          }));
          if (this.filas().includes(row as FilaReserva) && this.versiones.get(key) === version && !this.calculando()[key]) {
            (row as FilaReserva)._valores = datos;
            if (this.activo === key) this.detalleValor.set(datos);
            this.filas.update(v => [...v]);
          }
        },
      });
    }
  }

  buscarProducto(event: AutoCompleteCompleteEvent) {
    this.busqueda?.unsubscribe();
    const nombre = event.query.trim();
    if (nombre.length < 3) {
      this.productos.set([]);
      return;
    }
    this.busqueda = this.productosService.buscaProducto(nombre).subscribe({
      next: (resp) => {
        this.productos.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage(
          'error',
          'Error',
          'Ha ocurrido un error al cargar las productos: ' + err.error.message,
          err.error.status,
        );
      },
    });
  }

  seleccionarProducto(event: { value: Productos }, fila: FilaReserva): void {
    if (!event.value?.idProducto) return;
    fila._producto = event.value;
    fila.idProducto = event.value.idProducto;
    fila.nombreProducto = event.value.nombreCorto;
    fila.idProductoXPrecioProducto = null;
    fila.idPrecioXTemporada = null;
    fila.idMotivoIngresoManual = null;
    fila.esSingleSuplement = 'N';
    fila.cantidadParcial = null;
    fila.nroUnidades = null;
    fila.porcentajeUtilidad = null;
    fila.comisionFija = null;
    const cabecera = this.stateService.reserva();
    if (cabecera?.idReserva === this.idReserva) fila.nroPax = cabecera.nroPax ?? 1;
    this.recalcular(fila, 'PRODUCTO', true);
  }

  validarProducto(fila: FilaReserva): void {
    if (fila._producto?.idProducto !== fila.idProducto) this.limpiarProducto(fila);
  }

  limpiarProducto(fila: FilaReserva): void {
    this.cancelaCalculo(fila._rowId);
    fila._producto = null;
    fila.idProducto = null;
    fila.nombreProducto = '';
    fila._calculo = undefined;
    fila._valores = [];
    fila.precioUnitario = 0;
    fila.precioTotal = 0;
    fila.cantidadTotal = 0;
    this.detalleValor.set([]);
    this.errorCalculo.update(v => ({ ...v, [fila._rowId]: true }));
    this.filas.update(v => [...v]);
  }

  iniciarEdicion(fila: FilaReserva): void {
    this.originales.set(fila._rowId, structuredClone(fila));
    this.activo = fila._rowId;
    this.cargaTotales(fila);
  }

  cancelarEdicion(fila: FilaReserva): void {
    if (this.guardando()[fila._rowId]) return;
    this.cancelaCalculo(fila._rowId);
    const original = this.originales.get(fila._rowId);
    if (original) {
      Object.keys(fila).filter(k => k.startsWith('_')).forEach(k => delete (fila as unknown as Record<string, unknown>)[k]);
      Object.assign(fila, original);
      this.filas.update(v => [...v]);
    } else if (!fila.idDetalleReserva) this.filas.update(v => v.filter(f => f !== fila));
    delete this.ediciones[fila._rowId];
    this.originales.delete(fila._rowId);
    this.errorCalculo.update(v => ({ ...v, [fila._rowId]: false }));
    this.detalleValor.set([]);
  }

  recalcular(fila: FilaReserva, accion: AccionCalculoProducto, inmediato = false): void {
    if (!fila.idProducto || this.guardando()[fila._rowId]) return;
    const key = fila._rowId;
    this.cancelaCalculo(key);
    const version = this.versiones.get(key)!;
    this.calculando.update(v => ({ ...v, [key]: true }));
    this.errorCalculo.update(v => ({ ...v, [key]: false }));
    this.activo = key;
    const ejecutar = () => {
      this.pendientes.delete(key);
      const reserva = this.idReserva;
      this.calculos.set(key, this.reservasService.calculaProductoReservado(fila, accion).subscribe({
        next: resp => {
          if (this.versiones.get(key) !== version || this.idReserva !== reserva || !this.filas().includes(fila)) return;
          const calculado = this.desdeJSON(resp.data.detalle);
          const campos: (keyof DetalleReserva)[] = [
            'nombreProducto', 'nroPax', 'fechaInicio', 'fechaFin', 'individualGeneral',
            'medidaCalculoPrecio', 'tipoPrecio', 'seReserva', 'porcentajeUtilidad', 'comisionFija',
            'nroUnidades', 'cantidadParcial', 'cantidadTotal', 'idProductoXPrecioProducto',
            'idPrecioXTemporada', 'precioUnitario', 'precioTotal', 'prioridadDescuento',
            'porcentajeDescuento', 'descuentoEnValor', 'totalImpuestoPorcentaje',
            'totalImpuestoValor', 'totalImpuestoNeto', 'esSingleSuplement', 'idMotivoIngresoManual',
          ];
          Object.assign(fila, Object.fromEntries(campos.map(campo => [campo, calculado[campo]])));
          fila._calculo = resp.data;
          fila._valores = resp.data.valores;
          fila._producto = { idProducto: fila.idProducto!, nombreCorto: fila.nombreProducto ?? '' };
          this.calculando.update(v => ({ ...v, [key]: false }));
          this.filas.update(v => [...v]);
          if (this.activo === key) this.detalleValor.set(resp.data.valores);
        },
        error: err => {
          if (this.versiones.get(key) !== version || this.idReserva !== reserva) return;
          this.calculando.update(v => ({ ...v, [key]: false }));
          this.errorCalculo.update(v => ({ ...v, [key]: true }));
          this.toastService.showMessage('error', 'Cálculo', err.error?.message ?? err.message ?? 'No se pudo calcular el producto.');
        },
      }));
    };
    if (inmediato) ejecutar();
    else this.pendientes.set(key, setTimeout(ejecutar, 250));
  }

  private cancelaCalculo(key: string): void {
    this.calculos.get(key)?.unsubscribe();
    this.calculos.delete(key);
    clearTimeout(this.pendientes.get(key));
    this.pendientes.delete(key);
    this.versiones.set(key, (this.versiones.get(key) ?? 0) + 1);
    this.calculando.update(v => ({ ...v, [key]: false }));
  }

  private limpiaCalculos(): void {
    for (const key of new Set([...this.calculos.keys(), ...this.pendientes.keys()])) this.cancelaCalculo(key);
    this.calculando.set({});
    this.guardando.set({});
    this.errorCalculo.set({});
    this.activo = null;
  }

  private desdeJSON(detalle: DetalleReservaJSON): DetalleReserva {
    return { ...detalle, fechaInicio: this.fechaDesdeBack(detalle.fechaInicio), fechaFin: this.fechaDesdeBack(detalle.fechaFin) };
  }

  private fechaDesdeBack(valor: Date | string | null | undefined): Date | null {
    if (!valor) return null;
    if (valor instanceof Date) return valor;
    // Construcción local: conserva también las horas del LocalDateTime de Java.
    const partes = valor.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/);
    if (!partes) return null;
    return new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]),
      Number(partes[4] ?? 0), Number(partes[5] ?? 0), Number(partes[6] ?? 0));
  }

  ngOnDestroy(): void {
    this.limpiaCalculos();
    this.carga?.unsubscribe();
    this.busqueda?.unsubscribe();
    this.actualizacionItinerario?.unsubscribe();
  }
}
