import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
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
import { EstadoReserva, Reservas } from '../../../../interfaces/reservas.interface';
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
  loadingReserva = signal<boolean>(false);
  personas = signal<Personas[]>([]);
  esActivo = signal<boolean>(false);
  estado = signal<Combo[]>([
    { codigo: 'CNF', etiqueta: 'Confirmada' },
    { codigo: 'RSV', etiqueta: 'Reservada' },
    { codigo: 'BLQ', etiqueta: 'Bloqueada' },
    { codigo: 'XXX', etiqueta: 'Anulada' },
    { codigo: 'ING', etiqueta: 'Ingresada' },
    { codigo: 'ALM', etiqueta: 'Almacenada' },
    { codigo: 'PAG', etiqueta: 'Pagada' },
    { codigo: 'MAN', etiqueta: 'Mantenimiento' },
  ]);

  //DECLARACIÓN DE LA VARIABLE PARA FORMULARIO
  public frmRes0003 = this.fb.group(
    {
      idReserva: [0],
      idTipoReserva: [0],
      idPersona: [''],
      idPersonaContacto: [''],
      idClasificacion: [null],
      nombrePersona: [''],
      nombrePersonaContacto: [''],
      estadoReserva: ['ING'],
      codigoAgencia: [''],
      observacionReserva: [''],
      observacionPrivada: [''],
      fechaGeneracion: [''],
      nroPax: [null],
      importadoDe: [''],
      idImportadoDe: [null],
      idUsuarioResponsable: [''],
      itinerarioEnviado: [''],
      nroFacturaLocal: [''],
      facturada: [''],
      fechaFacturacion: [''],
      idUsuarioCrea: [''],
      fechaCrea: [''],
      idUsuarioModifica: [''],
      fechaModifica: [''],
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
    if(idReserva !== 0 && idReserva !== null){
      this.loadingReserva.set(false);
      this.reservasService.reservaPorId(idReserva).subscribe({
        next: (resp) => {
            
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
        }
      });
    }
  }

  //GRABA LA RESERVA
  saveForm(reserva: Reservas): void {}

  //CAMBIA EL ESTADO DE LA RESERVA
  cambiarEstado(estadoReserva: EstadoReserva): void {}
}
