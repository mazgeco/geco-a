import { Component, computed, effect, inject, Input, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AutoCompleteCompleteEvent } from 'primeng/types/autocomplete';
import { debounceTime } from 'rxjs';
//Servicios propios
import { ToastService } from '../../../../services/toast.service';
import { Combo, StatusMessage } from '../../../../interfaces/general.interface';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { CatalogDialogComponent } from '../../../../shared/catalog-dialog-component/catalog-dialog-component';
import { FuntionsService } from '../../../../services/functions.service';
import { CatalogService } from '../../../../services/catalog.service';
import { StateService } from '../../state-service';
import {
  EstadoReserva,
  EstadoReservaNombre,
  Reservas,
} from '../../../../interfaces/reservas.interfaces';
import { MessageService } from '../../../../services/message.service';
import { Personas } from '../../../../interfaces/personas.interfaces';
import { PersonasService } from '../../../../services/personas.service';
import { ReservasService } from '../../../../services/reservas.service';
@Component({
  selector: 'app-frm-res0003',
  imports: [...PRIMENG_MODULES, CatalogDialogComponent, ReactiveFormsModule],
  providers: [ConfirmationService, ReactiveFormsModule],
  templateUrl: './frm-res0003.html',
  styleUrl: './frm-res0003.css',
})
export class FrmRes0003 implements OnInit {
  //LLAMADA AL ID Master
  @Input()
  idReserva!: number;

  /******************************************************************************************
   * DECLARACIÓN DE VARIABLES
   *******************************************************************************************/

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>('WinRes0003');
  idObjeto = signal<string>('FrmRes0003');
  idTabla = signal<string>('253');
  permiso = signal<string>('w');

  //Declaración variable tipo EstadoPersona que es un enum para usar en el HTML
  readonly EstadoReserva = EstadoReserva;

  //INJECTIONS PUBLICAS
  funciones = inject(FuntionsService);
  stateService = inject(StateService);
  catalogService = inject(CatalogService);

  //INJECTIONS PRIVADAS
  private reservasService = inject(ReservasService);
  private personasService = inject(PersonasService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  //VARIABLES PARA EL MANEJO DE LOS MENSAJES
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  reservaMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgFrmRes0003'),
  );

  //DECLARACIÓN DE VARIABLES VARIAS
  hoy = new Date().toISOString().split('T')[0];
  loadingReserva = signal<boolean>(false);
  personas = signal<Personas[]>([]);
  esActivo = signal(false);
  estado: Combo[] = Object.values(EstadoReserva).map((codigo) => ({
    codigo,
    etiqueta: EstadoReservaNombre[codigo],
  }));

  //DECLARACIÓN DE LA VARIABLE PARA FORMULARIO
  public frmRes0003 = this.fb.group(
    {
      idReserva: [0],
      idTipoReserva: [0],
      idPersona: [0],
      idPersonaContacto: [0],
      idClasificacion: [0],
      idImportadoDe: [null as string | null],
      idUsuarioResponsable: [null as string | null],
      nombrePersona: [null as string | null],
      nombrePersonaContacto: [null as string | null],
      estadoReserva: [EstadoReserva.ING],
      codigoAgencia: [null as string | null],
      observacionReserva: [null as string | null],
      observacionPrivada: [null as string | null],
      fechaGeneracion: [new Date()],
      nroPax: [1],
      importadoDe: [null as string | null],
      itinerarioEnviado: [null as string | null],
      facturada: [null as string | null],
      nroFacturaLocal: [null as string | null],
      fechaFacturacion: [new Date()],
      idUsuarioCrea: [null as string | null],
      fechaCrea: [null as string | null],
      idUsuarioModifica: [null as string | null],
      fechaModifica: [null as string | null],
    },
    {
      updateOn: 'blur',
    },
  );

  /******************************************************************************************
   * GETTERS
   *******************************************************************************************/

  //GETTER PARA TRAER LOS DATOS ACTUALES DE LA PESONA
  get currentData(): Reservas {
    const reserva = this.frmRes0003.getRawValue() as unknown as Reservas;
    return reserva;
  }

  /******************************************************************************************
   * MÉTODOS QUE EJECUTAN LOS PROCESOS
   *******************************************************************************************/

  ngOnInit(): void {
    this.cargaDatos(this.idReserva);
  }

  //BUSCA CLIENTES
  buscarPersonas(event: AutoCompleteCompleteEvent): void {
    const nombre = event.query.trim();
    if (nombre.length < 3) {
      this.personas.set([]);
      return;
    }

    this.personasService.buscaPersonaParaCrearUsuario(nombre).subscribe({
      next: (resp) => {
        this.personas.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage(
          'error',
          'Error',
          'Ha ocurrido un error al cargar las personas: ' + err.error.message,
          err.error.status,
        );
      },
    });
  }

  //UNA VEZ SELECCIONADA LA PERSONA
  seleccionarPersona(tipo: string, event: any): void {
    const persona = event.value;

    if (tipo === 'CLI') {
      this.frmRes0003.patchValue({
        nombrePersona: persona.razonSocial,
      });
    }
    if (tipo === 'CNT') {
      this.frmRes0003.patchValue({
        nombrePersonaContacto: persona.razonSocial,
      });
    }
  }

  //CARGA LOS COMBOS DE LA FORMA
  cargaCombos(): void {}

  //CARGA LOS DATOS DE LA RESERVA
  cargaDatos(idReserva: number): void {
    if (idReserva !== 0 && idReserva !== null) {
      this.loadingReserva.set(true);
      this.reservasService.reservaPorId(idReserva).subscribe({
        next: (resp) => {
          //PEGA LOS DATOS EN EL FORMULARIO
          this.frmRes0003.reset(resp.data);
          this.reservaActiva(resp.data.estadoReserva!);
          this.loadingReserva.set(false);
          this.stateService.reserva.set(resp.data);
          //Muestra un mensaje en la barra indicando que la pesona se cargó correctamente
          this.messageService.mostrar(
            this.statusMessages,
            'msgFrmRes0003',
            'success',
            'Reserva cargada correctamente.',
          );
        },
        error: (err) => {
          this.loadingReserva.set(false);
          //Muestra el error en la barra
          this.messageService.mostrar(
            this.statusMessages,
            'msgFrmRes0003',
            'error',
            'La reserva no se cargó correctamente.',
          );
          this.toastService.showMessage(
            'error',
            'Error',
            'Ha ocurrido un error al cargar los datos de la reserva: ' + err.error.message,
            err.error.status,
          );
        },
      });
    }
  }

  //FUNCIÓN PARA VER SI UNA RESERVA ES ACTIVA O NO
  reservaActiva(estado: EstadoReserva): void {
    const deshabilitar = estado === EstadoReserva.XXX || estado === EstadoReserva.PAG;
    const controles = [
      'codigoAgencia',
      'nroPax',
      'fechaGeneracion',
      'nroFacturaLocal',
      'fechaFacturacion',
      'observacionReserva',
      'observacionPrivada',
    ];
    let control = null;
    controles.forEach((element) => {
      control = this.frmRes0003.get(element);
      if (deshabilitar) {
        control?.disable({ emitEvent: false });
        control?.disable({ emitEvent: false });
      } else {
        control?.enable({ emitEvent: false });
        control?.enable({ emitEvent: false });
      }
    });
  }

  //GRABA LA RESERVA
  saveForm(reserva: Reservas): void {}

  //CAMBIA EL ESTADO DE LA RESERVA
  cambiarEstado(estadoReserva: EstadoReserva): void {}
}
