import { DetalleReserva, DetalleValorXDetalleReserva } from './reservas.interfaces';

export type AccionCalculoProducto = 'PRODUCTO' | 'INICIO' | 'FECHAS' | 'PAX' | 'TARIFA' | 'VALORES';
export type DetalleReservaJSON = Omit<DetalleReserva, 'fechaInicio' | 'fechaFin'> & {
  fechaInicio: string | null;
  fechaFin: string | null;
};
export type ValorProductoCalculado = DetalleValorXDetalleReserva & { etiqueta: string };
export interface CalculoProductoReservado {
  detalle: DetalleReservaJSON;
  diasItinerario: number;
  esEspacio: string;
  nroEspacios: number;
  cortaItinerario: string;
  nombrePrecioProducto: string;
  nombreTemporada: string;
  valores: ValorProductoCalculado[];
}
export interface CalculoProductoReservadoResponse {
  status: string;
  message: string;
  data: CalculoProductoReservado;
}
export interface GrabaProductoReservadoResponse {
  status: string;
  message: string;
  idSecuencial: number;
  data: DetalleReservaJSON;
}
