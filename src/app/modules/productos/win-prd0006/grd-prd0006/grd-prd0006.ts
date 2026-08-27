import { Component, computed, inject, Input, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
// TODO: Asegúrate de tener estas interfaces en tu archivo de productos
import { InsumoItinerario, TipoInsumo, ListaInsumo, ListaProveedores} from '../../../../interfaces/productos.interfaces';
import { FuntionsService } from '../../../../services/functions.service';
import { ProductosService } from '../../../../services/productos.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { MessageService } from '../../../../services/message.service';
import { ToastService } from '../../../../services/toast.service';
import { StateService } from '../state-service'; // Importamos tu pizarra central

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

  // 2. INYECTAMOS EL STATE SERVICE PARA SABER EL PRODUCTO ACTUAL
  public stateService = inject(StateService);

  // IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>('WinPrd0006');
  idObjeto = signal<string>('GrdPrd0006');
  idTabla = signal<string>('999'); // TODO: Cambiar por el ID real de tu tabla de insumos
  permiso = signal<string>('w');

  // INJECTIONS PÚBLICAS Y PRIVADAS
  funciones = inject(FuntionsService);
  private confirmationService = inject(ConfirmationService);
  private productosService = inject(ProductosService); // Cambiado a ProductosService
  private toastService = inject(ToastService);
  messageService = inject(MessageService);
  
  // MANEJO DE MENSAJES
  statusMessages = signal<Record<string, StatusMessage>>({});
  barraMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgGrdPrd0006')
  );

  // DECLARACIÓN DE VARIABLES DE LA TABLA
  selectedRows!: InsumoItinerario[];
  metaKey: boolean = true;
  fila = signal<InsumoItinerario[]>([]);
  tiposInsumo = signal<TipoInsumo[]>([]);
  listaInsumos = signal<ListaInsumo[]>([]); // Ajusta el 'any' a tu interfaz real de Insumos
  listaProveedores = signal<ListaProveedores[]>([]); // Ajusta el 'any' a tu interfaz de Proveedores

  // 3. SE EJECUTA UNA SOLA VEZ AL ABRIR LA PESTAÑA
  ngOnInit(): void {
    this.cargaTipos();
    this.cargaInsumos();
    this.cargaProveedores();
  //   if (this.idItinerario) {
  //   this.cargaDatos();
  // }
    
  }

  // 4. EL TIMBRE DE ALARMA: SE EJECUTA CADA VEZ QUE EL PADRE CAMBIA EL DÍA
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['idItinerario']&& this.idItinerario) {
  //     this.cargaDatos();
  //   }
  // }

  ngOnChanges(changes: SimpleChanges): void {
  // Verificamos si idItinerario tiene un valor (ya sea que acaba de cambiar o que acaba de llegar por primera vez)
  if (this.idItinerario) {
    this.cargaDatos();
  }
}

// INSERTA UNA FILA EN EL GRID
  insertarFila(): void {
    const idProductoActual = this.stateService.producto()?.idProducto;

    if (!idProductoActual) {
      this.toastService.showMessage('warn', 'Aviso', 'Debe guardar el producto antes de agregar insumos.');
      return;
    }

    const nueva: InsumoItinerario = {
      idItinerarioInsumo: 0,
      idProducto: idProductoActual,
      // Usamos la nueva variable this.idItinerario (Asegúrate de que la propiedad a la izquierda coincida con tu interfaz, ya sea diaItinerario o idItinerario)
      diaItinerario: this.idItinerario, 
      idTipoInsumo: null,
      idInsumo: null,
      descripcionInsumo: '',
      horaEjecucion: '',
      idProveedor: null,
      darAnticipo: false,
      observaciones: '',
      idUsuarioCrea: '',
      fechaCrea: '',
      idUsuarioModifica: '',
      fechaModifica: '',
    };

    let mensaje = this.funciones.insertRow(
      this.fila,
      nueva,
      'idItinerarioInsumo', // <- Usamos la llave primaria correcta
      true, 
      'btnGrdPrd00065'      // <- Usamos el botón del lápiz para que despierte en modo edición
    );

    if (mensaje !== '') {
      this.toastService.showMessage('error', 'Error', mensaje);
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
  saveData(insumo: InsumoItinerario): void {
    // 1. Agregamos el 'ADMIN' quemado temporalmente
    this.productosService.grabaInsumoItinerario(insumo, 'ADMIN').subscribe({
      next: (resp) => {
        // 2. Usamos el nombre correcto de la llave primaria
        insumo.idItinerarioInsumo = resp.idSecuencial!;
        this.cargaDatos(); // Refrescamos la grilla
      },
      error: (err) => {
        this.toastService.showMessage('error', 'Error', 'Error al guardar: ' + err.error.message, err.error.status);
      },
    });
  }

// READ DATOS DE LA TABLA
  cargaDatos(): void {
    this.fila.set([]);
    
    // Solo buscamos si tenemos un idItinerario válido enviado por el componente padre
    if (this.idItinerario) {
      this.productosService.listaInsumosPorItinerario(this.idItinerario).subscribe({
        next: (resp) => {
          this.fila.set(resp.data);
        },
        error: (err) => {
          this.toastService.showMessage('error', 'Error', 'Error al cargar insumos: ' + err.error.message, err.error.status);
        },
      });
    }
  }

// DELETE UNA FILA
  eliminarFila(rowData: InsumoItinerario): void {
    // 1. Usamos la llave primaria correcta (idItinerarioInsumo)
    if (rowData.idItinerarioInsumo === 0) {
      this.fila.set(this.fila().filter((item) => item.idItinerarioInsumo !== rowData.idItinerarioInsumo));
    } else {
      this.confirmationService.confirm({
        message: '¿Desea eliminar este insumo?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          // 2. Le pasamos el ID correcto y el usuario temporal 'ADMIN'
          this.productosService.eliminaInsumoItinerario(rowData.idItinerarioInsumo!, 'ADMIN').subscribe({
            next: (resp) => {
              this.fila.set(this.fila().filter((item) => item.idItinerarioInsumo !== resp.idSecuencial));
            },
            error: (err) => {
              this.toastService.showMessage('error', 'Error', 'Error al eliminar: ' + err.error.message, err.error.status);
            },
          });
        }
      });
    }
  }

  // DELETE VARIAS FILAS
  eliminarVarias(): void {
    const selected = this.selectedRows;
    if (selected && selected.length > 0) {
      this.confirmationService.confirm({
        message: '¿Desea eliminar todos los insumos seleccionados?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          for (let i = 0; i < selected.length; i++) {
            // 1. Usamos la llave primaria correcta
            let idItinerarioInsumo = selected[i].idItinerarioInsumo;
            
            // 2. Le pasamos el ID y el usuario temporal 'ADMIN'
            this.productosService.eliminaInsumoItinerario(idItinerarioInsumo!, 'ADMIN').subscribe({
              next: (resp) => {
                // 3. Actualizamos el filtro con la llave correcta
                this.fila.set(this.fila().filter((item) => item.idItinerarioInsumo !== resp.idSecuencial));
              },
              error: (err) => {
                this.toastService.showMessage('error', 'Error', 'Error al eliminar: ' + err.error.message, err.error.status);
              },
            });
          }
        }
      });
    } else {
      this.toastService.showMessage('error', 'Error', 'Seleccione varias filas');
    }
  }

  // AUDITORÍA DEL REGISTRO
  muestraAuditoriaRegistro(): void {
    const selected = this.selectedRows || [];
    if (selected.length === 1) {
      this.funciones.muestraAuditoria(selected[0].idInsumo, this.idTabla(), selected[0]);
    } else {
      this.toastService.showMessage('error', 'Error', 'Seleccione un registro para ver la auditoría');
    }
  }
}
