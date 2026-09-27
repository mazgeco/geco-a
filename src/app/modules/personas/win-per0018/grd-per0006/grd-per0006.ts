import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { Combo } from '../../../../interfaces/general.interface';
import { Ciudades, Direcciones, TipoDirecciones } from '../../../../interfaces/personas.interfaces';
import { FuntionsService } from '../../../../services/functions.service';
import { PersonasService } from '../../../../services/personas.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-grd-per0006',
  imports: [...PRIMENG_MODULES, FormsModule],
  templateUrl: './grd-per0006.html',
})
export class GrdPer0006 implements OnInit {
  //LLAMADA AL idPersona
  @Input()
  idPersona!: number;

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>('WinPer0018');
  idObjeto = signal<string>('GrdPer0006');
  idTabla = signal<string>('182');
  permiso = signal<string>('w');

  //INJECTIONS PÚBLICOS
  funciones = inject(FuntionsService);
  //INJECTIONS PRIVADOS
  private confirmationService = inject(ConfirmationService);
  private personasService = inject(PersonasService);
  private toastService = inject(ToastService);

  //DECLARACIÓN DE VARIABLES
  selectedRows!: Direcciones[];
  metaKey: boolean = true;
  direcciones = signal<Direcciones[]>([]);
  tiposDireccion = signal<TipoDirecciones[]>([]);
  ciudades = signal<Ciudades[]>([]);

  ngOnInit(): void {
    //CARGA COMBOS
    this.cargaCombos();
    //CARGA LAS IDENTIFICACIONES DE LA PERSONA CONSULTADA
    this.cargaDirecciones();
  }

  //CARGA COMBOS
  cargaCombos(): void {
    this.personasService.listaTipoDirecciones().subscribe({
      next: (resp) => {
        this.tiposDireccion.set(resp.data);
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

    this.personasService.listaCiudades().subscribe({
      next: (resp) => {
        this.ciudades.set(resp.data);
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

  //INSERTA UNA FILA en el grid
  insertarDireccion(): void {
    const nueva: Direcciones = {
      idDireccion: 0, // Id temporal nulo para crear espera que sea null
      idPersona: this.idPersona,
      idCiudadDireccion: 0,
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
      fechaModifica: '',
    };

    let mensaje = this.funciones.insertRow(
      this.direcciones,
      nueva,
      'idDireccion',
      this.idPersona !== 0,
      'btnGrdPer001050',
    );
    if (mensaje !== '') {
      this.toastService.showMessage('error', 'Error', mensaje);
    }
  }

  saveDireccion(direccion: Direcciones): void {
    direccion.principalDireccion = direccion.preferida ? 'S' : 'N';
    const sector = direccion.sector?.trim() || '';
    const callePrincipal = direccion.callePrincipal?.trim() || '';
    const nroCasaOEdificio = direccion.nroCasaOEdificio?.trim() || '';
    const calleSecundaria = direccion.calleSecundaria?.trim() || '';
    const datoAdicional = direccion.datoAdicional?.trim() || '';

    direccion.descripcionDireccion =
      [sector, callePrincipal, nroCasaOEdificio].filter(Boolean).join(' ') +
      (calleSecundaria ? ` y ${calleSecundaria}` : '') +
      (datoAdicional ? ` Ref: ${datoAdicional}` : '');

    if (
      direccion.principalDireccion === 'S' &&
      this.direcciones().filter((item) => item.principalDireccion === 'S').length === 2
    ) {
      this.toastService.showMessage(
        'error',
        'Error',
        'No puede colocar otra direccion como principal si ya existe una',
      );
      direccion.principalDireccion = 'N';
      direccion.preferida = false;
    }

    this.personasService.grabaDireccion(direccion).subscribe({
      next: (resp) => {
        direccion.idDireccion = resp.idSecuencial!;
        this.cargaDirecciones();
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
  cargaDirecciones(): void {
    this.direcciones.set([]);
    if (this.idPersona !== 0) {
      this.personasService.listaDirecciones(this.idPersona).subscribe({
        next: (resp) => {
          let aux = resp.data;

          aux.forEach((d) => {
            d.preferida = d.principalDireccion === 'S';
            const sector = d.sector?.trim() || '';
            const callePrincipal = d.callePrincipal?.trim() || '';
            const nroCasaOEdificio = d.nroCasaOEdificio?.trim() || '';
            const calleSecundaria = d.calleSecundaria?.trim() || '';
            const datoAdicional = d.datoAdicional?.trim() || '';

            d.descripcionDireccion =
              [sector, callePrincipal, nroCasaOEdificio].filter(Boolean).join(' ') +
              (calleSecundaria ? ` y ${calleSecundaria}` : '') +
              (datoAdicional ? ` Ref: ${datoAdicional}` : '');
          });

          this.direcciones.set(aux);
        },
        error: (err) => {
          this.toastService.showMessage(
            'error',
            'Error',
            'Ha ocurrido un error al cargar las direcciones de la persona: ' + err.error.message,
            err.error.status,
          );
        },
      });
    }
  }
  //DELETE
  eliminarDireccion(rowData: Direcciones): void {
    if (rowData.idDireccion === 0) {
      this.direcciones.set(
        this.direcciones().filter((item) => item.idDireccion != rowData.idDireccion),
      );
    } else {
      this.confirmationService.confirm({
        message: '¿Desea eliminar la identificación?',
        header: 'Eliminar',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.personasService.eliminaDireccion(rowData.idDireccion!).subscribe({
            next: (resp) => {
              this.direcciones.set(
                this.direcciones().filter((item) => item.idDireccion != resp.idSecuencial),
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
                this.direcciones.set(
                  this.direcciones().filter((item) => item.idDireccion != resp.idSecuencial),
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

  //Función que muestra la auditoría del registro seleccionado
  muestraAuditoriaRegistro(): void {
    const selected = this.selectedRows || [];
    if (selected.length === 1) {
      this.funciones.muestraAuditoria(selected[0].idDireccion, this.idTabla(), selected[0]);
    } else {
      this.toastService.showMessage(
        'error',
        'Error',
        'Seleccione un registro para ver la auditoría',
      );
    }
  }

  cancelarGrabado(rowData: Direcciones) {
    this.cargaDirecciones();
  }
}
