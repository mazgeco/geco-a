export interface ListaReservasResponse {
  status: string;
  message: string;
  data: Reservas[];
}

export interface ReservasResponse {
  status: string;
  message: string;
  data: Reservas;
}

export interface Reservas {
  idReserva: number | null;
  idPersona: number;
  idProveedor?: null;
  idPersonaContacto?: number | null;
  nombrePersona: string;
  nombrePersonaContacto: string;
  estadoReserva: EstadoReserva;
  codigoAgencia?: string | null;
  observacionReserva?: string | null;
  observacionPrivada?: string | null;
  observacionReporte?: string | null;
  observacionReporte2?: string | null;
  observacionReporte3?: string | null | string;
  observacionFacturacion?: string | null;
  rutaArchivoReferencia?: string | null;
  fechaGeneracion?: Date | string | null;
  fechaPago?: Date | null;
  nroPax?: number | null;
  importadoDe?: string | null;
  idImportadoDe?: string | null;
  fechaPagoProximo?: Date | null;
  fechaPagoFinal?: Date | null;
  timeLimit?: string | null;
  idUsuarioResponsable?: string | null;
  porcentajeDsctoAdicional?: string | null;
  idMotivoDescuento?: string | null;
  descuentoEnValor?: number | null;
  prioridadDescuento?: string | null;
  valorPagoProximo?: number | null;
  valorPagoFinal?: number | null;
  nroEncuestaPresentada?: number | null;
  nroEncuestaFaltante?: number | null;
  porcentajeSatisfaccion?: number | null;
  tipoGeneracion?: string | null;
  idUsuarioRp?: string | null;
  itinerarioEnviado?: string;
  nroFacturaLocal?: string | null;
  facturada?: string | null;
  fechaFacturacion?: Date | null;
  weIdTrip?: string | null;
  weUrl?: string | null;
  wePublished?: string | null;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

export enum EstadoReserva {
  CNF = 'CNF',
  RSV = 'RSV',
  BLQ = 'BLQ',
  XXX = 'XXX',
  ING = 'ING',
  ALM = 'ALM',
  PAG = 'PAG',
  MAN = 'MAN',
}

export const EstadoReservaNombre: Record<EstadoReserva, string> = {
  [EstadoReserva.CNF]: 'Confirmada',
  [EstadoReserva.RSV]: 'Reservada',
  [EstadoReserva.BLQ]: 'Bloqueada',
  [EstadoReserva.XXX]: 'Anulada',
  [EstadoReserva.ING]: 'Ingresada',
  [EstadoReserva.ALM]: 'Almacenada',
  [EstadoReserva.PAG]: 'Pagada',
  [EstadoReserva.MAN]: 'Mantenimiento',
};

export interface GraficoVentasAnioResponse {
  status: string;
  message: string;
  data: GraficoVentasAnio[];
}

export interface GraficoVentasAnio {
  mes: string;
  anio1: number;
  ventasAnio1: number | null;
  anio2: number;
  ventasAnio2: number | null;
  anio3: number;
  ventasAnio3: number | null;
}

export interface TipoHabitacionResponse {
  status: string;
  message: string;
  data: TipoHabitacion[];
}

export interface TipoHabitacion {
  idTipoHabitacion?: number | null;
  descripcionTipoHabitacion?: string | null;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

export interface ClasificacionResponse {
  status: string;
  message: string;
  data: Clasificacion[];
}

export interface Clasificacion {
  idClasificacion?: number | null;
  descripcionClasificacion?: string | null;
  tipoClasificacion?: string | null;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

export interface OrdenServicioResponse {
  status: string;
  message: string;
  data: OrdenServicio[];
}

export interface OrdenServicio {
  idOrdenServicio?: number | null;
  idSuperTipoInsumo?: number | null;
  nroColumna?: string | null;
  imprimeObservaciones?: string | null;
  imprimeCantidad?: string | null;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}
