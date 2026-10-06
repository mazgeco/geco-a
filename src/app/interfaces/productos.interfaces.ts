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
  idIdiomaXItinerario: number | null;
  idIdioma: string;
  // idTipoInclusion: number;
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
  idInsumoXItinerario: number | null; // Llave primaria de esta fila
  idProducto: string;
  idItinerario: number;
  
  // Campos de la imagen
  idTipoInsumo: number | null;
  descripcionTipoInsumo?: string; 
  
  idInsumo: number | null;
  descripcionInsumo: string; 
  
  horaEjecucion: string; // Ej: '15:00'
  
  idProveedor: number | null;
  nombreProveedor?: string; 
  
  darAnticipo: boolean; 
  observacionInsumoXItinerario: string;
  
  // Auditoría
  idUsuarioCrea?: string;
  fechaCrea?: string;
  idUsuarioModifica?: string;
  fechaModifica?: string;
}

export interface Operacion {
  idOperacion: number | null;
  descripcionOperacion: string;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

export interface ListaOperacionResponse {
  status: string;
  message: string;
  data: Operacion[];
}

export interface UnidadEstrategica {
  idUnidadEstrategica: number | null;
  idOperacion: number | null;
  idTipoOperacionXEmpresa: number | null;
  descripcionUnidadEstrategica: string;
  principalUnidadEstrategica: string;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

export interface ListaUnidadEstrategicaResponse {
  status: string;
  message: string;
  data: UnidadEstrategica[];
}

export interface Temporadas{
  idTemporada: number | null;
  descripcionTemporada: string;
  fechaInicioTemporada: string;
  fechaFinTemporada: string;
  principalTemporada: string;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

export interface ListaTemporadasResponse {
  status: string;
  message: string;
  data: Temporadas[];
}

export interface Impuesto {
  idImpuesto: string;
  descripcionImpuesto: string;
  cantidadImpuesto: number;
  tipoImpuesto: string;
  tipoValor: string;
  obligatoriedad: string;
  fechaDesdeAts?: string | null;
  fechaHastaAts?: string | null;
  tipoAts?: string | null;
  codigoPorcentaje?: string | null;
  codigoImpuestoRetencion?: string | null;
  estadoImpuesto: string;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

// Interfaz para la respuesta estándar de la API que trae la lista
export interface ImpuestoResponse {
  status: string;
  message: string;
  data: Impuesto[];
}
  

export interface ActualizarTipoPrecioDTO {
  tipoPrecio: string; // 'T' (Estacional) o 'F' (Plana)
}

export interface TarifaFila {
  idPrecioProductoXTemporada: number;
  idTemporada: number;
  idProducto: string;
  descripcionPrecioProductoXTemporada: string;
  precio: number;
  paxIni: number;
  paxFin: number;
  tarifaRac: number | null;     
  idUsuarioCrea: string;
  fechaCrea: string;           
  idUsuarioModifica: string | null;
  fechaModifica: string | null;
}


export interface ListaPrecioProductoResponse {
  status: string;
  message: string;
  data: TarifaFila[];
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

export interface TipoOperacionXEmpresa {
  idTipoOperacionXempresa: number;
  idEmpresa: number;
  idTipoOperacion: string;
  nombreTipoOperacion: string;
  idUsuarioCrea?: number | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: number | null;
  fechaModifica?: string | null;
}

export interface TipoOperacionResponse {
  status: string;
  message: string;
  data: TipoOperacionXEmpresa[];
}

export interface ImpuestoProducto {
    idImpuestoXProducto?: number | null;
    idImpuesto: string;
    idProducto: string;
    valorImpuesto: number | null;
    idUsuarioCrea: string | null;
    fechaCrea: string | null;
    idUsuarioModifica: string | null;
    fechaModifica: string | null;
}

export interface ImpuestosProductoResponse {
    status: string;
    message: string;
    data: ImpuestoProducto[];
}

export interface TipoProducto {
  idTipoProducto: string | null; 
  idUnidadEstrategica?: number | null; 
  descripcionTipoProducto?: string;
  estadoTipoProducto?: string;
  idUsuarioCrea?: string;
  fechaCrea?: string;
  idUsuarioModifica?: string;
  fechaModifica?: string;
}

export interface TipoProductoResponse {
  status: string;
  message: string;
  data: TipoProducto[]; 
}


