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
    precioSinUtilidad?:   number | null;
    porcentajeUtilidad?:  number | null;
    individualGeneral:   IndividualGeneral;
    seReserva:           Opcion;
    medidaCalculoPrecio?: MedidaCalculoPrecio;
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