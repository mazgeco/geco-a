export interface Identificaciones {
  idIdentificacion: number;
  idPersona: number;
  idTipoIdentificacion: string;
  descripcionIdentificacion: string;
  fechaCaducidad: Date | null;
  principalIdentificacion: string;
  idUsuarioCrea: string;
  fechaCrea: Date | null;
  idUsuarioModifica: string;
  fechaModifica: Date | null;
}

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
  estadoPersona: string;
  esEntidadFinanciera?: string | null;
  genero?: string | null;
  tipoPersona?: string;
  estadoCivil?: string | null;
  identificacion?: string | null;
  telefono?: string | null;
  nombreTipoPersona?: string | null;
  idUsuarioCrea?: string | null;
  fechaCrea?: Date | null;
  idUsuarioModifica?: string | null;
  fechaModifica?: Date | null;
}