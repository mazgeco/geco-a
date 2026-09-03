export interface Productos {
    idProducto:          string;
    idTipoProducto:      string;
    nombreTipoProducto: string;
    descripcionProducto?: string | null;
    nombreCorto:         string;
    capacidadMinima?:     number | null;
    capacidadMaxima?:     number | null;
    estadoProducto:      EstadoProducto;
    tipoPrecio:          TipoPrecio;
    idCuenta?:              string | null;
    precioSinUtilidad?:   number | null;
    porcentajeUtilidad?:  number | null;
    individualGeneral:   IndividualGeneral;
    seReserva:           Opcion;
    medidaCalculoPrecio?: MedidaCalculoPrecio | null;
    cantidadInicial?:     number | null;
    totalInicial?:        number | null;
    bloqueaHorario:      Opcion;
    dependeItinerario:   Opcion;
    nroEspacios?:         number | null;
    esEspacio:           Opcion;
    seDivide:            Opcion;
    comisionFija?:        number | null;
    tipoBien:            TipoBien | null;
    cortaItinerario:     Opcion | null;
    notas?:               string | null;
    destinoPrincipal?:    string | null;
    idUsuarioCrea:       string;
    fechaCrea:           string;
    idUsuarioModifica?:   string | null;
    fechaModifica?:       string | null;
}

export enum Opcion {
    N = "N",
    S = "S",
}

export enum EstadoProducto {
    A = "A",
    I = "I",
}

export enum TipoBien {
    Bie = "BIE",
    Srv = "SRV",
}

export enum TipoPrecio {
    C = "C",
    F = "F",
    T = "T",
}
export enum IndividualGeneral {
    G = "G",
    I = "I",
}

export enum MedidaCalculoPrecio {
    N = "N",
    U = "U",
}

export enum IdiomaPorItinerario {
    ES = "ES",
    EN = "EN",
}




export interface ListaProductosResponse {
  status: string;
  message: string;
  data: Productos[];
}

export interface ProductoResponse {
  status: string;
  message: string;
  data: Productos;
}

//TIPO PRODUCTOS
export interface ListaTipoProductoResponse {
  status: string;
  message: string;
  data: NombreTipoProducto[];
}

export interface NombreTipoProducto {
  idTipoProducto: number;
 descripcionTipoProducto: string;
}

export interface DiaItinerario {
  idItinerario: number;
  idProducto: string;
  diaItinerario: number;
  imagenItinerario?: string;
  idUnidadEstrategicaItinerario?: number;
  idUsuarioCrea?: string;
  fechaCrea?: string;
  idUsuarioModifica?: string;
  fechaModifica?: string;
}

export interface ItinerarioResponse {
  status: string;
  message: string;
  data: DiaItinerario[];
}

export interface IdiomaXItinerario {
  idIdiomaXItinerario: number;
  idIdioma: string;
  idTipoInclusion: number;
  idItinerario: number;
  descripcionItinerario: string;
  origen: string;
  destino: string;
  actividad: string;
  tipoComidaIncluida?:  string | null;
  duracionItinerario: string;
  observaciones: string;
  idUsuarioCrea?: string;
  fechaCrea?: string;
  idUsuarioModifica?: string;
  fechaModifica?: string;
}

// Y su respectiva respuesta si el backend devuelve esto como lista
export interface RespuestaIdiomaItinerario {
  status: string;
  message: string;
  data: IdiomaXItinerario[]; 
}


export interface TipoInsumo {
  idTipoInsumo: number;
  descripcionTipoInsumo: string;
}

export interface ListaInsumo {
  idInsumo: number;
  descripcionInsumo: string;
}

export interface ListaProveedores {
  idProveedor: number;
  idPersona:number;
  nombrePersona: string;
  observaciones: string;
}

export interface InsumoItinerario {
  idItinerarioInsumo: number; // Llave primaria de esta fila
  idProducto: string;
  diaItinerario: number;
  
  // Campos de la imagen
  idTipoInsumo: number | null;
  descripcionTipoInsumo?: string; 
  
  idInsumo: number | null;
  descripcionInsumo: string; 
  
  horaEjecucion: string; // Ej: '15:00'
  
  idProveedor: number | null;
  nombreProveedor?: string; 
  
  darAnticipo: boolean; 
  observaciones: string;
  
  // Auditoría
  idUsuarioCrea?: string;
  fechaCrea?: string;
  idUsuarioModifica?: string;
  fechaModifica?: string;
}




