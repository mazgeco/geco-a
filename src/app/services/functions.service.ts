import { inject, Injectable, WritableSignal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class FuntionsService {

  // Función para convertir YYYY-MM-DD a Date sin errores de zona horaria
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
      .some(item => item[campoId] === 0);

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

}