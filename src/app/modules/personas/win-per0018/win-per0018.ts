import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Combo, Denominaciones, Nacionalidades, Paises, Personas, TipoEmpresas } from '../../../interfaces/personas.interfaces';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { PersonasService } from '../../../services/personas.service';
import { ToastService } from '../../../services/toast.service';
import { FuntionsService } from '../../../services/functions.service';
import { ConfirmationService } from 'primeng/api';
import { StatusMessage } from '../../../interfaces/general.interface';
import { MessageService } from '../../../services/message.service'
import { GrdPer0010 } from './grd-per0010/grd-per0010';
import { GrdPer0006 } from "./grd-per0006/grd-per0006";
import { GrdPer0002 } from './grd-per0002/grd-per0002';
import { GrdPer0008 } from './grd-per0008/grd-per0008';
import { GrdPer0019 } from './grd-per0019/grd-per0019';


@Component({
  selector: 'app-win-per0018',
  imports: [...PRIMENG_MODULES, ReactiveFormsModule, GrdPer0002, GrdPer0006, GrdPer0008, GrdPer0010, GrdPer0019],
  providers: [ConfirmationService],
  templateUrl: './win-per0018.html',
  styleUrl: './win-per0018.css'
})
export class WinPer0018 implements OnInit {

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>("WinPer0018");
  idObjeto = signal<string>("FrmPer0001");
  idTabla = signal<string>("189");
  permiso = signal<string>("w");


  //INJECTIONS PUBLICAS
  funciones = inject(FuntionsService);
  //INJECTIONS PRIVADAS
  private route = inject(ActivatedRoute);
  private personasService = inject(PersonasService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

  //VARIABLES PARA EL MANEJO DE LOS MENSAJES
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  personaMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgFrmPer0001')
  );

  //DECLARACIÓN DE VARIABLES
  loadingPersona = signal(true);
  successfullySaved = signal(false);
  idPersona = signal<number>(0);
  estadoPersona = signal<string>("INACTIVO");
  razonSocialPersona = signal<string>("");
  denominaciones = signal<Denominaciones[]>([]);
  nacionalidades = signal<Nacionalidades[]>([]);
  tipoEmpresas = signal<TipoEmpresas[]>([]);
  esActivo = signal<boolean>(false);
  paises = signal<Paises[]>([]);
  opcionSN = signal<Combo[]>([
    {
      codigo: "S",
      etiqueta: "Si"
    },
    {
      codigo: "N",
      etiqueta: "No"
    }
  ]);
  tipoPersona = signal<Combo[]>([
    {
      codigo: "N",
      etiqueta: "Natural"
    },
    {
      codigo: "J",
      etiqueta: "Jurídico"
    }
  ]);
  generoLista = signal<Combo[]>([
    {
      codigo: "F",
      etiqueta: "Femenino"
    },
    {
      codigo: "M",
      etiqueta: "Masculino"
    },
    {
      codigo: "O",
      etiqueta: "Otro"
    }
  ]);
  estadoCivil = signal<Combo[]>([
    {
      codigo: "S",
      etiqueta: "Soltero"
    },
    {
      codigo: "C",
      etiqueta: "Casado"
    },
    {
      codigo: "D",
      etiqueta: "Divorciado"
    },
    {
      codigo: "V",
      etiqueta: "Viudo"
    },
    {
      codigo: "U",
      etiqueta: "Union Libre"
    }
  ]);

  //FORMULARIO
  public frmPer0001 = this.fb.group({
    idPersona: [0],
    idTipoEmpresa: [''],
    idNacionalidad: [0],
    idDenominacion: [''],
    idPais: [0],
    apellido1: [''],
    apellido2: [''],
    nombre1: [''],
    nombre2: [''],
    razonSocial: [''],
    nombreComercial: [''],
    fechaNacimiento: [null as Date | null],
    correoElectronico: [''],
    paginaWeb: [''],
    estadoPersona: [''],
    esEntidadFinanciera: [''],
    genero: [''],
    tipoPersona: [''],
    estadoCivil: [''],
    identificacion: [''],
    telefono: [''],
    nombreTipoPersona: [''],
    idUsuarioCrea: [''],
    fechaCrea: [''],
    idUsuarioModifica: [''],
    fechaModifica: ['']
  }, {
    updateOn: 'blur'
  });

  //GETTER PARA TRAER LOS DATOS ACTUALES DE LA PESONA
  get currentData(): Personas {
    const persona = this.frmPer0001.getRawValue() as Personas;
    return persona;
  }

  //GETTER PARA EL TIPO DE PERSONA ACTUAL
  get tipoPersonaActual(): string | null | undefined {
    return this.frmPer0001.get('tipoPersona')?.value;
  }

