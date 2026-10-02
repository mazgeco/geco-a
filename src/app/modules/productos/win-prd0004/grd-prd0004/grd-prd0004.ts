import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { NgClass } from '@angular/common';

import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { FuntionsService } from '../../../../services/functions.service';
import { ProductosService } from '../../../../services/productos.service';
import { ToastService } from '../../../../services/toast.service';
import { MessageService } from '../../../../services/message.service';
import { Impuesto } from '../../../../interfaces/productos.interfaces';
import {
  FilaTabla,
  StatusMessage, Combo,
} from '../../../../interfaces/general.interface';

@Component({
  selector: 'app-grd-prd0004',
  imports: [...PRIMENG_MODULES],
  providers: [ConfirmationService],
  templateUrl: './grd-prd0004.html',
  styles: ``,
})
export class GrdPrd0004 implements OnInit {
/******************************************************************************************
   * DECLARACIÓN DE VARIABLES
   *******************************************************************************************/

  //DEFINICIONES PRINCIPALES PROPIAS DEL OBJETO
  idContenedor = signal<string>('WinPrd0004');
  idObjeto = signal<string>('GrdPrd0004');
  idTabla = signal<string>('202');
  permiso = signal<string>('w');
  newRow: boolean = false;
  campoId: 'idImpuesto' = 'idImpuesto';
  nuevaFila: Impuesto = {
    idImpuesto: '',
    descripcionImpuesto: '',
    cantidadImpuesto: 0,
    tipoImpuesto: 'P',
    tipoValor: 'F',
    obligatoriedad: '',
    estadoImpuesto: 'A',
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
  //Declaración de 
  selectedRows!: Impuesto[];
  metaKey: boolean = true;
  filas = signal<FilaTabla<Impuesto>[]>([]);
  opcionesEstado = signal<Combo[]>([
        {
          codigo: 'A',
          etiqueta: 'Activo',
        },
        {
          codigo: 'I',
          etiqueta: 'Inactivo',
        },
      ]);
  
  opcionesTipoImpuesto = signal<Combo[]>([
        {
          codigo: 'V',
          etiqueta: 'Valor',
        },
        {
          codigo: 'P',
          etiqueta: 'Porcentaje',
        },
      ]);
  
  opcionesTipoValor = signal<Combo[]>([
        {
          codigo: 'F',
          etiqueta: 'Fijo',
        },
        {
          codigo: 'R',
          etiqueta: 'Rango',
        },
        {
          codigo: 'V',
          etiqueta: 'Variable',
        },
        
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

  //MÉTODO QUE CARGA EL GRID
  cargaDatos(): void {
    this.filas.set([]);
    this.productosService.cargaImpuestos().subscribe({
      next: (resp) => {
        console.log('Datos de impuestos cargados:', resp.data); // Agrega este log para depuración
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

   // CREATE / UPDATE
  saveRow(fila: Impuesto): void {
    this.productosService.grabaImpuesto(fila, this.newRow).subscribe({
      next: (resp) => {
        console.log('🔴 RESPUESTA DEL BACKEND AL GRABAR IMPUESTO:', resp);
        fila[this.campoId] = resp.idNoSecuencial!;
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

  //MÉTODO QUE ELIMINA UNA FILA DEL GRID
    eliminarFila(rowData: Impuesto): void {
      if (rowData[this.campoId] === '0') {
        this.filas.set(this.filas().filter((item) => item[this.campoId] != rowData[this.campoId]));
      } else {
        this.confirmationService.confirm({
          message: '¿Desea eliminar la fila?',
          header: 'Eliminar',
          acceptLabel: 'Aceptar',
          rejectLabel: 'Cancelar',
          accept: () => {
            this.productosService.eliminaImpuesto(rowData[this.campoId]!).subscribe({
              next: (resp) => {
                this.filas.set(
                  this.filas().filter((item) => item[this.campoId] != resp.idNoSecuencial),
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
            this.productosService.eliminaImpuesto(idFila!).subscribe({
              next: (resp) => {
                this.filas.set(
                  this.filas().filter((item) => item[this.campoId] != resp.idNoSecuencial),
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
      this.funciones.muestraAuditoria(selected[0].idImpuesto, this.idTabla(), selected[0]);
    } else {
      this.toastService.showMessage('error', 'Error', 'Seleccione un registro para ver la auditoría');
    }
  }
   










}
