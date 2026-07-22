//PERSONAS
export interface Personas {
  idPersona: number;
  idTipoEmpresa?: string | null;
  idNacionalidad?: number | null;
  idDenominacion?: string | null;
  idPais?: number | null;
  apellido1?: string | null;
  apellido2?: string | null;
  nombre1?: string | null;
  nombre2?: string | null;
  razonSocial: string;
  nombreComercial?: string | null;
  fechaNacimiento?: Date | null;
  correoElectronico?: string | null;
  paginaWeb?: string | null;
  estadoPersona: EstadoPersona;
  esEntidadFinanciera?: string | null;
  genero?: string | null;
  tipoPersona?: string;
  estadoCivil?: string | null;
  identificacion?: string | null;
  telefono?: string | null;
  nombreTipoPersona?: string | null;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

export enum Opcion {
  N = "N",
  S = "S",
}

export enum EstadoPersona {
  A = "A",
  I = "I",
}

export interface Combo {
  codigo: string;
  etiqueta: string;
}

export interface ListaPersonasResponse {
  status: string;
  message: string;
  data: Personas[];
}

export interface PersonaResponse {
  status: string;
  message: string;
  data: Personas;
}

//DENOMINACIONES
export interface Denominaciones {
  idDenominacion: string;
  descripcionDenominacion: string;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

export interface ListaDenominacionesResponse {
  status: string;
  message: string;
  data: Denominaciones[];
}

//TIPO DE EMPRESAS
export interface TipoEmpresas {
  idTipoEmpresa: string;
  descripcionTipoEmpresa: string;
  tipoEmpresaInterno?: string | null;
  idUsuarioCrea?: string | null;
  fechaCrea?: Date | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: Date | null;
}

export interface ListaTipoEmpresasResponse {
  status: string;
  message: string;
  data: TipoEmpresas[];
}

//NACIONALIDADES
export interface ListaNacionalidadesResponse {
  status: string;
  message: string;
  data: Nacionalidades[];
}

export interface Nacionalidades {
  idNacionalidad: number;
  descripcionNacionalidad: string;
  idUsuarioCrea?: string | null;
  fechaCrea?: Date | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: Date | null;
}

//PAISES
export interface ListaPaisesResponse {
  status: string;
  message: string;
  data: Paises[];
}

export interface Paises {
  idPais: number;
  descripcionPais: string;
  codigoArea?: string | null;
  codigoAts?: string | null;
  codigoParaisoFiscal?: string | null;
  tipoRegimenFiscal?: string | null;
  idUsuarioCrea?: string | null;
  fechaCrea?: Date | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: Date | null;
}


//IDENTIFICACIONES
export interface Identificaciones {
  idIdentificacion: number;
  idPersona: number;
  idTipoIdentificacion: string;
  descripcionIdentificacion: string;
  fechaCaducidad: Date | null;
  principalIdentificacion: string;
  idUsuarioCrea: string | null;
  fechaCrea: Date | null;
  idUsuarioModifica: string;
  fechaModifica: Date | null;
}

export interface IdentificacionesResponse {
    status:  string;
    message: string;
    data:    Identificaciones[];
}

//GRÁFICOS
export interface GraficosResponse {
    status:  string;
    message: string;
    data:    Grafico[];
}

export interface Grafico {
    descripcion: string;
    cuantos:     number;
}