import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { Combo, Direcciones } from '../../../../interfaces/personas.interfaces';
import { FuntionsService } from '../../../../services/functions.service';
import { PersonasService } from '../../../../services/personas.service';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '../../../../shared/toast.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-grd-per0006',
  imports: [...PRIMENG_MODULES, NgClass],
  templateUrl: './grd-per0006.html',
  styleUrl: './grd-per0006.css',
})
export class GrdPer0006 implements OnInit {
  @Input()
  idPersona!: number;

  funciones = inject(FuntionsService);

  private confirmationService = inject(ConfirmationService);
  private personasService = inject(PersonasService);
  private toastService = inject(ToastService);

  selectedRows!: Direcciones[];
  metaKey: boolean = true;


  direcciones = signal<Direcciones[]>([]);
  tiposDireccion = signal<Combo[]>([
    { codigo: "D", etiqueta: "Domicilio" },
    { codigo: "O", etiqueta: "Oficina" }
  ]);


  ngOnInit(): void {
    //CARGA LAS IDENTIFICACIONES DE LA PERSONA CONSULTADA
    this.cargaDirecciones();
  }

  //INSERTA UNA FILA en el grid
  insertarDireccion(): void {
    const nueva: Direcciones = {
      idDireccion: 0, // Id temporal nulo para crear espera que sea null
      idPersona: this.idPersona,
      idTipoDireccion: '',
      sector: '',
      callePrincipal: '',
      nroCasaOEdificio: '',
      codigoNumerico: 0,
      calleSecundaria: '',
      nombreEdificio: '',
      nroDepartamento: '',
      datoAdicional: '',
      principalDireccion: 'N',
      idUsuarioCrea: '',
      fechaCrea: '',
      idUsuarioModifica: '',
      fechaModifica: ''
    };

    let mensaje = this.funciones.insertRow(
      this.direcciones,
      nueva,
      'idDireccion',
      this.idPersona !== 0,
      'btnGrdPer001050'
    );
    if (mensaje !== '') {
      this.toastService.showMessage("error", "Error", mensaje);
    }
  }

  saveDireccion(direccion: Direcciones): void {

    if (direccion.principalDireccion === "S" && (this.direcciones().filter(item => item.principalDireccion === "S").length === 2)) {
      this.toastService.showMessage("error", "Error", "No puede colocar otra identificación como principal si ya existe una");
      direccion.principalDireccion = "N";
    }

    this.personasService.grabaDireccion(direccion).subscribe({
      next: (resp) => {
        direccion.idDireccion = resp.idSecuencial;
        this.cargaDirecciones();
      },
      error: (err) => {
        this.toastService.showMessage("error", "Error", "Ha ocurrido un error: " + err.error.message, err.error.status);
      }
    });
  }
  //READ
  cargaDirecciones(): void {
    this.direcciones.set([]);
    this.personasService.listaDirecciones(this.idPersona).subscribe({
      next: (resp) => {
        let aux = resp.data;
        for(let i=0; i<aux.length; i++){
         aux[i].descripcionDireccion = (aux[i].callePrincipal ?? '') + ' ' + (aux[i].nroCasaOEdificio ?? '') + ' y ' +
                                       (aux[i].calleSecundaria ?? ' ') + ' ';
        }
        this.direcciones.set(aux);
      },
      error: (err) => {
        this.toastService.showMessage("error", "Error", "Ha ocurrido un error al cargar las direcciones de la persona: " + err.error.message, err.error.status);
      }
    });
  }
  //DELETE
  eliminarDireccion(rowData: Direcciones): void {
    if (rowData.idDireccion === 0) {
      this.direcciones.set(this.direcciones().filter(item => item.idDireccion != rowData.idDireccion));
    } else {
      this.confirmationService.confirm({
        message: '¿Desea eliminar la identificación?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.personasService.eliminaDireccion(rowData.idDireccion!).subscribe({
            next: (resp) => {
              this.direcciones.set(this.direcciones().filter(item => item.idDireccion != resp.idSecuencial));
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
            let idDireccion = selected[i].idDireccion;
            this.personasService.eliminaDireccion(idDireccion!).subscribe({
              next: (resp) => {
                this.direcciones.set(this.direcciones().filter(item => item.idDireccion != resp.idSecuencial));
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

  

  //Función que muestra la información del objeto
  muestraInfoObjeto(): void {
    this.toastService.showMessage("info", "Información objeto", "Contenedor: WinPer0018 \n Objeto: GrdPer0006 \n Tabla: 182 \n Permiso: Escritura", 5000);
  }

  //Función que muestra la auditoría del registro seleccionado
  muestraAuditoriaRegistro(): void {
    const selected = this.selectedRows || [];
    if (selected.length === 1) {
      this.funciones.muestraAuditoria(selected[0].idDireccion, "182", selected[0])
    } else {
      this.toastService.showMessage("error", "Error", "Seleccione un registro para ver la auditoría");
    }
  }
}
