import { Component, computed, inject, Input, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { TarifaFila, ListaPrecioProductoResponse} from '../../../../interfaces/productos.interfaces';
import { FuntionsService } from '../../../../services/functions.service';
import { ProductosService } from '../../../../services/productos.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { MessageService } from '../../../../services/message.service';
import { ToastService } from '../../../../services/toast.service';
import { StateService } from '../state-service';
import { CommonModule } from '@angular/common'; // Necesario para [ngClass]
import { FormsModule } from '@angular/forms';   // Necesario para [(ngModel)]

@Component({
  selector: 'app-grd-prd0011',
  imports: [...PRIMENG_MODULES, CommonModule, FormsModule],
  templateUrl: './grd-prd0011.html',
  styles: ``,
})
export class GrdPrd0011 implements OnInit {

  @Input() idProducto: string | null = null;
  @Input() idTemporada: number | null = null;
  modeloCobro: number = 1;
  fila = signal<TarifaFila[]>([]);
  nombresTarifasSugeridos: string[] = [];

    // 2. INYECTAMOS EL STATE SERVICE PARA SABER EL PRODUCTO ACTUAL
  public stateService = inject(StateService);

  // IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>('WinPrd0006');
  idObjeto = signal<string>('GrdPrd0011');
  idTabla = signal<string>('206'); // TODO: Cambiar por el ID real de tu tabla de insumos
  permiso = signal<string>('w');

  // INJECTIONS PÚBLICAS Y PRIVADAS
  funciones = inject(FuntionsService);
  private confirmationService = inject(ConfirmationService);
  private productosService = inject(ProductosService); // Cambiado a ProductosService
  private toastService = inject(ToastService);
  
  
  // MANEJO DE MENSAJES
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  barraMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgGrdPrd0011')
  );

  // DECLARACIÓN DE VARIABLES DE LA TABLA
    selectedRows!: TarifaFila[];
    metaKey: boolean = true;
    campoId: 'idPrecioProductoXTemporada' = 'idPrecioProductoXTemporada'; // Ajusta según tu interfaz
   

  ngOnInit(): void {
    //this.cargarSugerenciasTarifas();
    //this.cargaDatos(); 
  }

  ngOnChanges(changes: SimpleChanges): void {
  // Esto se dispara solito cuando el padre le pasa o cambia los valores al hijo
  if (this.idProducto && this.idTemporada) {
    this.cargaDatos();
  }

   
}

 insertarFila(): void {
    
    // Validación 1: Verificar que el producto exista
    if (!this.idProducto) {
      this.toastService.showMessage('warn', 'Aviso', 'Debe guardar el producto antes de agregar tarifas.');
      return;
    }

    // Validación 2: Verificar que se haya seleccionado una temporada en el combo
    if (!this.idTemporada) {
      this.toastService.showMessage('warn', 'Aviso', 'Seleccione una temporada primero en la parte superior.');
      return;
    }

    // Armamos el objeto con la estructura que necesita tu backend/tabla
    // (Asegúrate de que las propiedades coincidan con tu DTO en Java)
    const nueva: TarifaFila = {
      idPrecioProductoXTemporada: 0,
      idTemporada: this.idTemporada,
      idProducto: this.idProducto,
      descripcionPrecioProductoXTemporada: '', // Para "Nombre Tarifa"
      precio: 0,
      paxIni: 1,
      paxFin: 1,
      tarifaRac: null,
      idUsuarioCrea: '',
      fechaCrea: '',
      idUsuarioModifica: '',
      fechaModifica: '',
    };

    // Usamos tu función global insertRow tal como lo hacías en grd-prd0006
    let mensaje = this.funciones.insertRow(
      this.fila,              // Tu Signal que guarda la data de la tabla
      nueva,            // El objeto vacío que acabamos de armar
      'idPrecioProductoXTemporada',     // El nombre del campo clave (Primary Key)
      true,                   // Para ponerlo en modo edición
      'btnGrdPrd00110'         // El ID de tu botón en el HTML de esta tabla (ajusta si es necesario)
    );

    // Opcional: Si tu función insertRow devuelve algún mensaje de error, puedes mostrarlo
     if (mensaje !== '') {
      this.toastService.showMessage('error', 'Error', mensaje);
    }
    console.log('Filas actuales en memoria:', this.fila()); // <-- AGRÉGALO AQUÍ
  }


  // cargarSugerenciasTarifas(): void {
  //   this.productosService.listaPreciosProductos(this.idProducto).subscribe({
  //     next: (resp: ListaPrecioProductoResponse) => {
  //       const listaCompleta = resp.data || [];
        
  //       // Al escribir item., TypeScript te sugerirá 'descripcionPrecioProductoXTemporada' gracias a TarifaFila
  //       const soloNombres = listaCompleta.map(item => item.descripcionPrecioProductoXTemporada);
        
  //       // Limpiamos los duplicados
  //       this.nombresTarifasSugeridos = [...new Set(soloNombres)];
  //     },
  //     error: (err) => {
  //       this.toastService.showMessage('error', 'Error', 'No se pudieron cargar las sugerencias de tarifas');
  //     }
  //   });
  // }

  // READ DATOS DE LA TABLA DE TARIFAS
  cargaDatos(): void {
    this.fila.set([]); // Limpiamos la tabla primero
    console.log('VERIFICANDO IDs -> Producto:', this.idProducto, 'Temporada:', this.idTemporada);
    // Solo buscamos si tenemos un idProducto válido enviado por el componente padre
    if (this.idProducto && this.idTemporada) {
      this.productosService.listaPreciosProductos(this.idProducto, this.idTemporada).subscribe({
        next: (resp) => {
          console.log('DATOS REALES DE TARIFAS X TEMPORADA:', resp);
          this.fila.set(resp.data);
        },
        error: (err) => {
          if (err.status === 404) {
            // Si es 404, limpiamos la señal de la tabla silenciosamente
            this.fila.set([]);
          } else {
            this.toastService.showMessage('error', 'Error', 'Error al cargar tarifas: ' + err.error.message, err.error.status);
          }
        }
      });
    }
  }


   // CREATE / UPDATE
    saveData(Tarifa: TarifaFila): void {
      // 1. Agregamos el 'ADMIN' quemado temporalmente
      this.productosService.grabaTarifa(Tarifa).subscribe({
        next: (resp) => {
          console.log('🔴 RESPUESTA DEL BACKEND AL GRABAR TARIFA:', resp);
          // 2. Usamos el nombre correcto de la llave primaria
          Tarifa.idPrecioProductoXTemporada = resp.idSecuencial!;
          this.cargaDatos(); // Refrescamos la grilla
           this.messageService.mostrar(
            this.statusMessages,
            'msgGrdPrd0011',
            'success',
            'Dato grabado correctamente.'
          );
        },
        error: (err) => {
          this.toastService.showMessage('error', 'Error', 'Error al guardar: ' + err.error.message, err.error.status);
        },
      });
    }

  
      //MÉTODO QUE ELIMINA UNA FILA DEL GRID
        eliminarFila(rowData: TarifaFila): void {
          if (rowData[this.campoId] === 0) {
            this.fila.set(this.fila().filter((item) => item[this.campoId] != rowData[this.campoId]));
          } else {
            this.confirmationService.confirm({
              message: '¿Desea eliminar la fila?',
              header: 'Eliminar',
              acceptLabel: 'Aceptar',
              rejectLabel: 'Cancelar',
              accept: () => {
                this.productosService.eliminaTarifa(rowData[this.campoId]!).subscribe({
                  next: (resp) => {
                    this.fila.set(
                      this.fila().filter((item) => item[this.campoId] != resp.idSecuencial),
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
            this.productosService.eliminaTarifa(idFila!).subscribe({
              next: (resp) => {
                this.fila.set(
                  this.fila().filter((item) => item[this.campoId] != resp.idSecuencial),
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
    
    
      
    
      // AUDITORÍA DEL REGISTRO
      muestraAuditoriaRegistro(): void {
        const selected = this.selectedRows || [];
        if (selected.length === 1) {
          this.funciones.muestraAuditoria(selected[0].idPrecioProductoXTemporada, this.idTabla(), selected[0]);
        } else {
          this.toastService.showMessage('error', 'Error', 'Seleccione un registro para ver la auditoría');
        }
      }

}
