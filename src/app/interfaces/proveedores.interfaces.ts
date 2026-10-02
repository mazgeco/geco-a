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
  A = 'A',
  I = 'I',
}

export interface SuperTipoInsumoResponse {
  status: string;
  message: string;
  data: SuperTipoInsumo[];
}

export interface SuperTipoInsumo {
  idSuperTipoInsumo?: number | null;
  idTipoOperacionXEmpresa?: number | null;
  descripcionSuperTipoInsumo?: string | null;
  tipoOrdenTrabajo?: string | null;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}

export interface InsumosResponse {
  status: string;
  message: string;
  data: Insumos[];
}

export interface Insumos {
  idInsumo?: number | null;
  idTipoInsumo?: number | null;
  idTipoPresentacion?: number | null;
  idUbicacionExistencia?: number | null;
  idUnidadMedida?: string | null;
  idProveedor?: number | null;
  porcionXMedida?: number | null;
  descripcionInsumo?: string | null;
  costoPresupuestado?: number | null;
  costoPromedio?: number | null;
  idMonedaPresupuesto?: number | null;
  estadoInsumo?: string | null;
  individualGeneral?: string | null;
  imagenInsumo?: string | null;
  stockMaximo?: number | null;
  stockMinimo?: number | null;
  publicoPrivado?: string | null;
  tipoPrecioInsumo?: string | null;
  observacionInsumo?: string | null;
  tipoBien?: string | null;
  darAnticipo?: string | null;
  codigoExterno?: string | null;
  cajaChica?: string | null;
  idUsuarioCrea?: string | null;
  fechaCrea?: string | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: string | null;
}
