import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Injector, runInInjectionContext, signal } from '@angular/core';
import { Subject, of } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { GrdRes0021 } from './grd-res0021';
import { ReservasService } from '../../../../services/reservas.service';
import { ProductosService } from '../../../../services/productos.service';
import { FuntionsService } from '../../../../services/functions.service';
import { ToastService } from '../../../../services/toast.service';
import { MessageService } from '../../../../services/message.service';
import { StateService } from '../../state-service';
import { Productos } from '../../../../interfaces/productos.interfaces';
import { CalculoProductoReservadoResponse, GrabaProductoReservadoResponse } from '../../../../interfaces/producto-reservado.interfaces';

describe('GrdRes0021: cálculo y guardado del producto', () => {
  let component: GrdRes0021;
  let requests: Subject<CalculoProductoReservadoResponse>[];
  let save: Subject<GrabaProductoReservadoResponse>;
  let totals: Subject<any>;
  let reservas: any;
  let toast: any;
  beforeEach(() => {
    requests = []; save = new Subject(); totals = new Subject();
    reservas = {
      calculaProductoReservado: vi.fn(() => { const request = new Subject<CalculoProductoReservadoResponse>(); requests.push(request); return request; }),
      grabaProductoReservado: vi.fn(() => save),
      listaDetalleValorXDetalleReserva: vi.fn(() => totals),
    };
    toast = { showMessage: vi.fn() };
    const injector = Injector.create({ providers: [
      { provide: ReservasService, useValue: reservas },
      { provide: ProductosService, useValue: { buscaProducto: () => of({ data: [] }) } },
      { provide: FuntionsService, useValue: { insertRowA: (filas: any, row: any) => { filas.update((v: any[]) => [...v, row]); return ''; } } },
      { provide: ConfirmationService, useValue: {} },
      { provide: ToastService, useValue: toast },
      { provide: MessageService, useValue: { obtener: () => null, mostrar: vi.fn() } },
      { provide: StateService, useValue: { reserva: signal({ idReserva: 1, nroPax: 5 }) } },
    ] });
    component = runInInjectionContext(injector, () => new GrdRes0021());
    component.idReserva = 1; component.insertarFila();
  });
  afterEach(() => { component.ngOnDestroy(); vi.useRealTimers(); });
  const producto = (id = 'P1') => ({ idProducto: id, nombreCorto: id === 'P1' ? 'Tour' : 'Hotel' }) as Productos;
  const respuesta = (fila: any, precio = 100): CalculoProductoReservadoResponse => ({
    status: 'OK', message: 'Calculado', data: {
      detalle: { ...fila, fechaInicio: '2026-01-10T09:00:00', fechaFin: '2026-01-12T09:00:00', nroPax: 5, cantidadParcial: 5, cantidadTotal: 10, precioUnitario: precio, precioTotal: precio * 10 },
      diasItinerario: 2, esEspacio: 'N', nroEspacios: 1, cortaItinerario: 'N', nombrePrecioProducto: '', nombreTemporada: '',
      valores: [{ tipoDetalleValor: 'T', valor: precio * 10, etiqueta: 'Total' }],
    },
  });
  it('selecciona el objeto, envía PRODUCTO y aplica pax, fechas, cantidades y precio', () => {
    const row = component.filas()[0];
    component.seleccionarProducto({ value: producto() }, row);
    expect(row.idProducto).toBe('P1'); expect(row._producto?.nombreCorto).toBe('Tour'); expect(row.nroPax).toBe(5);
    expect(reservas.calculaProductoReservado).toHaveBeenCalledWith(row, 'PRODUCTO');
    expect(component.calculando()[row._rowId]).toBe(true);
    requests[0].next(respuesta(row));
    expect(row.fechaFin?.getDate()).toBe(12); expect(row.fechaInicio?.getHours()).toBe(9);
    expect(row.cantidadTotal).toBe(10); expect(row.precioTotal).toBe(1000);
    expect(row._valores?.[0].valor).toBe(1000); expect(component.calculando()[row._rowId]).toBe(false);
    expect(reservas.grabaProductoReservado).not.toHaveBeenCalled();
  });
  it('conserva las observaciones escritas mientras llega el cálculo', () => {
    const row = component.filas()[0]; component.seleccionarProducto({ value: producto() }, row);
    const response = respuesta(row); row.observacionDetalle = 'Nueva observación'; row.blankCopy = 'S';
    requests[0].next(response);
    expect(row.observacionDetalle).toBe('Nueva observación'); expect(row.blankCopy).toBe('S');
  });
  it('cancela el cálculo anterior al seleccionar otro producto', () => {
    const row = component.filas()[0]; component.seleccionarProducto({ value: producto() }, row);
    const antigua = respuesta(row, 10);
    component.seleccionarProducto({ value: producto('P2') }, row);
    requests[1].next(respuesta(row, 200)); requests[0].next(antigua);
    expect(row.idProducto).toBe('P2'); expect(row.precioUnitario).toBe(200);
  });
  it('agrupa cambios rápidos y bloquea guardar mientras el cálculo está pendiente', () => {
    vi.useFakeTimers(); const row = component.filas()[0];
    component.seleccionarProducto({ value: producto() }, row); requests[0].next(respuesta(row));
    component.recalcular(row, 'INICIO'); component.recalcular(row, 'PAX'); component.saveRow(row);
    expect(reservas.grabaProductoReservado).not.toHaveBeenCalled();
    vi.advanceTimersByTime(250); expect(reservas.calculaProductoReservado).toHaveBeenCalledTimes(2);
    expect(reservas.calculaProductoReservado).toHaveBeenLastCalledWith(row, 'PAX');
  });
  it('usa el guardado nuevo y mantiene la edición hasta recibir éxito', () => {
    const row = component.filas()[0]; component.seleccionarProducto({ value: producto() }, row); requests[0].next(respuesta(row));
    component.saveRow(row); component.saveRow(row);
    expect(reservas.grabaProductoReservado).toHaveBeenCalledTimes(1); expect(component.ediciones[row._rowId]).toBe(true);
    save.next({ status: 'OK', message: 'Guardado', idSecuencial: 99, data: respuesta(row).data.detalle });
    expect(row.idDetalleReserva).toBe(99); expect(component.ediciones[row._rowId]).toBeUndefined();
    expect(component.guardando()[row._rowId]).toBe(false);
  });
  it('mantiene la fila editable si falla el guardado', () => {
    const row = component.filas()[0]; component.seleccionarProducto({ value: producto() }, row); requests[0].next(respuesta(row));
    component.saveRow(row); save.error({ error: { message: 'Conflicto de horario' } });
    expect(component.ediciones[row._rowId]).toBe(true); expect(component.guardando()[row._rowId]).toBe(false);
    expect(row.idDetalleReserva).toBe(0); expect(toast.showMessage).toHaveBeenLastCalledWith('error', 'Error', 'Conflicto de horario');
  });
  it('bloquea guardar si falla el cálculo y permite reintentar', () => {
    const row = component.filas()[0]; component.seleccionarProducto({ value: producto() }, row);
    requests[0].error({ error: { message: 'Sin tarifa' } });
    component.saveRow(row); expect(reservas.grabaProductoReservado).not.toHaveBeenCalled();
    component.recalcular(row, 'VALORES', true); requests[1].next(respuesta(row)); expect(component.errorCalculo()[row._rowId]).toBe(false);
  });
  it('no reemplaza el cálculo nuevo con los totales guardados de una petición antigua', () => {
    const row = component.filas()[0]; row.idDetalleReserva = 7;
    component.cargaTotales(row); component.seleccionarProducto({ value: producto() }, row); requests[0].next(respuesta(row));
    totals.next({ data: [{ tipoDetalleValor: 'T', valor: 7 }] });
    expect(row._valores?.[0].valor).toBe(1000);
  });
  it('limpiar el producto cancela su petición y bloquea guardar', () => {
    const row = component.filas()[0]; component.seleccionarProducto({ value: producto() }, row);
    component.limpiarProducto(row); requests[0].next(respuesta(row)); component.saveRow(row);
    expect(row.idProducto).toBeNull(); expect(row.precioUnitario).toBe(0); expect(reservas.grabaProductoReservado).not.toHaveBeenCalled();
  });
  it('cancelar una fila nueva conserva las otras filas nuevas', () => {
    const original = component.filas()[0]; component.insertarFila();
    component.cancelarEdicion(component.filas()[1]); expect(component.filas()).toEqual([original]);
  });
});
