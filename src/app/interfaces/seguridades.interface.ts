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
  idUsuario: string | null;
  idPersona: number;
  idPerfil: string | null;
  idOperacion: number | null;
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