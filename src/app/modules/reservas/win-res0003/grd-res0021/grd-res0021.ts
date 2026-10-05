import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { FuntionsService } from '../../../../services/functions.service';
import { ReservasService } from '../../../../services/reservas.service';
import { ToastService } from '../../../../services/toast.service';
import { MessageService } from '../../../../services/message.service';
import { FilaTabla, StatusMessage } from '../../../../interfaces/general.interface';
import { DetalleReserva } from '../../../../interfaces/reservas.interfaces';

@Component({
  selector: 'app-grd-res0021',
  imports: [...PRIMENG_MODULES],
  providers: [ConfirmationService],
  templateUrl: './grd-res0021.html'
})
export class GrdRes0021 implements OnInit {
  //LLAMADA AL ID Master
  @Input()
  idReserva!: number;
  
  /******************************************************************************************
   * DECLARACIÓN DE VARIABLES
   *******************************************************************************************/

  //DEFINICIONES PRINCIPALES PROPIAS DEL OBJETO
  idContenedor = signal<string>('WinRes0003');
  idObjeto = signal<string>('GrdRes0021');
  idTabla = signal<string>('449');
  permiso = signal<string>('w');
  newRow: boolean = false;
  campoId: 'idDetalleReserva' = 'idDetalleReserva';
  nuevaFila: DetalleReserva = {
    idDetalleReserva: 0,
    idUsuarioCrea: '',
    fechaCrea: '',
    idUsuarioModifica: '',
    fechaModifica: '',
  };

  //INJECTIONS PÚBLICAS
  funciones = inject(FuntionsService);
  //INJECTIONS PRIVADAS
  private confirmationService = inject(ConfirmationService);
  private reservasService = inject(ReservasService);
  private toastService = inject(ToastService);
  //VARIABLES PARA EL MANEJO DE LOS MENSAJES
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  barraMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msg' + this.idObjeto()),
  );
  //Declaración de variables
  selectedRows!: DetalleReserva[];
  metaKey: boolean = true;
  filas = signal<FilaTabla<DetalleReserva>[]>([]);

  /******************************************************************************************
   * MÉTODOS QUE EJECUTAN LOS PROCESOS
   *******************************************************************************************/

  ngOnInit(): void {
    this.cargaDatos(this.idReserva);
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
  saveRow(fila: DetalleReserva): void {
    this.reservasService.grabaDetalleReserva(fila, this.newRow).subscribe({
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
        this.cargaDatos(this.idReserva);
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
  cargaDatos(idReserva: number): void {
    this.filas.set([]);
    this.reservasService.listaDetalleReserva(idReserva).subscribe({
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
  eliminarFila(rowData: DetalleReserva): void {
    if (rowData[this.campoId] === 0) {
      this.filas.set(this.filas().filter((item) => item[this.campoId] != rowData[this.campoId]));
    } else {
      this.confirmationService.confirm({
        message: '¿Desea eliminar la fila?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.reservasService.eliminaDetalleReserva(rowData[this.campoId]!).subscribe({
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
  eliminarVarias(): void {
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
            this.reservasService.eliminaDetalleReserva(idFila!).subscribe({
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
