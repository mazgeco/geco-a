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