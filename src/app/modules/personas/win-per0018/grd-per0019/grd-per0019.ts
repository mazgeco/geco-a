import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { Telefonos, TipoTelefonos } from '../../../../interfaces/personas.interfaces';
import { FuntionsService } from '../../../../services/functions.service';
import { PersonasService } from '../../../../services/personas.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { MessageService } from '../../../../services/message.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-grd-per0019',
  imports: [...PRIMENG_MODULES, NgClass],
  templateUrl: './grd-per0019.html',
  styleUrl: './grd-per0019.css',
})
export class GrdPer0019 implements OnInit {
  //LLAMADA AL ID Master
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
  telefonoMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgGrdPer0019'),
  );
  //Declaración de variables
  selectedRows!: Telefonos[];
  metaKey: boolean = true;
  telefonos = signal<Telefonos[]>([]);
  tipoTelefonos = signal<TipoTelefonos[]>([]);

  //FUNCIÓN QUE SE DISPARA EN EL EVENTO INIT DEL OBJETO
  ngOnInit(): void {
    this.cartaTipoTelefonos();
    this.cargaTelefonos();
  }

  //INSERTA UNA FILA en el grid
  insertarTelefono(): void {
    const nueva: Telefonos = {
      idTelefono: 0, // Id temporal nulo para crear espera que sea null
      idPersona: this.idPersona,
      idTipoTelefono: '',
      descripcionTelefono: '',
      principalTelefono: 'N',
      idUsuarioCrea: '',
      fechaCrea: '',
      idUsuarioModifica: '',
      fechaModifica: '',
    };

    let mensaje = this.funciones.insertRow(
      this.telefonos,
      nueva,
      'idTelefono',
      this.idPersona !== 0,
      'btnGrdPer001950',
    );
    if (mensaje !== '') {
      this.toastService.showMessage('error', 'Error', mensaje);
    }
  }

  //READ TIPOS
  cartaTipoTelefonos(): void {
    this.personasService.listaTiposTelefonos().subscribe({
      next: (resp) => {
        this.tipoTelefonos.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage(
          'error',
          'Error',
          'Ha ocurrido un error al cargar los tipos de teléfonos: ' + err.error.message,
          err.error.status,
        );
      },
    });
  }

  //CREATE/UPDATE
  saveTelefono(telefono: Telefonos): void {
    if (
      telefono.principalTelefono === 'S' &&
      this.telefonos().filter((item) => item.principalTelefono === 'S').length === 2
    ) {
      this.toastService.showMessage(
        'error',
        'Error',
        'No puede colocar otro teléfono como principal si ya existe uno',
      );
      telefono.principalTelefono = 'N';
    }

    this.personasService.grabaTelefono(telefono).subscribe({
      next: (resp) => {
        telefono.idTelefono = resp.idSecuencial!;
        this.cargaTelefonos();
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
  cargaTelefonos(): void {
    this.telefonos.set([]);
    this.personasService.listaTelefonos(this.idPersona).subscribe({
      next: (resp) => {
        this.telefonos.set(resp.data);
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
  eliminarTelefono(rowData: Telefonos): void {
    if (rowData.idTelefono === 0) {
      this.telefonos.set(this.telefonos().filter((item) => item.idTelefono != rowData.idTelefono));
    } else {
      this.confirmationService.confirm({
        message: '¿Desea eliminar el telefono?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.personasService.eliminaTelefono(rowData.idTelefono!).subscribe({
            next: (resp) => {
              this.telefonos.set(
                this.telefonos().filter((item) => item.idTelefono != resp.idSecuencial),
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
        message: '¿Desea eliminar todas los teléfonos seleccionados?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          for (let i = 0; i < selected.length; i++) {
            let idTelefono = selected[i].idTelefono;
            this.personasService.eliminaTelefono(idTelefono!).subscribe({
              next: (resp) => {
                this.telefonos.set(
                  this.telefonos().filter((item) => item.idTelefono != resp.idSecuencial),
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
      this.funciones.muestraAuditoria(selected[0].idTelefono, this.idTabla(), selected[0]);
    } else {
      this.toastService.showMessage(
        'error',
        'Error',
        'Seleccione un registro para ver la auditoría',
      );
    }
  }
}
