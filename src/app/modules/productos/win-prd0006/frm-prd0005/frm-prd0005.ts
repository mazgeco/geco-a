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
import { ToastService } from '../../../../services/toast.service';
import { FuntionsService } from '../../../../services/functions.service';

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
  
  /******************************************************************************************
  * DECLARACIÓN DE VARIABLES
  *******************************************************************************************/

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>("WinPrd0006");
  idObjeto = signal<string>("FrmPrd0005");
  idTabla = signal<string>("204");
  permiso = signal<string>("w");

  //INJECTIONS PUBLICAS
  funciones = inject(FuntionsService);

  //INJECTIONS PRIVADAS
  private fb = inject(FormBuilder);
  private productosService = inject(ProductosService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);

  //VARIABLES PARA EL MANEJO DE LOS MENSAJES
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  productoMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgFrmPrd0005'),
  );

  //DECLARACIÓN DE VARIABLES
  private procesandoEliminacion = false;
  public mapaValoresGuardados: Record<string, number | string | null> = {};
  listaImpuestosActivos: Impuesto[] = [];
  mapaImpuestosExistentes: Record<string, number> = {};
  cargandoDatos: boolean = true;
  
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
      if (this.procesandoEliminacion) {
      return;
    }
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
        // 1. Verificamos si este impuesto guardado realmente pertenece a los impuestos activos
        const esImpuestoValido = this.listaImpuestosActivos.some(activo => activo.idImpuesto === imp.idImpuesto);
        if (esImpuestoValido) {
          seleccionados.push(imp.idImpuesto);
          if (imp.idImpuestoXProducto) {
            this.mapaImpuestosExistentes[imp.idImpuesto] = imp.idImpuestoXProducto;
          }
          if (imp.valorImpuesto !== null && imp.valorImpuesto !== undefined) {
            variables[imp.idImpuesto] = imp.valorImpuesto;
            // NUEVO: Guardamos el valor inicial para las Deltas
            this.mapaValoresGuardados[imp.idImpuesto] = imp.valorImpuesto;
          } else {
            this.mapaValoresGuardados[imp.idImpuesto] = null;
          }
        }
      });
      console.log('6. Se enviaron a marcar estos IDs:', seleccionados);
      // Envolvemos la inyección para asegurar que el HTML (*ngFor) ya esté renderizado
      setTimeout(() => {
        // 1. Inyectamos agresivamente el arreglo directo al control de los checkboxes
        this.frmPrd0005.get('impuestosSeleccionados')?.setValue(seleccionados, { emitEvent: false });
        // 2. Parcheamos los valores numéricos (las cajas de texto de las variables) si existen
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
    if (this.cargandoDatos) return;
    const seleccionados = this.frmPrd0005.get('impuestosSeleccionados')?.value as string[] || [];
    const valoresVariables = this.frmPrd0005.get('valoresVariables')?.value as Record<string, number | string | null> || {};
    seleccionados.forEach((idImpuesto) => {
      const idImpuestoXProducto = this.mapaImpuestosExistentes[idImpuesto];
      const valorActual = valoresVariables[idImpuesto] !== undefined ? valoresVariables[idImpuesto] : null;
      const valorGuardado = this.mapaValoresGuardados[idImpuesto];
      // Filtro de espera para impuestos variables
      const impuestoInfo = this.listaImpuestosActivos.find(i => i.idImpuesto === idImpuesto);
      const esVariable = impuestoInfo?.tipoValor === 'V';
      // Si es tarifa variable y el input está vacío o es null, NO enviamos nada al backend aún.
      if (esVariable && (valorActual === null || valorActual === '')) {
        return; // Pasa al siguiente impuesto de la lista sin hacer POST/PUT
      }
      //  ¿Es nuevo (no tiene idImpuestoXProducto) O su valor cambió?
      if (!idImpuestoXProducto || valorActual !== valorGuardado) {
        const payload: any = { // O tu interfaz ImpuestoProducto si la tienes importada
          idImpuesto: idImpuesto,
          idProducto: this.idProducto,
          valorImpuesto: valorActual,
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
          // ACTUALIZAMOS EL RASTREADOR: Registramos el nuevo valor para que no vuelva a entrar al IF
          this.mapaValoresGuardados[idImpuesto] = valorActual;
          if (!idImpuestoXProducto && resp.idSecuencial) { // Ojo: verifica si tu backend devuelve 'idSecuencial' o 'id'
            this.mapaImpuestosExistentes[idImpuesto] = resp.idSecuencial; 
          }
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
      }
      // Si no es nuevo y el valor es idéntico, el código simplemente pasa al siguiente impuesto sin hacer nada.
    });
  }

  isSeleccionado(valor: string): boolean {
    const seleccionados = this.frmPrd0005.get('impuestosSeleccionados')?.value as string[];
    return seleccionados ? seleccionados.includes(valor) : false;
  }


verificarCambioCheckbox(idImpuesto: string): void {
  const seleccionados = this.frmPrd0005.get('impuestosSeleccionados')?.value as string[] || [];
  const sigueMarcado = seleccionados.includes(idImpuesto);
  if (!sigueMarcado) {
    const idImpuestoXProducto = this.mapaImpuestosExistentes[idImpuesto];
    if (idImpuestoXProducto) {
      this.confirmationService.confirm({
        message: '¿Está seguro que desea eliminar este impuesto del producto?',
        header: 'Eliminar',
        //icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        //acceptButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.procesandoEliminacion = true;
          this.productosService.eliminaImpuestoProducto(idImpuestoXProducto, 'mparraga').subscribe({
            next: () => {
              this.messageService.mostrar(
                this.statusMessages, 
                'msgFrmPrd0005', 
                'success', 
                'Dato eliminado correctamente.'
              );
              // Limpieza de memoria
              delete this.mapaImpuestosExistentes[idImpuesto];
              delete this.mapaValoresGuardados[idImpuesto];
              // Vaciamos el input en el formulario para que no reviva
              const valoresGroup = this.frmPrd0005.get('valoresVariables');
              if (valoresGroup && valoresGroup.get(idImpuesto)) {
                valoresGroup.get(idImpuesto)?.setValue(null, { emitEvent: false });
              }
              // Desactivamos el candado
              setTimeout(() => {
                this.procesandoEliminacion = false;
              }, 600);
            },
            error: (err) => {
              console.error('Error al eliminar:', err);
              this.procesandoEliminacion = false;
            }
          });
        },
        // SI CANCELA: Revertimos visualmente el checkbox
        reject: () => {
          // El check ya se desmarcó visualmente, lo volvemos a marcar inyectándolo de nuevo
          seleccionados.push(idImpuesto);
          this.frmPrd0005.get('impuestosSeleccionados')?.setValue(seleccionados, { emitEvent: false });
        }
      });
    }
  }
  }
}


 

  
  

