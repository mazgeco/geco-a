//Imports core
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
//Imports generales
import { Combo } from '../../../../interfaces/general.interface';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
//Servicios propios
import { ToastService } from '../../../../services/toast.service';
import { MessageService } from '../../../../services/message.service';
import { FuntionsService } from '../../../../services/functions.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { StateService } from '../state.service';
import { CatalogService } from '../../../../services/catalog.service';
import { CatalogDialogComponent } from '../../../../shared/catalog-dialog-component/catalog-dialog-component';
import { EstadoUsuario, Perfiles, Usuarios } from '../../../../interfaces/seguridades.interface';
import { SeguridadesService } from '../../../../services/seguridades.service';
import { Personas } from '../../../../interfaces/personas.interfaces';
import { PersonasService } from '../../../../services/personas.service';
import { AutoCompleteCompleteEvent } from 'primeng/types/autocomplete';
import { Operacion } from '../../../../interfaces/productos.interfaces';
import { ProductosService } from '../../../../services/productos.service';

@Component({
  selector: 'app-frm-seg0003',
  imports: [...PRIMENG_MODULES, CatalogDialogComponent, ReactiveFormsModule],
  providers: [ConfirmationService, ReactiveFormsModule, CatalogDialogComponent],
  templateUrl: './frm-seg0003.html',
  styleUrl: './frm-seg0003.css',
})
export class FrmSeg0003 implements OnInit {
  //LLAMADA AL ID Master
  @Input()
  idUsuario!: string;

  /******************************************************************************************
   * DECLARACIÓN DE VARIABLES
   *******************************************************************************************/

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>('WinSeg0007');
  idObjeto = signal<string>('FrmSeg0003');
  idTabla = signal<string>('270');
  permiso = signal<string>('w');

  //Declaración variable tipo EstadoPersona que es un enum para usar en el HTML
  readonly EstadoUsuario = EstadoUsuario;

  //INJECTIONS PUBLICAS
  funciones = inject(FuntionsService);
  stateService = inject(StateService);
  catalogService = inject(CatalogService);
  seguridadesService = inject(SeguridadesService);
  personasService = inject(PersonasService);
  productosService = inject(ProductosService);

  //INJECTIONS PRIVADAS
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

  //VARIABLES PARA EL MANEJO DE LOS MENSAJES
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  usuarioMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgFrmSeg0003'),
  );
  //DECLARACIÓN DE VARIABLES
  loadingUsuario = signal(false);
  successfullySaved = signal(false);
  estadoUsuario = signal<string>('INACTIVO');
  personas = signal<Personas[]>([]);
  perfiles = signal<Perfiles[]>([]);
  operaciones = signal<Operacion[]>([]);
  esActivo = signal<boolean>(false);
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

  //DECLARACIÓN DE LA VARIABLE PARA FORMULARIO
  public frmSeg0003 = this.fb.group(
    {
      idUsuario: [''],
      idPerfil: [''],
      idPersona: [null as number | null],
      nombrePersona: [''],
      superUsuario: ['N'],
      estadoUsuario: ['I'],
      disparaAlerta1: ['N'],
      disparaAlerta2: ['N'],
      habilitaColores: ['N'],
      fechaUltimoCambioClave: [null as Date | null],
      cambiaClave: ['S'],
      regeneraComponentes: ['N'],
      usuarioEmail: [''],
      passwordEmail: [''],
      firmaEmail: [''],
      ejecutaKardexCompra: ['N'],
      desmayoriza: ['N'],
      modificaFormaPago: ['N'],
      accesoColumna: ['N'],
      soloProductosOperacion: ['N'],
      token: [''],
      saltaAprobacion: ['N'],
      ingresarRubroPrefactura: ['N'],
      generarPrefactura: ['N'],
      reversarPrefactura: ['N'],
      verRubroPrefactura: ['N'],
      anulaComprobanteContable: ['N'],
      correoRespuesta: [''],
      sobreescribeImportacion: ['N'],
      accedeEstadoConfirmado: ['N'],
      cambiaUsuarioCrea: ['N'],
      registraAnticipo: ['N'],
      cambiaImpuestoPorcentual: ['N'],
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
  get currentData(): Usuarios {
    const persona = this.frmSeg0003.getRawValue() as Usuarios;
    return persona;
  }

  /******************************************************************************************
   * MÉTODOS QUE EJECUTAN LOS PROCESOS
   *******************************************************************************************/

  ngOnInit(): void {
    this.cargaCombos();
    this.cargaDatos(this.idUsuario);
  }

  cambiarEstado(estado: EstadoUsuario): void {}

  cargaDatos(idUsuario: string): void {
    if (idUsuario !== '' && idUsuario !== null) {
      this.loadingUsuario.set(true);
      this.seguridadesService.usuarioPorId(idUsuario).subscribe({
        next: (resp) => {
          //ESTADO
          this.esActivo.set(resp.data.estadoUsuario === 'A' ? true : false);
          this.estadoUsuario.set(resp.data.estadoUsuario === 'A' ? 'ACTIVO' : 'INACTIVO');
          this.stateService.usuario.update((p) => ({
            ...p!,
            nombrePersona: resp.data.nombrePersona!,
          }));
          //PEGA LOS DATOS EN EL FORMULARIO
          this.frmSeg0003.reset(resp.data);
          this.loadingUsuario.set(false);
          this.stateService.usuario.set(resp.data);
          //Muestra un mensaje en la barra indicando que la pesona se cargó correctamente
          this.messageService.mostrar(
            this.statusMessages,
            'msgFrmSeg0003',
            'success',
            'Usuario cargada correctamente.',
          );
        },
        error: (err) => {
          this.loadingUsuario.set(false);
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
            'Ha ocurrido un error al cargar los datos del usuario: ' + err.error.message,
            err.error.status,
          );
        },
      });
    }
  }

  cargaCombos(): void {
    //Carga los perfiles
    this.seguridadesService.listaPerfiles().subscribe({
      next: (resp) => {
        this.perfiles.set(resp.data);
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
    //Carga operaciones
    this.productosService.listaOperaciones().subscribe({
      next: (resp) => {
        this.operaciones.set(resp.data);
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
  }

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
}
