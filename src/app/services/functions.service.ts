import { inject, Injectable, WritableSignal } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class FuntionsService {

  toastService = inject(ToastService);

  //Función para convertir YYYY-MM-DD a Date sin errores de zona horaria
  convertirAFecha(fechaStr: any): Date | null | any {
    if (!fechaStr) return null;
    if (typeof fechaStr === "string") {
      const partes = fechaStr.split('-').map(Number); // [1978, 3, 2]
      // Nota: el mes en JS va de 0 a 11, por eso restamos 1
      return new Date(partes[0], partes[1] - 1, partes[2]);
    } else {
      return fechaStr;
    }
  }

  //Función que inserta una fila en cualquier p-table
  insertRow<T>(
    datos: WritableSignal<T[]>,
    nuevaFila: T,
    campoId: keyof T,
    idPadreValido: boolean,
    botonId: string
  ): string {

    const existeFilaNueva = datos()
      .some(item => (item[campoId] === 0 || item[campoId] === '0'));

    if (existeFilaNueva) {
      return "No puede insertar una nueva fila sin llenar la actual";
    }

    if (!idPadreValido) {
      return "Primero ingrese la información del registro master";
    }

    datos.update(lista => [nuevaFila, ...lista]);

    setTimeout(() => {
      const boton = document.getElementById(botonId) as HTMLButtonElement;
      boton?.click();
    });
    return "";
  }

  //Funcion que le quita la T a la fecha que viene del frontend
  formateaFecha(fecha: string | null): string {
    if (fecha === null || fecha === '') {
      return '';
    }

    return fecha.replace('T', ' ');
  }

  //Obtiene la etiqueta para un combo
  obtenerEtiqueta(tipos: any[], codigo: string, tipo = 'combo'): string {
    switch(tipo){
      case 'tipoTelefono':
        return tipos.find(item => item.idTipoTelefono === codigo)?.descripcionTipoTelefono ?? '';
      case 'tipoCaracteristica':
        return tipos.find(item => item.idTipoCaracteristica === codigo)?.descripcionTipoCaracteristica ?? '';
      default:
        return tipos.find(item => item.codigo === codigo)?.etiqueta ?? '';
    }

  }

  //Funcion que muestra la auditoria de un registro
  muestraAuditoria(id: any, idTabla: string, info: any): void {
    let informacion = "Tabla auditada: " + idTabla + "\n" +
      "Código: " + id + "\n" +
      "Usuario creación: " + info.idUsuarioCrea + "\n" +
      "Fecha creación: " + this.formateaFecha(info.fechaCrea!) + "\n" +
      "Usuario modificación: " + info.idUsuarioModifica + "\n" +
      "Fecha modificación: " + this.formateaFecha(info.fechaModifica!);
    this.toastService.showMessage("info", "Información auditoría", informacion, "", 5000);
  }

  muestraInfoObjeto(idContenedor: string, idObjeto: string, idTabla: string, permiso: string, pausa = 5000): void {

    permiso = permiso === "w" ? "Escritura" : "Lectura";

    this.toastService.showMessage("info", "Información objeto", "Contenedor: " + idContenedor +
      " \n Objeto: " + idObjeto + " \n Tabla: " + idTabla + " \n Permiso: " + permiso, "", pausa);
  }

}