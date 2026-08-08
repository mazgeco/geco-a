import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';

import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { FuntionsService } from '../../../../services/functions.service';
import { PersonasService } from '../../../../services/personas.service';
import { ToastService } from '../../../../services/toast.service';
import { MessageService } from '../../../../services/message.service';
import { Combo, StatusMessage } from '../../../../interfaces/general.interface';
import { TipoTelefonos } from '../../../../interfaces/personas.interfaces';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-grd-per0025',
  imports: [...PRIMENG_MODULES, NgClass],
  providers: [ConfirmationService],
  templateUrl: './grd-per0025.html',
  styleUrl: './grd-per0025.css',
})
export class GrdPer0025 implements OnInit {
  /******************************************************************************************
   * DECLARACIÓN DE VARIABLES
   *******************************************************************************************/

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>('WinPer0018');
  idObjeto = signal<string>('GrdPer0010');
  idTabla = signal<string>('185');
  permiso = signal<string>('w');

  //INJECTIONS PÚBLICAS
  funciones = inject(FuntionsService);
  //INJECTIONS PRIVADAS
  private confirmationService = inject(ConfirmationService);
  private personasService = inject(PersonasService);
  private toastService = inject(ToastService);
  //VARIABLES PARA EL MANEJO DE LOS MENSAJES
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  barraMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgGrdPer0025'),
  );
  //Declaración de variables
  selectedRows!: TipoTelefonos[];
  metaKey: boolean = true;
  filas = signal<TipoTelefonos[]>([]);
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
    const nueva: TipoTelefonos = {
      idTipoTelefono: '',
      descripcionTipoTelefono: '',
      principalTipoTelefono: 'N',
      idUsuarioCrea: '',
      fechaCrea: '',
      idUsuarioModifica: '',
      fechaModifica: '',
    };

    let mensaje = this.funciones.insertRow(
      this.filas,
      nueva,
      'idTipoTelefono',
      true,
      'btnGrdPer00255',
    );
    if (mensaje !== '') {
      this.toastService.showMessage('error', 'Error', mensaje);
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

    this.personasService.grabaTipoTelefono(fila).subscribe({
      next: (resp) => {
        fila.idTipoTelefono = resp.idNoSecuencial!;
        //Envía un mensaje de grabación exitosa
        this.messageService.mostrar(
          this.statusMessages,
          'msgGrdPer0025',
          'success',
          'Fila grabada correctamente.',
        );
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
        this.filas.set(resp.data);
        //Envía un mensaje de carga exitosa
        this.messageService.mostrar(
          this.statusMessages,
          'msgGrdPer0025',
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
          'msgGrdPer0010',
          'error',
          'Hubo un error al cargar los datos.',
        );
      },
    });
  }

  //MÉTODO QUE ELIMINA UNA FILA DEL GRID
  eliminarFila(rowData: TipoTelefonos): void {
    if (rowData.idTipoTelefono === '') {
      this.filas.set(
        this.filas().filter((item) => item.idTipoTelefono != rowData.idTipoTelefono),
      );
    } else {
      this.confirmationService.confirm({
        message: '¿Desea eliminar la fila?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.personasService.eliminaTipoTelefono(rowData.idTipoTelefono!).subscribe({
            next: (resp) => {
              this.filas.set(
                this.filas().filter(
                  (item) => item.idTipoTelefono != resp.idNoSecuencial,
                ),
              );
              //Envía un mensaje de carga exitosa
              this.messageService.mostrar(
                this.statusMessages,
                'msgGrdPer0010',
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
                'msgGrdPer0025',
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
  eliminarVariasFilas(): void {}

  //MÉTODO QUE MUESTRA LA AUDITORÍA DEL REGISTRO SELECCIONADO
  muestraAuditoriaRegistro(): void {
    const selected = this.selectedRows || [];
    if (selected.length === 1) {
      this.funciones.muestraAuditoria(selected[0].idTipoTelefono, this.idTabla(), selected[0]);
    } else {
      this.toastService.showMessage(
        'error',
        'Error',
        'Seleccione un registro para ver la auditoría',
      );
    }
  }
}
