//Imports core
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
//Imports generales
import { Combo } from '../../../../interfaces/general.interface';
import {
  Denominaciones,
  EstadoPersona,
  Nacionalidades,
  Paises,
  Personas,
  TipoEmpresas,
} from '../../../../interfaces/personas.interfaces';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
//Servicios propios
import { ToastService } from '../../../../services/toast.service';
import { MessageService } from '../../../../services/message.service';
import { PersonasService } from '../../../../services/personas.service';
import { FuntionsService } from '../../../../services/functions.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { StateService } from '../state-service';
import { CatalogService } from '../../../../services/catalog.service';
import { CatalogDialogComponent } from '../../../../shared/catalog-dialog-component/catalog-dialog-component';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-frm-per0001',
  imports: [...PRIMENG_MODULES, ReactiveFormsModule, CatalogDialogComponent],
  providers: [ConfirmationService],
  templateUrl: './frm-per0001.html',
  styleUrl: './frm-per0001.css',
})
export class FrmPer0001 implements OnInit {
  //LLAMADA AL ID Master
  @Input()
  idPersona!: number;

  /******************************************************************************************
   * DECLARACIÓN DE VARIABLES
   *******************************************************************************************/

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>('WinPer0018');
  idObjeto = signal<string>('FrmPer0001');
  idTabla = signal<string>('189');
  permiso = signal<string>('w');

  //Declaración variable tipo EstadoPersona que es un enum para usar en el HTML
  readonly EstadoPersona = EstadoPersona;

  //INJECTIONS PUBLICAS
  funciones = inject(FuntionsService);
  stateService = inject(StateService);
  catalogService = inject(CatalogService);
  //INJECTIONS PRIVADAS
  private personasService = inject(PersonasService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

  //VARIABLES PARA EL MANEJO DE LOS MENSAJES
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  personaMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgFrmPer0001'),
  );

  //DECLARACIÓN DE VARIABLES
  loadingPersona = signal(false);
  successfullySaved = signal(false);
  estadoPersona = signal<string>('INACTIVO');
  denominaciones = signal<Denominaciones[]>([]);
  nacionalidades = signal<Nacionalidades[]>([]);
  tipoEmpresas = signal<TipoEmpresas[]>([]);
  esActivo = signal<boolean>(false);
  paises = signal<Paises[]>([]);
  opcionSN = signal<Combo[]>([
    {
      codigo: 'S',
      etiqueta: 'Si',
    },
    {
      codigo: 'N',
      etiqueta: 'No',
    },
  ]);
  tipoPersona = signal<Combo[]>([
    {
      codigo: 'N',
      etiqueta: 'Natural',
    },
    {
      codigo: 'J',
      etiqueta: 'Jurídico',
    },
  ]);
  generoLista = signal<Combo[]>([
    {
      codigo: 'F',
      etiqueta: 'Femenino',
    },
    {
      codigo: 'M',
      etiqueta: 'Masculino',
    },
    {
      codigo: 'O',
      etiqueta: 'Otro',
    },
  ]);
  estadoCivil = signal<Combo[]>([
    {
      codigo: 'S',
      etiqueta: 'Soltero',
    },
    {
      codigo: 'C',
      etiqueta: 'Casado',
    },
    {
      codigo: 'D',
      etiqueta: 'Divorciado',
    },
    {
      codigo: 'V',
      etiqueta: 'Viudo',
    },
    {
      codigo: 'U',
      etiqueta: 'Union Libre',
    },
  ]);

