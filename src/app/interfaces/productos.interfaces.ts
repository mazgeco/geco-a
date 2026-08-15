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

//COMPONENTES INSUMOS
export interface ComponenteInsumo {
  idComponente?: string; // O number, según tu base de datos
  tipoInsumo: string;
  idTipoInsumo?: string; // Para guardar el código real si usas catálogos
  insumo: string;
  idInsumo?: string;
  horaEjecucion: string;
  proveedor: string;
  idProveedor?: string;
  darAnticipo: boolean;
  observaciones: string;
  centroCostos: string;
}


