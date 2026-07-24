export interface Modulo {
  nombre: string;
  descripcion: string;
  ruta: string;
  icono: string;
  color: string;
};

export interface StatusMessage {
  severity: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';
  icon: string;
  text: string;
  visible: boolean;
}

export interface SavedRow {
  status: string;
  message: string;
  idSecuencial: number;
}
