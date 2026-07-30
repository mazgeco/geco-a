import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { Combo, Identificaciones } from '../../../../interfaces/personas.interfaces';
import { FuntionsService } from '../../../../services/functions.service';
import { PersonasService } from '../../../../services/personas.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { MessageService } from '../../../../services/message.service'
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-grd-per0010',
  imports: [...PRIMENG_MODULES, NgClass, DatePipe],
  templateUrl: './grd-per0010.html',
  styleUrl: './grd-per0010.css',
})
export class GrdPer0010 implements OnInit {

  //LLAMADA AL idPersona
  @Input()
  idPersona!: number;

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>("WinPer0018");
  idObjeto = signal<string>("GrdPer0010");
  idTabla = signal<string>("185");
  permiso = signal<string>("w");

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
    this.messageService.obtener(this.statusMessages, 'msgGrdPer0010')
  );
  //Declaración de variables
  selectedRows!: Identificaciones[];
  metaKey: boolean = true;
  identificaciones = signal<Identificaciones[]>([]);
  tiposIdentificacion = signal<Combo[]>([
    { codigo: "C", etiqueta: "Cédula" },
    { codigo: "R", etiqueta: "RUC" },
    { codigo: "P", etiqueta: "Pasaporte" },
  ]);


  ngOnInit(): void {
    //CARGA LAS IDENTIFICACIONES DE LA PERSONA CONSULTADA
    this.cargaIdentificaciones();
  }

  //INSERTA UNA FILA en el grid
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
      fechaModifica: ''
    };

    let mensaje = this.funciones.insertRow(
      this.identificaciones,
      nueva,
      'idIdentificacion',
      this.idPersona !== 0,
      'btnGrdPer001050'
    );
    if (mensaje !== '') {
      this.toastService.showMessage("error", "Error", mensaje);
    }
  }

  saveIdentificacion(identificacion: Identificaciones): void {

    if (identificacion.principalIdentificacion === "S" && (this.identificaciones().filter(item => item.principalIdentificacion === "S").length === 2)) {
      this.toastService.showMessage("error", "Error", "No puede colocar otra identificación como principal si ya existe una");
      identificacion.principalIdentificacion = "N";
    }

    this.personasService.grabaIdentificacion(identificacion).subscribe({
      next: (resp) => {
        identificacion.idIdentificacion = resp.idSecuencial;
        this.cargaIdentificaciones();
      },
      error: (err) => {
        this.toastService.showMessage("error", "Error", "Ha ocurrido un error: " + err.error.message, err.error.status);
      }
    });
  }
  //READ
  cargaIdentificaciones(): void {
    this.identificaciones.set([]);
    this.personasService.listaIdentificaciones(this.idPersona).subscribe({
      next: (resp) => {
        this.identificaciones.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage("error", "Error", "Ha ocurrido un error al cargar las identificaciones de la persona: " + err.error.message, err.error.status);
      }
    });
  }
  //DELETE
  eliminarIdentificacion(rowData: Identificaciones): void {
    if (rowData.idIdentificacion === 0) {
      this.identificaciones.set(this.identificaciones().filter(item => item.idIdentificacion != rowData.idIdentificacion));
    } else {
      this.confirmationService.confirm({
        message: '¿Desea eliminar la identificación?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.personasService.eliminaIdentificacion(rowData.idIdentificacion!).subscribe({
            next: (resp) => {
              this.identificaciones.set(this.identificaciones().filter(item => item.idIdentificacion != resp.idSecuencial));
            },
            error: (err) => {
              this.toastService.showMessage("error", "Error", "Ha ocurrido un error: " + err.error.message, err.error.status);
            }
          });
        }
      });
    }
  }

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
                this.identificaciones.set(this.identificaciones().filter(item => item.idIdentificacion != resp.idSecuencial));
              },
              error: (err) => {
                this.toastService.showMessage("error", "Error", "Ha ocurrido un error: " + err.error.message, err.error.status);
              }
            });
          }
        }
      });
    } else {
      this.toastService.showMessage("error", "Error", "Seleccione varias filas");
    }
  }

  //Función que muestra la auditoría del registro seleccionado
  muestraAuditoriaRegistro(): void {
    const selected = this.selectedRows || [];
    if (selected.length === 1) {
      this.funciones.muestraAuditoria(selected[0].idIdentificacion, "185", selected[0])
    } else {
      this.toastService.showMessage("error", "Error", "Seleccione un registro para ver la auditoría");
    }
  }

}
