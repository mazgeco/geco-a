import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { Combo } from '../../../../interfaces/general.interface';
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
  styleUrl: './grd-per0010.css',
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
  identificacionMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgGrdPer0010'),
  );
  //Declaración de variables
  selectedRows!: Identificaciones[];
  metaKey: boolean = true;
  identificaciones = signal<Identificaciones[]>([]);
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
    this.cargaIdentificaciones();
  }

  //MÉTODO QUE INSERTA UNA FILA EN EL GRID
  insertarIdentificacion(): void {
    const nueva: Identificaciones = {
      idIdentificacion: 0, // Id temporal nulo para crear espera que sea null
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

    let mensaje = this.funciones.insertRow(
      this.identificaciones,
      nueva,
      'idIdentificacion',
      this.idPersona !== 0,
      'btnGrdPer001060',
    );
    if (mensaje !== '') {
      this.toastService.showMessage('error', 'Error', mensaje);
    }
  }

  //MÉTODO QUE GRABA LA IDENTIFICACIÓN (FILA COMPLETA)
  saveIdentificacion(identificacion: Identificaciones): void {
    if (
      identificacion.principalIdentificacion === 'S' &&
      this.identificaciones().filter((item) => item.principalIdentificacion === 'S').length === 2
    ) {
      this.toastService.showMessage(
        'error',
        'Error',
        'No puede colocar otra identificación como principal si ya existe una',
      );
      identificacion.principalIdentificacion = 'N';
    }

    this.personasService.grabaIdentificacion(identificacion).subscribe({
      next: (resp) => {
        identificacion.idIdentificacion = resp.idSecuencial!;
        //Envía un mensaje de grabación exitosa
        this.messageService.mostrar(
          this.statusMessages,
          'msgGrdPer0010',
          'success',
          'Identificación grabada correctamente.',
        );
        //this.cargaIdentificaciones();
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
  cargaIdentificaciones(): void {
    this.identificaciones.set([]);
    if (this.idPersona !== 0) {
      this.personasService.listaIdentificaciones(this.idPersona).subscribe({
        next: (resp) => {
          //Coloca las identificaciones el la estructura
          this.identificaciones.set(resp.data);
          //Envía un mensaje de carga exitosa
          this.messageService.mostrar(
            this.statusMessages,
            'msgGrdPer0010',
            'success',
            'Identificaciones cargadas correctamente.',
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
            'msgGrdPer0010',
            'error',
            'Hubo un error al cargar las identificaciones.',
          );
        },
      });
    }
  }

  //MÉTODO QUE ELIMINA UNA FILA DEL GRID
  eliminarIdentificacion(rowData: Identificaciones): void {
    if (rowData.idIdentificacion === 0) {
      this.identificaciones.set(
        this.identificaciones().filter((item) => item.idIdentificacion != rowData.idIdentificacion),
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
              this.identificaciones.set(
                this.identificaciones().filter(
                  (item) => item.idIdentificacion != resp.idSecuencial,
                ),
              );
              //Envía un mensaje de carga exitosa
              this.messageService.mostrar(
                this.statusMessages,
                'msgGrdPer0010',
                'success',
                'Identificación eliminada correctamente.',
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
                'msgGrdPer0010',
                'error',
                'Hubo un error al eliminar la identificación.',
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
                this.identificaciones.set(
                  this.identificaciones().filter(
                    (item) => item.idIdentificacion != resp.idSecuencial,
                  ),
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
                  'msgGrdPer0010',
                  'error',
                  'Hubo un error al eliminar una de las identificaciones.',
                );
                return;
              },
            });
          }
          //Envía un mensaje de carga exitosa
          this.messageService.mostrar(
            this.statusMessages,
            'msgGrdPer0010',
            'success',
            'Identificaciones eliminadas correctamente.',
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
