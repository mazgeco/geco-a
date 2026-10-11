export interface ListaUsuariosResponse {
  status: string;
  message: string;
  data: Usuarios[];
}

export interface UsuariosResponse {
  status: string;
  message: string;
  data: Usuarios;
}

export interface Usuarios {
  idUsuario?: string | null;
  idPersona: number;
  idPerfil?: string | null;
  idOperacion?: string | null;
  nombrePersona?: string | null;
  superUsuario?: string | null;
  estadoUsuario: string | null;
  disparaAlerta1?: string | null;
  disparaAlerta2?: string | null;
  habilitaColores?: string | null;
  fechaUltimoCambioClave?: Date;
  cambiaClave?: string | null;
  regeneraComponentes?: string | null;
  usuarioEmail?: null | string;
  passwordEmail?: null | string;
  firmaEmail?: null | string;
  ejecutaKardexCompra?: string | null;
  desmayoriza?: string | null;
  modificaFormaPago?: string | null;
  accesoColumna?: string | null;
  soloProductosOperacion?: string | null;
  token?: string | null;
  saltaAprobacion?: string | null;
  ingresarRubroPrefactura?: string | null;
  generarPrefactura?: string | null;
  reversarPrefactura?: string | null;
  verRubroPrefactura?: string | null;
  anulaComprobanteContable?: string | null;
  correoRespuesta?: string | null;
  sobreescribeImportacion?: string | null;
  accedeEstadoConfirmado?: string | null;
  cambiaUsuarioCrea?: string | null;
  registraAnticipo?: string | null;
  cambiaImpuestoPorcentual?: string | null;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

export enum EstadoUsuario {
  A = 'A',
  I = 'I',
}

export interface ListaPerfilesResponse {
  status: string;
  message: string;
  data: Perfiles[];
}

export interface PerfilesResponse {
  status: string;
  message: string;
  data: Perfiles;
}

export interface Perfiles {
  idPerfil: null | string;
  descripcionPerfil: null | string;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

export interface ListaObjetosResponse {
  status: string;
  message: string;
  data: Objetos[];
}

export interface ObjetosResponse {
  status: string;
  message: string;
  data: Objetos;
}

export interface Objetos {
  idObjeto?: number | null;
  idModulo?: string | null;
  idOpcionMenu?: string | null;
  idTabla?: number | null;
  descripcionObjeto?: string | null;
  tipoObjeto?: string | null;
  nombreArchivo?: string | null;
  tituloObjeto?: string | null;
  idUsuarioCrea?: string | null;
  fechaCrea?: Date | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: Date | null;
}

export interface UsuarioValidadoResponse {
  status: string;
  message: string;
  data: UsuarioValidado;
}

export interface UsuarioValidado {
  idUsuario: string;
  nombre: string;
  token: string;
  tokenType?: string;
  expiresAt?: string;
  idPerfil?: string;
  roles?: string[];
}

export interface UsuarioSesion {
  idUsuario?: string | null;
  idPersona: number;
  idPerfil?: string | null;
  nombrePersona?: string | null;
  estadoUsuario: string | null;
  superUsuario?: string | null;
}