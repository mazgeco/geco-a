import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { NgClass } from '@angular/common';

import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { FuntionsService } from '../../../../services/functions.service';
import { ProductosService } from '../../../../services/productos.service';
import { ToastService } from '../../../../services/toast.service';
import { MessageService } from '../../../../services/message.service';
import { UnidadEstrategica } from '../../../../interfaces/productos.interfaces';
import {
  Combo,
  FilaTabla,
  StatusMessage,
} from '../../../../interfaces/general.interface';

@Component({
  selector: 'app-grd-prd0015',
  imports: [...PRIMENG_MODULES, NgClass],
   providers: [ConfirmationService],
  templateUrl: './grd-prd0015.html',
  styles: ``,
})
export class GrdPrd0015 implements OnInit{

/******************************************************************************************
   * DECLARACIÓN DE VARIABLES
   *******************************************************************************************/

  //DEFINICIONES PRINCIPALES PROPIAS DEL OBJETO
  idContenedor = signal<string>('WinPrd0002');
  idObjeto = signal<string>('GrdPrd0015');
  idTabla = signal<string>('215');
  permiso = signal<string>('w');
  newRow: boolean = false;
  listaOperaciones = signal<any[]>([]);
  listaTiposOperacionXempresa = signal<any[]>([]);
  campoId: 'idUnidadEstrategica' = 'idUnidadEstrategica';
  nuevaFila: UnidadEstrategica = {
    idUnidadEstrategica: 0,
    idOperacion: 0,
    idTipoOperacionXEmpresa: 0,
    descripcionUnidadEstrategica: '',
    principalUnidadEstrategica: 'N',
    idUsuarioCrea: '',
    fechaCrea: '',
    idUsuarioModifica: '',
    fechaModifica: '',
  };

  //INJECTIONS PÚBLICAS
  funciones = inject(FuntionsService);
  //INJECTIONS PRIVADAS
  private confirmationService = inject(ConfirmationService);
  private productosService = inject(ProductosService);
  private toastService = inject(ToastService);
  //VARIABLES PARA EL MANEJO DE LOS MENSAJES
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  barraMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msg' + this.idObjeto()),
  );
  //Declaración de variables
  selectedRows!: UnidadEstrategica[];
  metaKey: boolean = true;
  filas = signal<FilaTabla<UnidadEstrategica>[]>([]);
  opcion = signal<Combo[]>([
    { codigo: 'S', etiqueta: 'Si' },
    { codigo: 'N', etiqueta: 'No' },
  ]);

  /******************************************************************************************
   * MÉTODOS QUE EJECUTAN LOS PROCESOS
   *******************************************************************************************/

  ngOnInit(): void {
    this.cargaDatos();
    this.cargarCatalogoOperaciones();
    this.cargarTipoOperaciones();
  }

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


  //MÉTODO QUE GRABA EL TIPO DE TELÉFONO (FILA COMPLETA)
  saveRow(fila: UnidadEstrategica): void {
    this.productosService.grabaUnidadEstrategica(fila, this.newRow).subscribe({
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


  // Método para el catálogo de operaciones
  cargarCatalogoOperaciones() {
    this.productosService.listaOperaciones().subscribe({
      next: (resp) => {
        // Asignamos el catálogo al Signal que lee el p-select y el modo lectura
        this.listaOperaciones.set(resp.data);
      },
      error: (err) => {
        console.error('Error al cargar catálogo de operaciones', err);
      }
    });
  }

    cargarTipoOperaciones() {
    this.productosService.listaTiposOperacionXempresa().subscribe({
      next: (resp) => {
        console.log('Tipos de Operación X Empresa cargados:', resp.data);
        // Asignamos el catálogo al Signal que lee el p-select y el modo lectura
        this.listaTiposOperacionXempresa.set(resp.data);
      },
      error: (err) => {
        console.error('Error al cargar tipo de operaciones', err);
      }
    });
  }

  //MÉTODO QUE CARGA TODAS LAS IDENTIFICACIONES EN EL GRID
  cargaDatos(): void {
    this.filas.set([]);
    this.productosService.listaUnidadEstrategica().subscribe({
      next: (resp) => {
        //Coloca las filas en la estructura
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
          'Hubo un error al cargar los datos.',
        );
      },
    });
  }

  //MÉTODO QUE ELIMINA UNA FILA DEL GRID
  eliminarFila(rowData: UnidadEstrategica): void {
    if (rowData[this.campoId] === 0) {
      this.filas.set(this.filas().filter((item) => item[this.campoId] != rowData[this.campoId]));
    } else {
      this.confirmationService.confirm({
        message: '¿Desea eliminar la fila?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.productosService.eliminaUnidadEstrategica(rowData[this.campoId]!).subscribe({
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
            this.productosService.eliminaUnidadEstrategica(idFila!).subscribe({
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

  //MÉTODO QUE MUESTRA LA AUDITORÍA DEL REGISTRO SELECCIONADO
  muestraAuditoriaRegistro(): void {
    const selected = this.selectedRows || [];
    if (selected.length === 1) {
      this.funciones.muestraAuditoria(selected[0][this.campoId], this.idTabla(), selected[0]);
    } else {
      this.toastService.showMessage(
        'error',
        'Error',
        'Seleccione un registro para ver la auditoría',
      );
    }
  }




}
