import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { NgClass } from '@angular/common';

import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { FuntionsService } from '../../../../services/functions.service';
import { ProductosService } from '../../../../services/productos.service';
import { ToastService } from '../../../../services/toast.service';
import { MessageService } from '../../../../services/message.service';
import { Temporadas } from '../../../../interfaces/productos.interfaces';
import {
  Combo,
  FilaTabla,
  StatusMessage,
} from '../../../../interfaces/general.interface';

@Component({
  selector: 'app-grd-prd0012',
  imports: [...PRIMENG_MODULES, NgClass],
    providers: [ConfirmationService],
  templateUrl: './grd-prd0012.html',
  styles: ``,
})
export class GrdPrd0012 implements OnInit {

/******************************************************************************************
   * DECLARACIÓN DE VARIABLES
   *******************************************************************************************/

  //DEFINICIONES PRINCIPALES PROPIAS DEL OBJETO
  idContenedor = signal<string>('WinPrd0002');
  idObjeto = signal<string>('GrdPrd0012');
  idTabla = signal<string>('212');
  permiso = signal<string>('w');
  newRow: boolean = false;
  campoId: 'idTemporada' = 'idTemporada';
  nuevaFila: Temporadas = {
    idTemporada: 0,
    descripcionTemporada: '',
    fechaInicioTemporada: '',
    fechaFinTemporada: '',
    principalTemporada: 'N',
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
  selectedRows!: Temporadas[];
  metaKey: boolean = true;
  filas = signal<FilaTabla<Temporadas>[]>([]);
  opcion = signal<Combo[]>([
    { codigo: 'S', etiqueta: 'Si' },
    { codigo: 'N', etiqueta: 'No' },
  ]);

  /******************************************************************************************
   * MÉTODOS QUE EJECUTAN LOS PROCESOS
   *******************************************************************************************/

  ngOnInit(): void {
    this.cargaDatos();
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
  saveRow(fila: Temporadas): void {
  
    this.productosService.grabaTemporada(fila, this.newRow).subscribe({
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

  //MÉTODO QUE CARGA TODAS LAS IDENTIFICACIONES EN EL GRID
  cargaDatos(): void {
    this.filas.set([]);
    this.productosService.listaTemporadas().subscribe({
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
  eliminarFila(rowData: Temporadas): void {
    if (rowData[this.campoId] === 0) {
      this.filas.set(this.filas().filter((item) => item[this.campoId] != rowData[this.campoId]));
    } else {
      this.confirmationService.confirm({
        message: '¿Desea eliminar la fila?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.productosService.eliminaTemporada(rowData[this.campoId]!).subscribe({
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
            this.productosService.eliminaTemporada(idFila!).subscribe({
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
