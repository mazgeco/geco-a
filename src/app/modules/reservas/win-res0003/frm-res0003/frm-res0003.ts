import {
  Component,
  computed,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AutoCompleteCompleteEvent } from 'primeng/types/autocomplete';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

  @Output() reservaGuardada = new EventEmitter<number>();
  guardando = signal(false);
  cambiandoEstado = signal(false);
  private pendiente: Reservas | null = null;
  private destroyRef = inject(DestroyRef);
  private confirmationService = inject(ConfirmationService);

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
  personaContactoSeleccionada: any = null;
  estado: Combo[] = Object.values(EstadoReserva).map((codigo) => ({
    codigo,
    etiqueta: EstadoReservaNombre[codigo],
  }));

  //DECLARACIÓN DE LA VARIABLE PARA FORMULARIO
  public frmRes0003 = this.fb.group(
    {
      idReserva: [0],
      idTipoReserva: [0],
      idPersona: [null as number | null, [Validators.required, Validators.min(1)]],
      idPersonaContacto: [null as number | null],
      idClasificacion: [null as number | null],
      idImportadoDe: [null as string | null],
      idUsuarioResponsable: [null as string | null],
      nombrePersona: [null as string | null],
      nombrePersonaContacto: [null as string | null],
      estadoReserva: [EstadoReserva.ING],
      codigoAgencia: [null as string | null, Validators.required],
      observacionReserva: [null as string | null],
      observacionPrivada: [null as string | null],
      fechaGeneracion: [new Date() as Date | null, Validators.required],
      nroPax: [1, [Validators.required, Validators.min(1)]],
      importadoDe: [null as string | null],
      itinerarioEnviado: [null as string | null],
      facturada: [null as string | null],
      nroFacturaLocal: [null as string | null],
      fechaFacturacion: [null as Date | null],
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
    const reserva = this.frmRes0003.getRawValue() as Reservas;
    return reserva;
  }

  /******************************************************************************************
   * MÉTODOS QUE EJECUTAN LOS PROCESOS
   *******************************************************************************************/

  ngOnInit(): void {
    this.reservaActiva(EstadoReserva.ING);
    this.cargaDatos(this.idReserva);
    this.frmRes0003.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.loadingReserva() && !this.cambiandoEstado() && this.frmRes0003.dirty) {
          this.saveForm(this.currentData);
        }
      });
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
        idPersona: persona.idPersona,
        nombrePersona: persona.razonSocial,
      });
    }
    if (tipo === 'CNT') {
      this.frmRes0003.patchValue({
        idPersonaContacto: persona.idPersona,
      });
      this.saveForm(this.currentData);
    }
  }

  //CARGA LOS COMBOS DE LA FORMA
  cargaCombos(): void {}

  //CARGA LOS DATOS DE LA RESERVA
  cargaDatos(idReserva: number): void {
    if (idReserva > 0) {
      this.loadingReserva.set(true);
      this.reservasService.reservaPorId(idReserva).subscribe({
        next: (resp) => {
          this.personaContactoSeleccionada = resp.data.idPersonaContacto
            ? {
                idPersona: resp.data.idPersonaContacto,
                razonSocial: resp.data.nombrePersonaContacto,
              }
            : null;
          //PEGA LOS DATOS EN EL FORMULARIO
          this.frmRes0003.reset(
            {
              ...resp.data,
              fechaGeneracion: this.funciones.convertirAFecha(resp.data.fechaGeneracion),
              fechaFacturacion: this.funciones.convertirAFecha(resp.data.fechaFacturacion),
            },
            { emitEvent: false },
          );
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
            err.error.status
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
    this.esActivo.set(estado === EstadoReserva.CNF);
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
      } else {
        control?.enable({ emitEvent: false });
      }
    });
  }

  //GRABA LA RESERVA
  saveForm(reserva: Reservas): void {
    if (
      this.loadingReserva() ||
      this.cambiandoEstado() ||
      reserva.estadoReserva === EstadoReserva.XXX ||
      reserva.estadoReserva === EstadoReserva.PAG
    )
      return;
    if (this.frmRes0003.invalid) {
      this.frmRes0003.markAllAsTouched();
      this.messageService.mostrar(
        this.statusMessages,
        'msgFrmRes0003',
        'warn',
        'Seleccione un cliente, ingrese el código de agencia, la fecha y un número de pasajeros válido.',
      );
      return;
    }
    // Serializa el guardado: conserva el último cambio hecho durante una petición.
    if (this.guardando()) {
      this.pendiente = { ...reserva };
      return;
    }
    const datos = { ...reserva, idReserva: this.idReserva || null };
    this.guardando.set(true);
    this.reservasService.grabaReserva(datos).subscribe({
      next: (resp) => {
        const id = resp.idSecuencial ?? this.idReserva;
        if (!id) {
          this.guardando.set(false);
          this.pendiente = null;
          this.toastService.showMessage(
            'error',
            'Error',
            'El servidor no devolvió el ID de la reserva.',
          );
          return;
        }
        this.idReserva = id;
        this.frmRes0003.patchValue({ idReserva: id }, { emitEvent: false });
        this.stateService.reserva.set({ ...datos, idReserva: id });
        this.reservaGuardada.emit(id);
        this.guardando.set(false);
        const pendiente = this.pendiente;
        this.pendiente = null;
        if (pendiente) {
          this.saveForm({ ...pendiente, idReserva: id });
        } else {
          // Si hubo otra edición aún pendiente del debounce, no marcarla como guardada.
          if (JSON.stringify(this.currentData) === JSON.stringify({ ...reserva, idReserva: id })) {
            this.frmRes0003.markAsPristine();
          }
          this.messageService.mostrar(
            this.statusMessages,
            'msgFrmRes0003',
            'success',
            'Reserva grabada correctamente.',
          );
        }
      },
      error: (err) => {
        this.guardando.set(false);
        this.pendiente = null;
        this.messageService.mostrar(
          this.statusMessages,
          'msgFrmRes0003',
          'error',
          'No se guardaron los cambios. Pulse Guardar para reintentar.',
        );
        this.toastService.showMessage(
          'error',
          'Error',
          err.error?.message ?? 'No se pudo guardar la reserva.',
        );
      },
    });
  }

  //CAMBIA EL ESTADO DE LA RESERVA
  cambiarEstado(estadoReserva: EstadoReserva): void {
    if (!this.idReserva || this.guardando() || this.cambiandoEstado() || this.frmRes0003.dirty) {
      this.toastService.showMessage('warn', 'Reserva', 'Primero guarde los cambios de la reserva.');
      return;
    }
    if (this.currentData.estadoReserva === estadoReserva) return;
    this.confirmationService.confirm({
      message: `¿Desea cambiar la reserva a ${EstadoReservaNombre[estadoReserva]}?`,
      header: 'Cambio de estado',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        if (this.guardando() || this.cambiandoEstado() || this.frmRes0003.dirty) return;
        this.cambiandoEstado.set(true);
        this.reservasService.actualizaEstadoReserva(this.idReserva, estadoReserva).subscribe({
          next: () => {
            this.frmRes0003.patchValue({ estadoReserva }, { emitEvent: false });
            this.reservaActiva(estadoReserva);
            this.stateService.reserva.update((reserva) =>
              reserva ? { ...reserva, estadoReserva } : reserva,
            );
            this.cambiandoEstado.set(false);
            this.messageService.mostrar(
              this.statusMessages,
              'msgFrmRes0003',
              'success',
              'Estado actualizado correctamente.',
            );
          },
          error: (err) => {
            this.cambiandoEstado.set(false);
            this.toastService.showMessage(
              'error',
              'Error',
              err.error?.message ?? 'No se pudo cambiar el estado de la reserva.',
            );
          },
        });
      },
    });
  }
}
