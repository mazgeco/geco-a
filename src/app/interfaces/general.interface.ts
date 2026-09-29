export interface Modulo {
  nombre: string;
  descripcion: string;
  ruta: string;
  icono: string;
  color: string;
}

export interface StatusMessage {
  severity: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';
  icon: string;
  text: string;
  visible: boolean;
}

export interface SavedRow {
  status: string;
  message: string;
  idSecuencial?: number;
  idNoSecuencial?: string;
}

export interface Combo {
  codigo: string;
  etiqueta: string;
}

export type EstadoFila = 'NUEVA' | 'NORMAL';


export type FilaTabla<T> = T & {
  _estadoFila?: EstadoFila;
}

//GRÁFICOS
export interface GraficosResponse {
  status: string;
  message: string;
  data: Grafico[];
}

export interface Grafico {
  descripcion: string;
  cuantos: number;
}