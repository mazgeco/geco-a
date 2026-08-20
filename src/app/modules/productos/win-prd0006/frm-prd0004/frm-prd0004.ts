//Imports core
import { Component, Input, signal, inject, computed, OnInit, ChangeDetectorRef} from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { GrdPrd0006 } from '../grd-prd0006/grd-prd0006';
import {  FormGroup, FormArray } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ProductosService } from '../../../../services/productos.service';
//Imports generales
import { Combo } from '../../../../interfaces/general.interface';
import { DiaItinerario} from '../../../../interfaces/productos.interfaces';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';

@Component({
  selector: 'app-frm-prd0004',
  imports: [...PRIMENG_MODULES, ReactiveFormsModule, GrdPrd0006],
  templateUrl: './frm-prd0004.html',
  styleUrl: './frm-prd0004.css',
})
export class FrmPrd0004 implements OnInit {
   @Input()
  idProducto!: string;

 

  //INJECTIONS PRIVADAS
  private fb = inject(FormBuilder);
  private productosService = inject(ProductosService);
  private cdr = inject(ChangeDetectorRef);

  /******************************************************************************************
  * DECLARACIÓN DE VARIABLES
  *******************************************************************************************/
// Controladores de la interfaz (Días)
  dias = signal<number[]>([1, 2]); // Empezamos con 2 días base
  diaActivo = signal<number>(1);      // Dejamos el día 1 activo 
  listaCompletaDias = signal<DiaItinerario[]>([]);
  idiomaPorItinerario = signal<Combo[]>([
        {
          codigo: 'es',
          etiqueta: 'Español',
        },
        {
          codigo: 'en',
          etiqueta: 'Inglés',
        },
      ]);
  
  //DECLARACIÓN DE LA VARIABLE PARA FORMULARIO
public frmPrd0004 = this.fb.group({
  idIdioma: ['es'],
  idItinerario: [null as number | null],       
  // idTipoInclusion: [null as number | null],
  comidasIncluidas: [''],
  duracionItinerario: [null as string | null],
  origen: [null as string | null],
  destino: [null as string | null],
  actividad: [null as string | null],
  descripcion: [null as string | null],
  observacion: [null as string | null]
});


ngOnInit(): void {
    if (this.idProducto && this.idProducto !== '0') {
      console.log('¡Código recibido en la pestaña! Buscando itinerario para:', this.idProducto);
      this.cargarItinerarioDesdeBD();
    }
  }

cargarItinerarioDesdeBD(): void {
    this.productosService.itinerarioPorProducto(this.idProducto).subscribe({
      next: (respuesta) => {
        console.log('🔴 DATOS REALES DEL ITINERARIO:', respuesta);

        // 1. Extraemos el arreglo de 7 elementos que vimos en consola
        const listaItinerario = respuesta.data;

        if (listaItinerario && listaItinerario.length > 0) {
          
          // NUEVO: Guardamos la lista completa en la signal para no perder los IDs reales
          this.listaCompletaDias.set(listaItinerario);

          // 2. Extraemos el número del día.
          const diasMapeados = listaItinerario.map((item: any) => item.diaItinerario);

          // 3. Limpiamos duplicados (por precaución) y ordenamos
          const diasUnicos = Array.from(new Set(diasMapeados)) as number[];
          const diasOrdenados = diasUnicos
            .filter(d => d !== undefined && d !== null)
            .sort((a, b) => a - b);

          // 4. Inyectamos los días reales a tu carrusel
          this.dias.set(diasOrdenados);

          // 5. Dejamos el primer día seleccionado por defecto y traemos sus datos
          if (diasOrdenados.length > 0) {
            const primerDia = diasOrdenados[0];
            this.diaActivo.set(primerDia);
            
            // Buscamos el ID real en la lista completa
            const primerDiaCompleto = listaItinerario.find((d: any) => d.diaItinerario === primerDia);
            if (primerDiaCompleto) {
              this.cargarDatosOperativos(primerDiaCompleto.idItinerario);
            }
          }
        } else {
          // Si el array viene vacío, limpiamos la pantalla
          this.dias.set([]);
        }
      },
      error: (error) => {
        console.error('Error al intentar traer el itinerario:', error);
      }
    });
  }

  // =====================================================================
  // NUEVOS MÉTODOS PARA LA FICHA OPERATIVA
  // =====================================================================

cargarDatosOperativos(idItinerario: number): void {
  this.productosService.obtenerDatosOperativos(idItinerario).subscribe({
    next: (respuesta) => {
      const idiomaActual = this.frmPrd0004.get('idIdioma')?.value || 'es';
      const listaDatos = respuesta.data || [];

      let datosParaMostrar = listaDatos.find((item: any) => item.idIdioma === idiomaActual);

      if (!datosParaMostrar && listaDatos.length > 0) {
        datosParaMostrar = listaDatos[0];
      }

      if (datosParaMostrar) {
        // Inyectamos todo el DTO real al formulario
        this.frmPrd0004.patchValue({
          idItinerario: datosParaMostrar.idItinerario,
          idIdioma: datosParaMostrar.idIdioma,
          // idTipoInclusion: datosParaMostrar.idTipoInclusion,
          duracionItinerario: datosParaMostrar.duracionItinerario,
          descripcion: datosParaMostrar.descripcionItinerario,
          origen: datosParaMostrar.origen,
          destino: datosParaMostrar.destino,
          actividad: datosParaMostrar.actividad,
          observacion: datosParaMostrar.observaciones
        }, { emitEvent: false });
      }

      this.cdr.detectChanges();
    },
    error: (error) => console.error('Error al traer la ficha operativa:', error)
  });
}

seleccionarDia(numeroDia: number): void {
  this.diaActivo.set(numeroDia);

  // Buscamos el objeto completo del día en la lista que trajo Java
  const diaEncontrado = this.listaCompletaDias().find((d: any) => d.diaItinerario === numeroDia);

  if (diaEncontrado) {
    // AQUÍ ESTÁ LA CLAVE REAL: Asignamos el idItinerario al formulario
    this.frmPrd0004.patchValue({
      idItinerario: diaEncontrado.idItinerario
    }, { emitEvent: false });

    // Y luego cargamos sus datos operativos
    this.cargarDatosOperativos(diaEncontrado.idItinerario);
  }
}


alCambiarIdioma(nuevoIdioma: string): void {
  // 1. Obligamos al formulario a reconocer el nuevo idioma instantáneamente
  this.frmPrd0004.patchValue({ idIdioma: nuevoIdioma }, { emitEvent: false });
  
  // 2. Disparamos la búsqueda de los datos
  const diaActual = this.diaActivo();
  if (diaActual) {
    this.seleccionarDia(diaActual);
  }
}



  // ==========================================
  // LÓGICA DEL CARRUSEL DE DÍAS
  // ==========================================
 

  agregarDiaSecuencial() {
    const diasActuales = this.dias();
    const nuevoDia = diasActuales.length + 1;
    this.dias.set([...diasActuales, nuevoDia]);
    this.diaActivo.set(nuevoDia); 
  }


}

