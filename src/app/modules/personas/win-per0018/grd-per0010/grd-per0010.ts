import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { Combo, FilaTabla } from '../../../../interfaces/general.interface';
import { Identificaciones } from '../../../../interfaces/personas.interfaces';
import { FuntionsService } from '../../../../services/functions.service';
import { PersonasService } from '../../../../services/personas.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { MessageService } from '../../../../services/message.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-grd-per0010',
  imports: [...PRIMENG_MODULES, NgClass, DatePipe],
  templateUrl: './grd-per0010.html',
})
export class GrdPer0010 implements OnInit {
  /******************************************************************************************
   * TOMA DEL PARÁMETRO ENVIADO EN LA LLAMADA DEL SELECTOR
   *******************************************************************************************/
  @Input()
  idPersona!: number;

  /******************************************************************************************
   * DECLARACIÓN DE VARIABLES
   *******************************************************************************************/

  //DEFINICIONES PRINCIPALES PROPIAS DEL OBJETO
  idContenedor = signal<string>('WinPer0018');
  idObjeto = signal<string>('GrdPer0010');
  idTabla = signal<string>('185');
  permiso = signal<string>('w');
  newRow: boolean = false;

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
  barraMessage = computed(() => this.messageService.obtener(this.statusMessages, this.msgName));
  //Declaración de variables
  selectedRows!: Identificaciones[];
  metaKey: boolean = true;
  filas = signal<FilaTabla<Identificaciones>[]>([]);
  tiposIdentificacion = signal<Combo[]>([
    { codigo: 'C', etiqueta: 'Cédula' },
    { codigo: 'R', etiqueta: 'RUC' },
    { codigo: 'P', etiqueta: 'Pasaporte' },
  ]);

  /******************************************************************************************
   * MÉTODOS QUE EJECUTAN LOS PROCESOS
   *******************************************************************************************/

  //MÉTODO QUE SE CARGA AL INICIALIZARCE EL OBJETO PRINCIPAL GrdPer0010
  ngOnInit(): void {
    //CARGA LAS IDENTIFICACIONES DE LA PERSONA CONSULTADA
    this.cargaDatos();
  }

  //MÉTODO QUE INSERTA UNA FILA EN EL GRID
  insertarFila(): void {
    const nuevaFila: Identificaciones = {
      idIdentificacion: null,
      idPersona: this.idPersona,
      idTipoIdentificacion: '',
      descripcionIdentificacion: '',
      fechaCaducidad: null,
      principalIdentificacion: 'N',
      idUsuarioCrea: '',
      fechaCrea: '',
      idUsuarioModifica: '',
      fechaModifica: '',
    };

    let mensaje = this.funciones.insertRowA(
      this.filas,
      nuevaFila,
      this.idPersona !== 0,
      'btn' + this.idObjeto() + '60',
    );
    if (mensaje !== '') {
      this.toastService.showMessage('error', 'Error', mensaje);
    } else {
      this.newRow = true;
    }
  }

  //MÉTODO QUE GRABA LA FILA COMPLETA
  saveRow(fila: Identificaciones): void {
    if (
      fila.principalIdentificacion === 'S' &&
      this.filas().filter((item) => item.principalIdentificacion === 'S').length === 2
    ) {
      this.toastService.showMessage(
        'error',
        'Error',
        'No puede colocar otra identificación como principal si ya existe una',
      );
      fila.principalIdentificacion = 'N';
    }

    this.personasService.grabaIdentificacion(fila, this.newRow).subscribe({
      next: (resp) => {
        fila.idIdentificacion = resp.idSecuencial!;
        //Envía un mensaje de grabación exitosa
        this.messageService.mostrar(
          this.statusMessages,
          this.msgName,
          'success',
          'Fila grabada correctamente.',
        );
        this.newRow = false;
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
    if (this.idPersona !== 0) {
      this.personasService.listaIdentificaciones(this.idPersona).subscribe({
        next: (resp) => {
          //Coloca las identificaciones el la estructura
          this.filas.set(resp.data);
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
            'Ha ocurrido un error al cargar las identificaciones de la persona: ' +
              err.error.message,
            err.error.status,
          );
          //Envía un mensaje de carga exitosa
          this.messageService.mostrar(
            this.statusMessages,
            this.msgName,
            'error',
            err.error.message,
          );
        },
      });
    }
  }

  //MÉTODO QUE ELIMINA UNA FILA DEL GRID
  eliminarFila(rowData: Identificaciones): void {
    if (rowData.idIdentificacion === 0) {
      this.filas.set(
        this.filas().filter((item) => item.idIdentificacion != rowData.idIdentificacion),
      );
    } else {
      this.confirmationService.confirm({
        message: '¿Desea eliminar la identificación?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.personasService.eliminaIdentificacion(rowData.idIdentificacion!).subscribe({
            next: (resp) => {
              this.filas.set(
                this.filas().filter((item) => item.idIdentificacion != resp.idSecuencial),
              );
              //Envía un mensaje de carga exitosa
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
                err.error.message,
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
        message: '¿Desea eliminar todas las identificaciónes seleccionadas?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          for (let i = 0; i < selected.length; i++) {
            let idIdentificacion = selected[i].idIdentificacion;
            this.personasService.eliminaIdentificacion(idIdentificacion!).subscribe({
              next: (resp) => {
                this.filas.set(
                  this.filas().filter((item) => item.idIdentificacion != resp.idSecuencial),
                );
                //Envía un mensaje de carga exitosa
                this.messageService.mostrar(
                  this.statusMessages,
                  this.msgName,
                  'success',
                  'Filas eliminadas correctamente.',
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
            'Datos eliminados correctamente.',
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
      this.funciones.muestraAuditoria(selected[0].idIdentificacion, this.idTabla(), selected[0]);
    } else {
      this.toastService.showMessage(
        'error',
        'Error',
        'Seleccione un registro para ver la auditoría',
      );
    }
  }
}
