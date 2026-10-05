import { Component, Input, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { ProductosService } from '../../../../services/productos.service';
import { Impuesto, ImpuestoProducto } from '../../../../interfaces/productos.interfaces';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { debounceTime } from 'rxjs/operators';
import { MessageService } from '../../../../services/message.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { StateService } from '../state-service';
import { FuntionsService } from '../../../../services/functions.service';
import { ToastService } from '../../../../services/toast.service';
@Component({
  selector: 'app-frm-prd0005',
  imports: [...PRIMENG_MODULES, ReactiveFormsModule,CheckboxModule, CommonModule],
   providers: [ConfirmationService],
  templateUrl: './frm-prd0005.html',
  styleUrl: './frm-prd0005.css',
})
export class FrmPrd0005 implements OnInit {

 @Input()
  idProducto!: string;
  
  private fb = inject(FormBuilder);
  private productosService = inject(ProductosService);
  listaImpuestosActivos: Impuesto[] = [];
  mapaImpuestosExistentes: Record<string, number> = {};
  cargandoDatos: boolean = true;

   //VARIABLES PARA EL MANEJO DE LOS MENSAJES
    messageService = inject(MessageService);
    statusMessages = signal<Record<string, StatusMessage>>({});
    productoMessage = computed(() =>
      this.messageService.obtener(this.statusMessages, 'msgFrmPrd0005'),
    );

  // Creamos el FormGroup con un control para los checkboxes
  public frmPrd0005 = this.fb.group({
    impuestosSeleccionados: [[] as string[]], // Almacenará los valores seleccionados, ej: ['IVA', 'GALAPAGOS']
    valoresVariables: this.fb.group({})
  });

 ngOnInit(): void {
  this.cargarImpuestos();

  this.frmPrd0005.valueChanges.pipe(
    debounceTime(400)
  ).subscribe(() => {
    this.saveForm(); // Llama directamente al método unificado
  });
}


  cargarImpuestos() {
    console.log('1. Iniciando carga de impuestos generales...');

    this.productosService.obtenerImpuestosActivos().subscribe({
      next: (respuesta) => {
        // 1. Asignamos los datos inmediatamente para que el HTML dibuje las tarjetas
        this.listaImpuestosActivos = respuesta.data; 
        console.log('2. Impuestos generales cargados:', this.listaImpuestosActivos);
        
        // 2. Ordenamos: Variables ('V') arriba, Fijos abajo
        this.listaImpuestosActivos.sort((a, b) => {
          if (a.tipoValor === 'V' && b.tipoValor !== 'V') return -1;
          if (a.tipoValor !== 'V' && b.tipoValor === 'V') return 1;
          return 0;
        });
        
        // 3. Preparamos los controles para los valores variables
        const valoresGroup = this.frmPrd0005.get('valoresVariables') as FormGroup;
        this.listaImpuestosActivos.forEach(impuesto => {
          if (impuesto.tipoValor === 'V') {
            valoresGroup.addControl(impuesto.idImpuesto, this.fb.control(null));
          }
        });

        // 4. Si estamos editando (ID válido), cargamos los checks guardados del producto
        if (this.idProducto && this.idProducto !== '0') {
           console.log('3. Es producto existente, cargando sus impuestos guardados...');
           this.cargarImpuestosDelProducto();
        }
      },
      error: (error) => {
        console.error('Error al cargar los impuestos activos:', error);
      }
    });
  }

  // cargarImpuestosDelProducto() {
  //   this.productosService.obtenerImpuestosPorProducto(this.idProducto).subscribe({
  //     next: (respuesta) => {
  //       const impuestosGuardados = respuesta.data; 
        
  //       const seleccionados: string[] = [];
  //       const variables: any = {}; // Aquí puedes crear una interfaz Record<string, number> si deseas ser aún más estricta

  //       // Ahora TypeScript te autocompletará imp.idImpuesto e imp.valorImpuesto
  //       impuestosGuardados.forEach((imp: ImpuestoProducto)=> {
  //         seleccionados.push(imp.idImpuesto); 
          
  //         if (imp.valorImpuesto !== null && imp.valorImpuesto !== undefined) {
  //            variables[imp.idImpuesto] = imp.valorImpuesto; 
  //         }
  //       });

  //       this.frmPrd0005.patchValue({
  //         impuestosSeleccionados: seleccionados,
  //         valoresVariables: variables
  //       });
  //     },
  //     error: (error) => {
  //       console.error('Error al cargar datos guardados:', error);
  //     }
  //   });
  // }

 cargarImpuestosDelProducto() {
    console.log('4. Ejecutando la llamada al backend para los guardados...');
    
    this.productosService.obtenerImpuestosPorProducto(this.idProducto).subscribe({
      next: (respuesta) => {
        console.log('5. Respuesta del backend (Impuestos Guardados):', respuesta.data); 
        
        const impuestosGuardados = respuesta.data;
        const seleccionados: string[] = [];
        const variables: any = {};

        // Llenamos los arreglos
        impuestosGuardados.forEach((imp: ImpuestoProducto) => {
        // 1. Verificamos si este impuesto guardado realmente pertenece a los impuestos activos actuales
        const esImpuestoValido = this.listaImpuestosActivos.some(activo => activo.idImpuesto === imp.idImpuesto);

  if (esImpuestoValido) {
    // Solo si es válido (ej. IVA, SHN, TAN), lo metemos al formulario
    seleccionados.push(imp.idImpuesto);
    
    // Guardamos su ID de relación para el PUT
    if (imp.idImpuestoXProducto) {
      this.mapaImpuestosExistentes[imp.idImpuesto] = imp.idImpuestoXProducto;
    }

    if (imp.valorImpuesto !== null && imp.valorImpuesto !== undefined) {
      variables[imp.idImpuesto] = imp.valorImpuesto;
    }
  } else {
    // Si es un impuesto viejo (como SRV o SH1), lo ignoramos silenciosamente
    console.warn(`Se ignoró el impuesto obsoleto de la BD: ${imp.idImpuesto}`);
  }
});
        
        console.log('6. Se enviaron a marcar estos IDs:', seleccionados);

        // Envolvemos la inyección para asegurar que el HTML (*ngFor) ya esté renderizado
        setTimeout(() => {
        // 1. Inyectamos agresivamente el arreglo directo al control de los checkboxes
        this.frmPrd0005.get('impuestosSeleccionados')?.setValue(seleccionados,{ emitEvent: false });
  
        // 2. Parcheamos los valores numéricos (las cajas de texto de los variables) si existen
        if (Object.keys(variables).length > 0) {
        this.frmPrd0005.get('valoresVariables')?.patchValue(variables, { emitEvent: false });
        }
        this.cargandoDatos = false;
      
    });
      },
      error: (error) => {
        console.error('Error al cargar datos guardados:', error);
        this.cargandoDatos = false; 
      }
    });
  }

saveForm(): void {
  // 1. Doble seguro para evitar autoguardados durante la carga inicial
  if (this.cargandoDatos) return;

  // 2. Extraemos los valores actuales del formulario
  const seleccionados = this.frmPrd0005.get('impuestosSeleccionados')?.value as string[] || [];
  const valoresVariables = this.frmPrd0005.get('valoresVariables')?.value as Record<string, number | null> || {};

  // 3. Recorremos los seleccionados y llamamos al servicio directamente
  seleccionados.forEach(idImpuesto => {
    const payload: ImpuestoProducto = {
      idImpuesto: idImpuesto,
      idProducto: this.idProducto,
      valorImpuesto: valoresVariables[idImpuesto] !== undefined ? valoresVariables[idImpuesto] : null,
      idUsuarioCrea: null,
      fechaCrea: null,
      idUsuarioModifica: null,
      fechaModifica: null
    };
    if (this.mapaImpuestosExistentes[idImpuesto]) {
  payload.idImpuestoXProducto = this.mapaImpuestosExistentes[idImpuesto];
}
    // Llamada directa al servicio exigiendo los dos parámetros (objeto y usuario)
    this.productosService.grabaImpuestoProducto(payload, 'mparraga').subscribe({
      next: (resp) => {
        console.log(`Impuesto ${idImpuesto} guardado correctamente:`, resp);
        
        this.messageService.mostrar(
          this.statusMessages,
          'msgFrmPrd0005',
          'success',
          'Dato grabado correctamente.'
        );
      },
      error: (err) => {
        console.error(`Error al guardar el impuesto ${idImpuesto}:`, err);
      }
    });
  });

 

}

isSeleccionado(valor: string): boolean {
    const seleccionados = this.frmPrd0005.get('impuestosSeleccionados')?.value as string[];
    return seleccionados ? seleccionados.includes(valor) : false;
  }


  
// eliminarImpuesto(idImpuestoXProducto: number, idImpuestoOriginal: string): void {
//   this.productosService.eliminaImpuestoProducto(idImpuestoXProducto, 'mparraga').subscribe({
//     next: () => {
//       console.log(`Impuesto ${idImpuestoOriginal} desmarcado y eliminado correctamente`);
      
//       this.messageService.mostrar(
//         this.statusMessages,
//         'msgFrmPrd0005', 
//         'success',
//         'Dato eliminado correctamente.'
//       );
      
//       // Limpiamos del mapa local
//       delete this.mapaImpuestosExistentes[idImpuestoOriginal];
//     },
//     error: (err) => {
//       console.error(`Error al eliminar el impuesto desmarcado ${idImpuestoOriginal}:`, err);
//     }
//   });
// }

// Esta función se ejecuta automáticamente cuando el usuario desmarca un checkbox en el HTML
verificarCambioCheckbox(idImpuesto: string): void {
  // Obtenemos la lista actual de seleccionados del formulario
  const seleccionados = this.frmPrd0005.get('impuestosSeleccionados')?.value as string[] || [];
  
  // Verificamos si el impuesto AÚN está en la lista. Si NO está, significa que lo acaban de desmarcar.
  const sigueMarcado = seleccionados.includes(idImpuesto);

  if (!sigueMarcado) {
    const idImpuestoXProducto = this.mapaImpuestosExistentes[idImpuesto];

    console.log(`Impuesto ${idImpuesto} desmarcado. ID en BD:`, idImpuestoXProducto);

    if (idImpuestoXProducto) {
      this.productosService.eliminaImpuestoProducto(idImpuestoXProducto, 'mparraga').subscribe({
        next: () => {
          console.log('Eliminado correctamente en el backend');
          
          this.messageService.mostrar(
            this.statusMessages,
            'msgFrmPrd0005', 
            'success',
            'Dato eliminado correctamente.'
          );
          
          delete this.mapaImpuestosExistentes[idImpuesto];
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
        }
      });
    }
  }
}



}


 

  // 3. Creamos este método para limpiar la lógica del HTML
  