  //FUNCIÓN QUE SE CARGA EN EL EVENTO OnInit
  ngOnInit(): void {
    //Revisa los cambios en el formulario para disparar el grabado en cada cambio
    this.frmPer0001.valueChanges.subscribe(persona => {
      if (this.loadingPersona()) {
        return;
      }
      if (persona.tipoPersona === 'N') {
        persona.razonSocial = persona.apellido1 + ' ' + (persona.apellido2 === null ? '' : persona.apellido2) + ' ' +
          persona.nombre1 + ' ' + (persona.nombre2 === null ? '' : persona.nombre2);
        this.razonSocialPersona.set(persona.razonSocial);
      }

      this.messageService.mostrar(
        this.statusMessages,
        'msgFrmPer0001',
        'success',
        'Dato grabado correctamente.'
      );
      this.saveForm(persona as Personas);
    });

    //Carga de datos
    this.cargaCombos();
    //Toma el dato enviado por el router para colocar en el id principal
    this.idPersona.set(Number(this.route.snapshot.paramMap.get('id')));
    //Carga los datos de la persona consultada
    this.cargaPersona(this.idPersona());
  }

  //FUNCIÓN QUE CARGA LOS DATOS PARA LOS COMBOS
  cargaCombos(): void {
    //CARGA DENOMINACIONES
    this.personasService.listaDenominaciones()
      .subscribe({
        next: (resp) => {
          this.denominaciones.set(resp.data);
        },
        error: (err) => {
          this.toastService.showMessage("error", "Error", "Ha ocurrido un error al cargar las denominaciones: " + err.error.message, err.error.status);
        }
      });

    //CARGA NACIONALIDADES
    this.personasService.listaNacionalidades().subscribe({
      next: (resp) => {
        this.nacionalidades.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage("error", "Error", "Ha ocurrido un error al cargar las nacionalidades: " + err.error.message, err.error.status);
      }
    });

    //CARGA PAÍSES
    this.personasService.listaPaises().subscribe({
      next: (resp) => {
        this.paises.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage("error", "Error", "Ha ocurrido un error al cargar las países: " + err.error.message, err.error.status);
      }
    });

    //CARGA TIPO EMPRESAS
    this.personasService.listaTipoEmpresas().subscribe({
      next: (resp) => {
        this.tipoEmpresas.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage("error", "Error", "Ha ocurrido un error al cargar las tipos de empresas: " + err.error.message, err.error.status);
      }
    });
  }

  //FUNCIÓN QUE CARGA LOS DATOS DE LA PERSONA CONSULTADA
  cargaPersona(idPersona: number): void {
    this.loadingPersona.set(true);
    if (idPersona !== 0) {
      this.personasService.personaPorId(idPersona).subscribe({
        next: (resp) => {
          //ESTADO
          this.esActivo.set(resp.data.estadoPersona === "A" ? true : false);
          this.estadoPersona.set(resp.data.estadoPersona === "A" ? "ACTIVO" : "INACTIVO");
          this.razonSocialPersona.set(resp.data.razonSocial);
          resp.data.fechaNacimiento = this.funciones.convertirAFecha(resp.data.fechaNacimiento);
          //PEGA LOS DATOS EN EL FORMULARIO
          this.frmPer0001.reset(resp.data);
          this.loadingPersona.set(false);
          //Muestra un mensaje en la barra indicando que la pesona se cargó correctamente
          this.messageService.mostrar(
            this.statusMessages,
            'msgFrmPer0001',
            'success',
            'Persona cargada correctamente.'
          );
        },
        error: (err) => {
          this.loadingPersona.set(false);
          //Muestra el error en la barra
          this.messageService.mostrar(
            this.statusMessages,
            'msgFrmPer0001',
            'error',
            'La persona no se cargó correctamente.'
          );
          this.toastService.showMessage("error", "Error", "Ha ocurrido un error al cargar los datos de la persona: " + err.error.message, err.error.status);
        }
      });
    }
  }

  //CREATE/UPDATE PERSONA
  saveForm(persona: Personas): void {
    this.personasService.grabaPersona(this.idPersona(), persona)?.subscribe({
      next: (resp) => {
        this.idPersona.set(resp.idSecuencial);
      },
      error: (err) => {
        this.toastService.showMessage("err", "Error", 'Ha ocurrido un error al grabar: ' + err.error.message);
      }
    });
  }

  //CAMBIA EL ESTADO DE LA PERSONA
  cambiarEstado(estado: string): void {
    this.confirmationService.confirm({
      message: '¿Realmente desea cambiar el estado de esta persona?',
      header: 'Cambio de estado',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.esActivo.set(estado === "A" ? true : false);
        this.estadoPersona.set(estado === "A" ? "ACTIVO" : "INACTIVO");
        this.frmPer0001.patchValue({
          estadoPersona: estado
        });
      }
    });
  }

}
