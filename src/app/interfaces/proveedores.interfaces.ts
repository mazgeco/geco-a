export interface Proveedores {
  idProveedor: number;
  idOperacion?: number;
  idPersona: number;
  nombreProveedor: string;
  idTipoRetencionIr?: number;
  idTipoRetencionIva?: number;
  idConceptoRetencion?: number;
  estadoProveedor: EstadoProveedor;
  esInterno: Opcion;
  tipoIdentificacionAts?: string;
  diasFechaMax?: number;
  diasTimeLimit?: number;
  idUsuarioCrea: string;
  fechaCrea: string;
  idUsuarioModifica?: string;
  fechaModifica?: string;
}

export enum Opcion {
  N = "N",
  S = "S",
}

export enum EstadoProveedor {
  A = "A",
  I = "I",
}