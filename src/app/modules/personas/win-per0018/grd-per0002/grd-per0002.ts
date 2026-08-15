import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import {
  Caracteristicas,
  TipoCaracteristicas
} from '../../../../interfaces/personas.interfaces';
import { FuntionsService } from '../../../../services/functions.service';
import { PersonasService } from '../../../../services/personas.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { MessageService } from '../../../../services/message.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-grd-per0002',
  imports: [...PRIMENG_MODULES],
  templateUrl: './grd-per0002.html'
})
export class GrdPer0002 implements OnInit {
  //LLAMADA AL idPersona
  @Input()
  idPersona!: number;

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>('WinPer0018');
  idObjeto = signal<string>('GrdPer0002');
  idTabla = signal<string>('179');
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
  selectedRows!: Caracteristicas[];
  metaKey: boolean = true;
  fila = signal<Caracteristicas[]>([]);
  tipos = signal<TipoCaracteristicas[]>([]);

  ngOnInit(): void {
    this.cargaTipos();
    this.cargaDatos();
  }

  //INSERTA UNA FILA en el grid
  insertarFila(): void {
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
      this.fila,
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
  cargaTipos(): void {
    this.personasService.listaTiposCaracteristicas().subscribe({
      next: (resp) => {
        this.tipos.set(resp.data);
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
  saveData(caracteristica: Caracteristicas): void {
    this.personasService.grabaCaracteristica(caracteristica).subscribe({
      next: (resp) => {
        caracteristica.idCaracteristica = resp.idSecuencial!;
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
      this.personasService.listaCaracteristicas(this.idPersona).subscribe({
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
  eliminarFila(rowData: Caracteristicas): void {
    if (rowData.idCaracteristica === 0) {
      this.fila.set(
        this.fila().filter((item) => item.idCaracteristica != rowData.idCaracteristica),
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
              this.fila.set(
                this.fila().filter((item) => item.idCaracteristica != resp.idSecuencial),
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
                this.fila.set(
                  this.fila().filter(
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
