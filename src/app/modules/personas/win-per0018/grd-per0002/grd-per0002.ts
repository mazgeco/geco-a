import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import {
  Caracteristicas,
  Telefonos,
  TipoCaracteristicas,
  TipoTelefonos,
} from '../../../../interfaces/personas.interfaces';
import { FuntionsService } from '../../../../services/functions.service';
import { PersonasService } from '../../../../services/personas.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { MessageService } from '../../../../services/message.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-grd-per0002',
  imports: [...PRIMENG_MODULES],
  templateUrl: './grd-per0002.html',
  styleUrl: './grd-per0002.css',
})
export class GrdPer0002 implements OnInit {
  //LLAMADA AL idPersona
  @Input()
  idPersona!: number;

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>('WinPer0018');
  idObjeto = signal<string>('GrdPer0019');
  idTabla = signal<string>('194');
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
  caracteristicaMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgGrdPer0002'),
  );

  //Declaración de variables
  selectedRows!: Caracteristicas[];
  metaKey: boolean = true;
  caracteristicas = signal<Caracteristicas[]>([]);
  tipoCaracteristicas = signal<TipoCaracteristicas[]>([]);

  ngOnInit(): void {
    this.cargaTipoCaracteristicas();
    this.cargaCaracteristicas();
  }

  //INSERTA UNA FILA en el grid
  insertarCaracteristica(): void {
    const nueva: Caracteristicas = {
      idCaracteristica: 0, // Id temporal nulo para crear espera que sea null
      idPersona: this.idPersona,
      idTipoCaracteristica: 0,
      descripcionCaracteristica: '',
      idUsuarioCrea: '',
      fechaCrea: '',
      idUsuarioModifica: '',
      fechaModifica: '',
    };

    let mensaje = this.funciones.insertRow(
      this.caracteristicas,
      nueva,
      'idCaracteristica',
      this.idPersona !== 0,
      'btnGrdPer000250',
    );
    if (mensaje !== '') {
      this.toastService.showMessage('error', 'Error', mensaje);
    }
  }

  //READ TIPOS
  cargaTipoCaracteristicas(): void {
    this.personasService.listaTiposCaracteristicas().subscribe({
      next: (resp) => {
        this.tipoCaracteristicas.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage(
          'error',
          'Error',
          'Ha ocurrido un error al cargar los tipos de características: ' + err.error.message,
          err.error.status,
        );
      },
    });
  }

  //CREATE/UPDATE
  saveCaracteristica(caracteristica: Caracteristicas): void {
    this.personasService.grabaCaracteritica(caracteristica).subscribe({
      next: (resp) => {
        caracteristica.idCaracteristica = resp.idSecuencial!;
        this.cargaCaracteristicas();
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
  cargaCaracteristicas(): void {
    this.caracteristicas.set([]);
    this.personasService.listaCaracteristicas(this.idPersona).subscribe({
      next: (resp) => {
        this.caracteristicas.set(resp.data);
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

  //DELETE
  eliminarCaracteristica(rowData: Caracteristicas): void {
    if (rowData.idCaracteristica === 0) {
      this.caracteristicas.set(
        this.caracteristicas().filter((item) => item.idCaracteristica != rowData.idCaracteristica),
      );
    } else {
      this.confirmationService.confirm({
        message: '¿Desea eliminar esta característica?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.personasService.eliminaCaracteristica(rowData.idCaracteristica!).subscribe({
            next: (resp) => {
              this.caracteristicas.set(
                this.caracteristicas().filter((item) => item.idCaracteristica != resp.idSecuencial),
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
        },
      });
    }
  }

  //DELETE varias
  eliminarVarias(): void {
    const selected = this.selectedRows;
    if (selected.length > 0) {
      this.confirmationService.confirm({
        message: '¿Desea eliminar todas las características seleccionados?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          for (let i = 0; i < selected.length; i++) {
            let idCaracteristica = selected[i].idCaracteristica;
            this.personasService.eliminaCaracteristica(idCaracteristica!).subscribe({
              next: (resp) => {
                this.caracteristicas.set(
                  this.caracteristicas().filter(
                    (item) => item.idCaracteristica != resp.idSecuencial,
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
      this.funciones.muestraAuditoria(selected[0].idCaracteristica, this.idTabla(), selected[0]);
    } else {
      this.toastService.showMessage(
        'error',
        'Error',
        'Seleccione un registro para ver la auditoría',
      );
    }
  }
}
