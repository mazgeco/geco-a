export interface ProveedoresResponse {
  status: string;
  message: string;
  data: Proveedores[];
}

export interface Proveedores {
  idProveedor: number;
  idOperacion?: number;
  idPersona: number;
  nombrePersona: string;
  idTipoRetencionIr?: number;
  idTipoRetencionIva?: number;
  idConceptoRetencion?: number;
  estadoProveedor: string;
  esInterno?: string;
  tipoIdentificacionAts?: string;
  diasFechaMax?: number;
  diasTimeLimit?: number;
  idUsuarioCrea: string;
  fechaCrea: string;
  idUsuarioModifica?: string;
  fechaModifica?: string;
}

export enum EstadoProveedor {
    A = "A",
    I = "I",
}