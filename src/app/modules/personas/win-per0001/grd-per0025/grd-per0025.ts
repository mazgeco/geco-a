import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { NgClass } from '@angular/common';

import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { FuntionsService } from '../../../../services/functions.service';
import { PersonasService } from '../../../../services/personas.service';
import { ToastService } from '../../../../services/toast.service';
import { MessageService } from '../../../../services/message.service';
import {
  FilaTabla,
  StatusMessage,
} from '../../../../interfaces/general.interface';
import { TipoTelefonos } from '../../../../interfaces/personas.interfaces';

@Component({
  selector: 'app-grd-per0025',
  imports: [...PRIMENG_MODULES, NgClass],
  providers: [ConfirmationService],
  templateUrl: './grd-per0025.html'
})
export class GrdPer0025 implements OnInit {
  /******************************************************************************************
   * DECLARACIÓN DE VARIABLES
   *******************************************************************************************/

  //DEFINICIONES PRINCIPALES PROPIAS DEL OBJETO
  idContenedor = signal<string>('WinPer0001');
  idObjeto = signal<string>('GrdPer0025');
  idTabla = signal<string>('326');
  permiso = signal<string>('w');
  newRow: boolean = false;
  campoId: keyof TipoTelefonos = 'idTipoTelefono';
  nuevaFila: TipoTelefonos = {
      idTipoTelefono: '',
      descripcionTipoTelefono: '',
      principalTipoTelefono: 'N',
      idUsuarioCrea: '',
      fechaCrea: '',
      idUsuarioModifica: '',
      fechaModifica: '',
    };

  //INJECTIONS PÚBLICAS
  funciones = inject(FuntionsService);
  //INJECTIONS PRIVADAS
  private confirmationService = inject(ConfirmationService);
  private personasService = inject(PersonasService);
  private toastService = inject(ToastService);
  //VARIABLES PARA EL MANEJO DE LOS MENSAJES
  msgName: string = 'msg' + this.idObjeto;
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  barraMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, this.msgName),
  );
  //Declaración de variables
  selectedRows!: TipoTelefonos[];
  metaKey: boolean = true;
  filas = signal<FilaTabla<TipoTelefonos>[]>([]);

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
  saveRow(fila: TipoTelefonos): void {
    if (
      fila.principalTipoTelefono === 'S' &&
      this.filas().filter((item) => item.principalTipoTelefono === 'S').length === 2
    ) {
      this.toastService.showMessage(
        'error',
        'Error',
        'No puede colocar otro dato como principal si ya existe uno',
      );
      fila.principalTipoTelefono = 'N';
    }

    this.personasService.grabaTipoTelefono(fila, this.newRow).subscribe({
      next: (resp) => {
        fila[this.campoId] = resp.idNoSecuencial!;
        //Envía un mensaje de grabación exitosa
        this.messageService.mostrar(
          this.statusMessages,
          this.msgName,
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
    this.personasService.listaTiposTelefonos().subscribe({
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
          this.msgName,
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
          this.msgName,
          'error',
          'Hubo un error al cargar los datos.',
        );
      },
    });
  }

  //MÉTODO QUE ELIMINA UNA FILA DEL GRID
  eliminarFila(rowData: TipoTelefonos): void {
    if (rowData[this.campoId] === '0') {
      this.filas.set(this.filas().filter((item) => item[this.campoId] != rowData[this.campoId]));
    } else {
      this.confirmationService.confirm({
        message: '¿Desea eliminar la fila?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.personasService.eliminaTipoTelefono(rowData[this.campoId]!).subscribe({
            next: (resp) => {
              this.filas.set(
                this.filas().filter((item) => item[this.campoId] != resp.idNoSecuencial),
              );
              //Envía un mensaje
              this.messageService.mostrar(
                this.statusMessages,
                this.msgName,
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
                this.msgName,
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
            this.personasService.eliminaTipoTelefono(idFila!).subscribe({
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
                  this.msgName,
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
            this.msgName,
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
