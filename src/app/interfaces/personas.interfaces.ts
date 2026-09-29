import { EstadoFila } from './general.interface';

//PERSONAS
export interface Personas {
  idPersona: number | null | undefined;
  idTipoEmpresa?: string | null | undefined;
  idNacionalidad?: number | null | undefined;
  idDenominacion?: string | null | undefined;
  idPais?: number | null | undefined;
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
  N = 'N',
  S = 'S',
}

export enum EstadoPersona {
  A = 'A',
  I = 'I',
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
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
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
  idNacionalidad: number | null;
  descripcionNacionalidad: string;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

//PAISES
export interface ListaPaisesResponse {
  status: string;
  message: string;
  data: Paises[];
}

export interface Paises {
  idPais: number | null;
  descripcionPais: string | null;
  codigoArea?: string | null;
  codigoAts?: string | null;
  codigoParaisoFiscal?: string | null;
  tipoRegimenFiscal?: string | null;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

//IDENTIFICACIONES
export interface Identificaciones {
  idIdentificacion: number | null;
  idPersona: number;
  idTipoIdentificacion: string;
  descripcionIdentificacion: string;
  fechaCaducidad: Date | null;
  principalIdentificacion: string;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

export interface IdentificacionesResponse {
  status: string;
  message: string;
  data: Identificaciones[];
}

//DIRECCIONES
export interface Direcciones {
  idDireccion: number | null;
  idTipoDireccion: string;
  idPersona: number;
  idCiudadDireccion: number;
  tipoDireccion?: string | null;
  descripcionDireccion?: string | null;
  sector?: string | null;
  callePrincipal?: string | null;
  nroCasaOEdificio?: string | null;
  codigoNumerico?: number | null;
  calleSecundaria?: string | null;
  nombreEdificio?: string | null;
  nroDepartamento?: string | null;
  datoAdicional?: string | null;
  principalDireccion: string;
  preferida?: boolean | null;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

export interface DireccionesResponse {
  status: string;
  message: string;
  data: Direcciones[];
}

//TIPOS DE DIRECCION
export interface TipoDireccionesResponse {
  status: string;
  message: string;
  data: TipoDirecciones[];
}

export interface TipoDirecciones {
  idTipoDireccion: string;
  descripcionTipoDireccion: string;
  principalTipoDireccion: string;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

//CIUDADES
export interface CiudadesResponse {
  status: string;
  message: string;
  data: Ciudades[];
}

export interface Ciudades {
  idCiudad: number;
  idProvincia: number;
  descripcionCiudad: null | string;
  idUsuarioCrea?: null | string;
  fechaCrea?: null | string;
  idUsuarioModifica?: null | string;
  fechaModifica?: null | string;
}

//PROVINCIAS
export interface ProvinciasResponse {
  status: string;
  message: string;
  data: Provincias[];
}

export interface Provincias {
  idProvincia: number | null;
  idPais: null | number;
  descripcionProvincia: null | string;
  codigoArea: null | string;
  idUsuarioCrea?: null | string;
  fechaCrea?: null | string;
  idUsuarioModifica?: null | string;
  fechaModifica?: null | string;
}

//TELÉFONOS
export interface TelefonosResponse {
  status: string;
  message: string;
  data: Telefonos[];
}

export interface Telefonos {
  idTelefono: number | null;
  idPersona: number;
  idTipoTelefono: string;
  descripcionTelefono: string;
  principalTelefono: string;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

//TIPOS DE TELÉFONOS
export interface TipoTelefonosResponse {
  status: string;
  message: string;
  data: TipoTelefonos[];
}

export interface TipoTelefonos {
  idTipoTelefono: string | null;
  descripcionTipoTelefono: string;
  principalTipoTelefono: string;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

//TIPOS DE CARACTERÍSTICAS
export interface TipoCaracteristicasResponse {
  status: string;
  message: string;
  data: TipoCaracteristicas[];
}

export interface TipoCaracteristicas {
  idTipoCaracteristica: number | null;
  descripcionTipoCaracteristica: string;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

//CARACTERÍSTICAS
export interface CaracteristicasResponse {
  status: string;
  message: string;
  data: Caracteristicas[];
}

export interface Caracteristicas {
  idCaracteristica: number | null;
  idPersona: number;
  idTipoCaracteristica: number;
  descripcionCaracteristica: string;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

//TIPO DE IDENTIFICACIÓN
export interface TipoIdentificacionesResponse {
  status: string;
  message: string;
  data: TipoIdentificaciones[];
}

export interface TipoIdentificaciones {
  idTipoIdentificacion: string | null;
  descripcionTipoIdentificacion: string;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

//TIPO DE FICHA MÉDICA
export interface TipoFichasMedicasResponse {
  status: string;
  message: string;
  data: TipoFichasMedicas[];
}

export interface TipoFichasMedicas {
  idTipoFichaMedica: string | null;
  descripcionTipoFichaMedica: string;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

//FICHA MÉDICA
export interface FichasMedicasResponse {
  status: string;
  message: string;
  data: FichasMedicas[];
}

export interface FichasMedicas {
  idFichaMedica: number | null;
  idPersona: number | null;
  idTipoFichaMedica: string | null;
  descripcionFichaMedica: string;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}
