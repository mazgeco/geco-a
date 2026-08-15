import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { FichasMedicas, TipoFichasMedicas } from '../../../../interfaces/personas.interfaces';
import { FuntionsService } from '../../../../services/functions.service';
import { PersonasService } from '../../../../services/personas.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { MessageService } from '../../../../services/message.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-grd-per0008',
  imports: [...PRIMENG_MODULES],
  templateUrl: './grd-per0008.html',
  styleUrl: './grd-per0008.css',
})
export class GrdPer0008 implements OnInit {
  //LLAMADA AL idPersona
  @Input()
  idPersona!: number;

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>('WinPer0018');
  idObjeto = signal<string>('GrdPer0008');
  idTabla = signal<string>('183');
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
    this.messageService.obtener(this.statusMessages, 'msgGrdPer0002'),
  );

  //Declaración de variables
  selectedRows!: FichasMedicas[];
  metaKey: boolean = true;
  fila = signal<FichasMedicas[]>([]);
  tipos = signal<TipoFichasMedicas[]>([]);

  ngOnInit(): void {
    this.cargaTipos();
    this.cargaDatos();
  }

  //INSERTA UNA FILA en el grid
  insertarFila(): void {
    const nueva: FichasMedicas = {
      idFichaMedica: 0,
      idPersona: this.idPersona,
      idTipoFichaMedica: '',
      descripcionFichaMedica: '',
      idUsuarioCrea: '',
      fechaCrea: '',
      idUsuarioModifica: '',
      fechaModifica: '',
    };

    let mensaje = this.funciones.insertRow(
      this.fila,
      nueva,
      'idFichaMedica',
      this.idPersona !== 0,
      'btnGrdPer00080',
    );
    if (mensaje !== '') {
      this.toastService.showMessage('error', 'Error', mensaje);
    }
  }

  //READ TIPOS
  cargaTipos(): void {
    this.personasService.listaTiposFichasMedicas().subscribe({
      next: (resp) => {
        this.tipos.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage(
          'error',
          'Error',
          'Ha ocurrido un error al cargar los tipos de fichas médicas: ' + err.error.message,
          err.error.status,
        );
      }
    });
  }

  //CREATE/UPDATE
  saveData(fila: FichasMedicas): void {
    this.personasService.grabaFichaMedica(fila).subscribe({
      next: (resp) => {
        fila.idFichaMedica = resp.idSecuencial!;
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

  //READ
  cargaDatos(): void {
    this.fila.set([]);
    if (this.idPersona !== 0) {
      this.personasService.listaFichasMedicas(this.idPersona).subscribe({
        next: (resp) => {
          this.fila.set(resp.data);
        },
        error: (err) => {
          this.toastService.showMessage(
            'error',
            'Error',
            'Ha ocurrido un error al cargar las telefonos de la persona: ' + err.error.message,
            err.error.status,
          );
        },
      });
    }
  }

  //DELETE
  eliminarFila(rowData: FichasMedicas): void {
    if (rowData.idFichaMedica === 0) {
      this.fila.set(this.fila().filter((item) => item.idFichaMedica != rowData.idFichaMedica));
    } else {
      this.confirmationService.confirm({
        message: '¿Desea eliminar esta ficha médica?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.personasService.eliminaCaracteristica(rowData.idFichaMedica!).subscribe({
            next: (resp) => {
              this.fila.set(this.fila().filter((item) => item.idFichaMedica != resp.idSecuencial));
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
        },
      });
    }
  }

  //DELETE varias
  eliminarVarias(): void {
    const selected = this.selectedRows;
    if (selected.length > 0) {
      this.confirmationService.confirm({
        message: '¿Desea eliminar todas las fichas seleccionadas?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          for (let i = 0; i < selected.length; i++) {
            let idFichaMedica = selected[i].idFichaMedica;
            this.personasService.eliminaFichaMedica(idFichaMedica!).subscribe({
              next: (resp) => {
                this.fila.set(
                  this.fila().filter((item) => item.idFichaMedica != resp.idSecuencial),
                );
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
        },
      });
    } else {
      this.toastService.showMessage('error', 'Error', 'Seleccione varias filas');
    }
  }

  //AUDITORÍA DEL REGISTRO
  muestraAuditoriaRegistro(): void {
    const selected = this.selectedRows || [];
    if (selected.length === 1) {
      this.funciones.muestraAuditoria(selected[0].idFichaMedica, this.idTabla(), selected[0]);
    } else {
      this.toastService.showMessage(
        'error',
        'Error',
        'Seleccione un registro para ver la auditoría',
      );
    }
  }
}
