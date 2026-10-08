import { Component, computed, inject, Input, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/types/autocomplete';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { InsumoItinerario, TipoInsumo, ListaInsumo, ListaProveedores} from '../../../../interfaces/productos.interfaces';
import { FuntionsService } from '../../../../services/functions.service';
import { ProductosService } from '../../../../services/productos.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { MessageService } from '../../../../services/message.service';
import { ToastService } from '../../../../services/toast.service';
import { StateService } from '../state-service';
import { Proveedores } from '../../../../interfaces/proveedores.interfaces';
import { ProveedoresService } from '../../../../services/proveedores.service';
import {
  Combo,
  FilaTabla,
} from '../../../../interfaces/general.interface';

@Component({
  selector: 'app-grd-prd0006',
  standalone: true,
  imports: [...PRIMENG_MODULES],
  templateUrl: './grd-prd0006.html'
})
export class GrdPrd0006 implements OnInit, OnChanges {
  // 1. RECIBIMOS EL DÍA DESDE EL FORMULARIO PADRE
  // @Input() diaSeleccionado!: number;
  @Input() idItinerario!: number;
  @Input() idProducto!: string;

  // 2. INYECTAMOS EL STATE SERVICE PARA SABER EL PRODUCTO ACTUAL
  public stateService = inject(StateService);

  // IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>('WinPrd0006');
  idObjeto = signal<string>('GrdPrd0006');
  idTabla = signal<string>('206'); // TODO: Cambiar por el ID real de tu tabla de insumos
  permiso = signal<string>('w');
  newRow: boolean = false;

  campoId: 'idInsumoXItinerario' = 'idInsumoXItinerario'; // Cambiado a la llave primaria correcta

  // INJECTIONS PÚBLICAS Y PRIVADAS
  funciones = inject(FuntionsService);
  private confirmationService = inject(ConfirmationService);
  private productosService = inject(ProductosService); // Cambiado a ProductosService
  private toastService = inject(ToastService);
  private proveedoresService = inject(ProveedoresService);
  //Declaración de variables
  
   
  
  // MANEJO DE MENSAJES
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  barraMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgGrdPrd0006')
  );

  // DECLARACIÓN DE VARIABLES DE LA TABLA
  selectedRows!: InsumoItinerario[];
  metaKey: boolean = true;
  filas = signal<FilaTabla<InsumoItinerario>[]>([]);
  tiposInsumo = signal<TipoInsumo[]>([]);
  listaInsumos = signal<ListaInsumo[]>([]); // Ajusta el 'any' a tu interfaz real de Insumos
  listaProveedores = signal<ListaProveedores[]>([]); // Ajusta el 'any' a tu interfaz de Proveedores
   proveedores = signal<Proveedores[]>([]);
  nuevaFila: InsumoItinerario = {
      idInsumoXItinerario: 0,
      idProducto: this.idProducto,
      // Usamos la nueva variable this.idItinerario (Asegúrate de que la propiedad a la izquierda coincida con tu interfaz, ya sea diaItinerario o idItinerario)
      idItinerario: this.idItinerario, 
      idTipoInsumo: null,
      idInsumo: null,
      descripcionInsumo: '',
      horaEjecucion: '',
      idProveedor: null,
      razonSocial: '',
      darAnticipo: false,
      observacionInsumoXItinerario: '',
      idUsuarioCrea: '',
      fechaCrea: '',
      idUsuarioModifica: '',
      fechaModifica: '',
    };

  // 3. SE EJECUTA UNA SOLA VEZ AL ABRIR LA PESTAÑA
  ngOnInit(): void {
    this.cargaTipos();
    this.cargaInsumos();
    this.cargaProveedores();
  //   if (this.idItinerario) {
  //   this.cargaDatos();
  // }
    
  }

  ngOnChanges(changes: SimpleChanges): void {
  // Verificamos si idItinerario tiene un valor (ya sea que acaba de cambiar o que acaba de llegar por primera vez)
  if (this.idItinerario) {
    this.cargaDatos();
  }else {
    // Si el ID viene vacío (es un nuevo día temporal), limpiamos la tabla de inmediato
    this.filas.set([]);
  }
}

// INSERTA UNA FILA EN EL GRID
  // insertarFila(): void {
  //   const idProductoActual = this.stateService.producto()?.idProducto;

  //   if (!idProductoActual) {
  //     this.toastService.showMessage('warn', 'Aviso', 'Debe guardar el producto antes de agregar insumos.');
  //     return;
  //   }
  //   const nueva: InsumoItinerario = {
  //     idInsumoXItinerario: 0,
  //     idProducto: idProductoActual,
  //     // Usamos la nueva variable this.idItinerario (Asegúrate de que la propiedad a la izquierda coincida con tu interfaz, ya sea diaItinerario o idItinerario)
  //     idItinerario: this.idItinerario, 
  //     idTipoInsumo: null,
  //     idInsumo: null,
  //     descripcionInsumo: '',
  //     horaEjecucion: '',
  //     idProveedor: null,
  //     darAnticipo: false,
  //     observacionInsumoXItinerario: '',
  //     idUsuarioCrea: '',
  //     fechaCrea: '',
  //     idUsuarioModifica: '',
  //     fechaModifica: '',
  //   };

  //   let mensaje = this.funciones.insertRow(
  //     this.filas,
  //     nueva,
  //     'idInsumoXItinerario', // <- Usamos la llave primaria correcta
  //     true, 
  //     'btnGrdPrd00060'      // <- Usamos el botón del lápiz para que despierte en modo edición
  //   );

  //   if (mensaje !== '') {
  //     this.toastService.showMessage('error', 'Error', mensaje);
  //   }
  // }
    //MÉTODO QUE INSERTA UNA FILA EN EL GRID
  insertarFila(): void {
    const mensaje = this.funciones.insertRowA(
      this.filas,
      this.nuevaFila,
      true,
      'btn' + this.idObjeto() + '60',
    );
    if (mensaje !== '') {
      this.toastService.showMessage('error', 'Error', mensaje);
    } else {
      this.newRow = true;
    }
  }


  // READ TIPOS PARA EL COMBOBOX
cargaTipos(): void {
    this.productosService.listaTiposInsumos().subscribe({
      next: (resp) => {
        // 1. Guardamos los tipos en el Signal
        this.tiposInsumo.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage('error', 'Error', 'Error al cargar tipos: ' + err.error.message);
      }
    });
  }
// READ INSUMOS PARA EL COMBOX
  cargaInsumos(): void {
    this.productosService.listaInsumos().subscribe({
      next: (resp) => {
        // Guardamos la lista de insumos en su Signal correspondiente
        this.listaInsumos.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage('error', 'Error', 'Error al cargar insumos: ' + err.error.message);
      }
    });
  }

  // Método para descargar los proveedores
  cargaProveedores(): void {
    this.productosService.listaProveedores().subscribe({
      next: (resp) => {
        console.log('LO QUE LLEGA DE PROVEEDORES:', resp);
        this.listaProveedores.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage('error', 'Error', 'Error al cargar proveedores');
      }
    });
  }
  

 // CREATE / UPDATE
  // saveData(insumo: InsumoItinerario): void {
  //   // 1. Agregamos el 'ADMIN' quemado temporalmente
  //   this.productosService.grabaInsumoItinerario(insumo, 'ADMIN').subscribe({
  //     next: (resp) => {
  //       console.log('🔴 RESPUESTA DEL BACKEND AL GRABAR INSUMO:', resp);
  //       // 2. Usamos el nombre correcto de la llave primaria
  //       insumo.idInsumoXItinerario = resp.idSecuencial!;
  //       this.cargaDatos(); // Refrescamos la grilla
  //        this.messageService.mostrar(
  //         this.statusMessages,
  //         'msgGrdPrd0006',
  //         'success',
  //         'Dato grabado correctamente.'
  //       );
  //     },
  //     error: (err) => {
  //       this.toastService.showMessage('error', 'Error', 'Error al guardar: ' + err.error.message, err.error.status);
  //     },
  //   });
  // }

    saveRow(fila:InsumoItinerario): void {
      fila.idItinerario = this.idItinerario;
      this.productosService.grabaInsumoItinerario(fila, this.newRow).subscribe({
        next: (resp) => {
          fila[this.campoId] = resp.idSecuencial!;
          //Envía un mensaje de grabación exitosa
          this.messageService.mostrar(
            this.statusMessages,
            'msg' + this.idObjeto(),
            'success',
            'Fila grabada correctamente.',
          );
          this.newRow = false;
          this.cargaDatos();
        },
        error: (err) => {
          this.toastService.showMessage(
            'error',
            'Error',
            'Ha ocurrido un error: ' + err.error.message,
            err.error.status,
          );
        },
      });
    }

   

// READ DATOS DE LA TABLA
  // cargaDatos(): void {
  //   this.filas.set([]);
    
  //   // Solo buscamos si tenemos un idItinerario válido enviado por el componente padre
  //   if (this.idItinerario) {
  //     this.productosService.listaInsumosPorItinerario(this.idItinerario).subscribe({
  //       next: (resp) => {
  //          console.log('🔴 DATOS REALES DEL insumo por itinerario:', resp);
  //         this.filas.set(resp.data);
  //       },
  //       error: (err) => {
  //         if (err.status === 404) {
  //         // Si es 404, limpiamos la señal de la tabla silenciosamente para que muestre el mensaje del HTML
  //         this.filas.set([]); 
  //         } else {
  //         this.toastService.showMessage('error', 'Error', 'Error al cargar insumos: ' + err.error.message, err.error.status);
  //       }
  //       }
  //     });
  //   }
  // }

   //MÉTODO QUE CARGA TODAS LAS IDENTIFICACIONES EN EL GRID
  cargaDatos(): void {
    this.filas.set([]);
    this.productosService.listaInsumosPorItinerario(this.idItinerario).subscribe({
      next: (resp) => {
        //Coloca las filas en la estructura
        console.log('Datos de insumos por itinerario cargados:', resp.data); // Agrega este log para depuración
        this.filas.set(
          resp.data.map((item) => ({
            ...item,
            _rowId: crypto.randomUUID(),
            _estadoFila: 'NORMAL',
          })),
        );
        //Envía un mensaje de carga exitosa
        this.messageService.mostrar(
          this.statusMessages,
          'msg' + this.idObjeto(),
          'success',
          'Datos cargados correctamente.',
        );
      },
      error: (err) => {
        this.toastService.showMessage(
          'error',
          'Error',
          'Ha ocurrido un error al cargar los datos: ' + err.error.message,
          err.error.status,
        );
        //Envía un mensaje de carga exitosa
        this.messageService.mostrar(
          this.statusMessages,
          'msg' + this.idObjeto(),
          'error',
          //'Hubo un error al cargar los datos.',
          'Los insumos no se cargaron correctamente',
          err.error.status,
        );
      },
    });
  }


  //MÉTODO QUE ELIMINA UNA FILA DEL GRID
    eliminarFila(rowData: InsumoItinerario): void {
      if (rowData[this.campoId] === 0) {
        this.filas.set(this.filas().filter((item) => item[this.campoId] != rowData[this.campoId]));
      } else {
        this.confirmationService.confirm({
          message: '¿Desea eliminar la fila?',
          header: 'Eliminar',
          acceptLabel: 'Aceptar',
          rejectLabel: 'Cancelar',
          accept: () => {
            this.productosService.eliminaInsumoItinerario(rowData[this.campoId]!).subscribe({
              next: (resp) => {
                this.filas.set(
                  this.filas().filter((item) => item[this.campoId] != resp.idSecuencial),
                );
                //Envía un mensaje de carga exitosa
                this.messageService.mostrar(
                  this.statusMessages,
                  'msg' + this.idObjeto(),
                  'success',
                  'Fila eliminada correctamente.',
                );
              },
              error: (err) => {
                this.toastService.showMessage(
                  'error',
                  'Error',
                  'Ha ocurrido un error: ' + err.error.message,
                  err.error.status,
                );
                //Envía un mensaje de carga exitosa
                this.messageService.mostrar(
                  this.statusMessages,
                  'msg' + this.idObjeto(),
                  'error',
                  'Hubo un error al eliminar la fila.',
                );
              },
            });
          },
        });
      }
    }
  
    //MÉTODO QUE ELIMINA VARIAS FILAS SELECCIONADAS DEL GRID
    eliminarVariasFilas(): void {
      const selected = this.selectedRows;
      if (selected.length > 0) {
        this.confirmationService.confirm({
          message: '¿Desea eliminar todas las filas seleccionadas?',
          header: 'Eliminar',
          acceptLabel: 'Aceptar',
          rejectLabel: 'Cancelar',
          accept: () => {
            for (let i = 0; i < selected.length; i++) {
              let idFila = selected[i][this.campoId];
              this.productosService.eliminaInsumoItinerario(idFila!).subscribe({
                next: (resp) => {
                  this.filas.set(
                    this.filas().filter((item) => item[this.campoId] != resp.idSecuencial),
                  );
                },
                error: (err) => {
                  this.toastService.showMessage(
                    'error',
                    'Error',
                    'Ha ocurrido un error: ' + err.error.message,
                    err.error.status,
                  );
                  //Envía un mensaje de carga exitosa
                  this.messageService.mostrar(
                    this.statusMessages,
                    'msg' + this.idObjeto(),
                    'error',
                    'Hubo un error al eliminar una fila.',
                  );
                  return;
                },
              });
            }
            //Envía un mensaje de carga exitosa
            this.messageService.mostrar(
              this.statusMessages,
              'msg' + this.idObjeto(),
              'success',
              'Filas eliminadas correctamente.',
            );
          },
        });
      } else {
        this.toastService.showMessage('error', 'Error', 'Seleccione varias filas');
      }
    }
  
   buscarProveedores(event: AutoCompleteCompleteEvent): void {
    const nombre = event.query.trim();
    if (nombre.length < 3) {
      this.proveedores.set([]);
      return;
    }

    this.proveedoresService.buscaProveedor(nombre).subscribe({
      next: (resp) => {
        this.proveedores.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage(
          'error',
          'Error',
          'Ha ocurrido un error al cargar las proveedores: ' + err.error.message,
          err.error.status,
        );
      },
    });
  }

  seleccionarProveedor(event: any, fila: InsumoItinerario): void {
    const proveedor = event.value;
    fila.idProveedor = proveedor.idProveedor;
    fila.razonSocial = proveedor.nombrePersona;
  }

  

  // AUDITORÍA DEL REGISTRO
  muestraAuditoriaRegistro(): void {
    const selected = this.selectedRows || [];
    if (selected.length === 1) {
      this.funciones.muestraAuditoria(selected[0].idInsumoXItinerario, this.idTabla(), selected[0]);
    } else {
      this.toastService.showMessage('error', 'Error', 'Seleccione un registro para ver la auditoría');
    }
  }
  


}