  //DECLARACIÓN DE LA VARIABLE PARA FORMULARIO
  public frmPer0001 = this.fb.group(
    {
      idPersona: [0],
      idTipoEmpresa: [null as string | null],
      idNacionalidad: [null as number | null],
      idDenominacion: [null as string | null],
      idPais: [null as number | null],
      apellido1: [''],
      apellido2: [''],
      nombre1: [''],
      nombre2: [''],
      razonSocial: [''],
      nombreComercial: [''],
      fechaNacimiento: [null as Date | null],
      correoElectronico: [''],
      paginaWeb: [''],
      estadoPersona: ['I'],
      esEntidadFinanciera: ['N'],
      genero: [''],
      tipoPersona: [''],
      estadoCivil: [''],
      identificacion: [''],
      telefono: [''],
      nombreTipoPersona: [''],
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
  get currentData(): Personas {
    const persona = this.frmPer0001.getRawValue() as Personas;
    return persona;
  }

  //GETTER PARA EL TIPO DE PERSONA ACTUAL
  get tipoPersonaActual(): string | null | undefined {
    return this.frmPer0001.get('tipoPersona')?.value;
  }

  /******************************************************************************************
   * MÉTODOS QUE EJECUTAN LOS PROCESOS
   *******************************************************************************************/

  //MÉTODO QUE SE CARGA AL INICIALIZARCE EL OBJETO PRINCIPAL WinPer0018
  ngOnInit(): void {
    //Carga de datos de los combos
    this.cargaCombos();

    //Carga los datos de la persona consultada
    this.cargaPersona(this.idPersona);

    //Activa la revisión de cambios en el formulario para disparar el grabado en cada cambio
    this.frmPer0001.valueChanges.pipe(debounceTime(300)).subscribe((persona) => {
      //Si la persona se está cargando no ejecuta
      if (this.loadingPersona()) {
        return;
      }
      //Concatena los nombres para cargar la razón social antes de grabar
      if (persona.tipoPersona === 'N') {
        persona.razonSocial =
          persona.apellido1 +
          ' ' +
          (persona.apellido2 === null ? '' : persona.apellido2) +
          ' ' +
          persona.nombre1 +
          ' ' +
          (persona.nombre2 === null ? '' : persona.nombre2);
      }
      this.stateService.persona.update((p) => ({
        ...p!,
        razonSocial: persona.razonSocial!,
      }));
      //Llamada al método para guardar personas cuando exista un cambio en algún campo del formulario
      this.saveForm(persona as Personas);
    });
  }

  //MÉTODO QUE CARGA LOS DATOS PARA LOS COMBOS
  cargaCombos(): void {
    //Carga las denominaciones
    this.personasService.listaDenominaciones().subscribe({
      next: (resp) => {
        this.denominaciones.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage(
          'error',
          'Error',
          'Ha ocurrido un error al cargar las denominaciones: ' + err.error.message,
          err.error.status,
        );
      },
    });

    //Carga las nacionalidades
    this.personasService.listaNacionalidades().subscribe({
      next: (resp) => {
        this.nacionalidades.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage(
          'error',
          'Error',
          'Ha ocurrido un error al cargar las nacionalidades: ' + err.error.message,
          err.error.status,
        );
      },
    });

    //Carga los paises
    this.personasService.listaPaises().subscribe({
      next: (resp) => {
        this.paises.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage(
          'error',
          'Error',
          'Ha ocurrido un error al cargar las países: ' + err.error.message,
          err.error.status,
        );
      },
    });

    //Carga los tipos de empresas
    this.personasService.listaTipoEmpresas().subscribe({
      next: (resp) => {
        this.tipoEmpresas.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage(
          'error',
          'Error',
          'Ha ocurrido un error al cargar las tipos de empresas: ' + err.error.message,
          err.error.status,
        );
      },
    });
  }

  //FUNCIÓN QUE CARGA LOS DATOS DE LA PERSONA CONSULTADA
  cargaPersona(idPersona: number): void {
    if (idPersona !== 0 && idPersona !== null) {
      this.loadingPersona.set(true);
      this.personasService.personaPorId(idPersona).subscribe({
        next: (resp) => {
          //ESTADO
          this.esActivo.set(resp.data.estadoPersona === 'A' ? true : false);
          this.estadoPersona.set(resp.data.estadoPersona === 'A' ? 'ACTIVO' : 'INACTIVO');
          this.stateService.persona.update((p) => ({
            ...p!,
            razonSocial: resp.data.razonSocial!,
          }));
          resp.data.fechaNacimiento = this.funciones.convertirAFecha(resp.data.fechaNacimiento);
          //PEGA LOS DATOS EN EL FORMULARIO
          this.frmPer0001.reset(resp.data);
          this.loadingPersona.set(false);
          this.stateService.persona.set(resp.data);
          //Muestra un mensaje en la barra indicando que la pesona se cargó correctamente
          this.messageService.mostrar(
            this.statusMessages,
            'msgFrmPer0001',
            'success',
            'Persona cargada correctamente.',
          );
        },
        error: (err) => {
          this.loadingPersona.set(false);
          //Muestra el error en la barra
          this.messageService.mostrar(
            this.statusMessages,
            'msgFrmPer0001',
            'error',
            'La persona no se cargó correctamente.',
          );
          this.toastService.showMessage(
            'error',
            'Error',
            'Ha ocurrido un error al cargar los datos de la persona: ' + err.error.message,
            err.error.status,
          );
        },
      });
    } else {
      this.stateService.persona.update((actual) => ({
        ...actual!,
        idPersona: 0,
        razonSocial: '',
        estadoPersona: this.EstadoPersona.I,
      }));
    }
  }

  //MÉTODO QUE CREA Y ACTUALIZA A LA PERSONA
  saveForm(persona: Personas): void {
    this.personasService.grabaPersona(this.idPersona, persona)?.subscribe({
      next: (resp) => {
        this.idPersona = resp.idSecuencial!;
        this.frmPer0001.patchValue({ idPersona: resp.idSecuencial }, { emitEvent: false });
        persona.idPersona = resp.idSecuencial;
        this.stateService.persona.set(persona);
        this.messageService.mostrar(
          this.statusMessages,
          'msgFrmPer0001',
          'success',
          'Dato grabado correctamente.',
        );
      },
      error: (err) => {
        this.toastService.showMessage(
          'error',
          'Error',
          'Ha ocurrido un error al grabar: ' + err.error.message,
        );
      },
    });
  }

  //MÉTODO QUE CAMBIA EL ESTADO DE LA PERSONA
  cambiarEstado(estado: EstadoPersona): void {
    this.confirmationService.confirm({
      message: '¿Realmente desea cambiar el estado de esta persona?',
      header: 'Cambio de estado',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.personasService.actualizaEstadoPersona(this.idPersona, estado).subscribe({
          next: (resp) => {
            this.esActivo.set(estado === 'A' ? true : false);
            this.estadoPersona.set(estado === 'A' ? 'ACTIVO' : 'INACTIVO');
            this.frmPer0001.patchValue({
              estadoPersona: estado,
            });
            this.stateService.persona.update((p) => ({
              ...p!,
              estadoPersona: estado,
            }));
          },
          error: (err) => {
            this.toastService.showMessage(
              'error',
              'Error',
              'Ha ocurrido un error al grabar: ' + err.error.message,
            );
          },
        });
      },
    });
  }

  abrirNuevo(tipo: string) {
    const catalogos = {
      NAC: {
        codigo: 'NAC',
        titulo: 'Nueva Nacionalidad',
        campoDescripcion: 'Descripción',
      },

      PAI: {
        codigo: 'PAI',
        titulo: 'Nuevo País',
        campoDescripcion: 'Descripción',
      },
    };

    this.catalogService.abrir(catalogos[tipo as keyof typeof catalogos]);
  }
}
