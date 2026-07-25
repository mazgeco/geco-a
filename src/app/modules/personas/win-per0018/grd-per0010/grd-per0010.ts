import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { Combo, Identificaciones } from '../../../../interfaces/personas.interfaces';
import { FuntionsService } from '../../../../services/functions.service';
import { PersonasService } from '../../../../services/personas.service';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '../../../../shared/toast.service';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-grd-per0010',
  imports: [...PRIMENG_MODULES, DatePipe, NgClass],
  templateUrl: './grd-per0010.html',
  styleUrl: './grd-per0010.css',
})
export class GrdPer0010 implements OnInit {

  @Input()
  idPersona!: number;

  private confirmationService = inject(ConfirmationService);
  private funciones = inject(FuntionsService);
  private personasService = inject(PersonasService);
  private toastService = inject(ToastService);


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

  obtenerEtiqueta(codigo: string, tipo: string): string {
    let retorno = "";
    switch (tipo) {
      case "TID":
        {
          retorno = this.tiposIdentificacion()
            .find(item => item.codigo === codigo)?.etiqueta ?? '';
          break;
        }
    }

    return retorno;
  }

  //INSERTA UNA FILA en el grid
  insertarIdentificacion(): void {
    const nueva: Identificaciones = {
      idIdentificacion: 0, // Id temporal nulo para crear espera que sea null
      idPersona: this.idPersona,
      idTipoIdentificacion: '',
      descripcionIdentificacion: '',
      fechaCaducidad: null,
      principalIdentificacion: 'N'
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

}
