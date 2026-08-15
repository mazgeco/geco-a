//Imports core
import { Component, Input, signal, inject, computed} from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { GrdPrd0006 } from '../grd-prd0006/grd-prd0006';
import {  FormGroup, FormArray } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
//Imports generales

import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';

@Component({
  selector: 'app-frm-prd0004',
  imports: [...PRIMENG_MODULES, ReactiveFormsModule, GrdPrd0006],
  templateUrl: './frm-prd0004.html',
  styleUrl: './frm-prd0004.css',
})
export class FrmPrd0004 {
   @Input()
  idProducto!: string;

 

  //INJECTIONS PRIVADAS
  private fb = inject(FormBuilder);
 

  /******************************************************************************************
  * DECLARACIÓN DE VARIABLES
  *******************************************************************************************/
// Controladores de la interfaz (Días)
  dias = signal<number[]>([1, 2]); // Empezamos con 2 días base
  diaActivo = signal<number>(1);      // Dejamos el día 1 activo por 
  


  //DECLARACIÓN DE LA VARIABLE PARA FORMULARIO
  public frmPrd0004 = this.fb.group({
    descripcion: [null],
    origen: [null],
    destino: [null],
    actividad: [null],
    observacion: [null],
    comidasIncluidas: [[]],
    // Aquí nace el arreglo dinámico para la columna derecha
    insumos: this.fb.array([]) 
  });

  // ==========================================
  // CICLO DE VIDA
  // ==========================================


  // ==========================================
  // LÓGICA DEL CARRUSEL DE DÍAS
  // ==========================================
  cambiarDia(numeroDia: number) {
    this.diaActivo.set(numeroDia);
    // Nota: Aquí a futuro irá la lógica para limpiar el formulario y cargar los datos del nuevo día
  }

  agregarDiaSecuencial() {
    const diasActuales = this.dias();
    const nuevoDia = diasActuales.length + 1;
    this.dias.set([...diasActuales, nuevoDia]);
    this.diaActivo.set(nuevoDia); 
  }

 
}

