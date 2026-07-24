import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Combo, Denominaciones, Identificaciones, Nacionalidades, Opcion, Paises, Personas, TipoEmpresas } from '../../../interfaces/personas.interfaces';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { PersonasService } from '../../../services/personas.service';
import { ToastService } from '../../../shared/toast.service';
import { FuntionsService } from '../../../services/functions.service';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-win-per0018',
  imports: [...PRIMENG_MODULES, DatePipe, NgClass, ReactiveFormsModule],
  providers: [ConfirmationService],
  templateUrl: './win-per0018.html',
  styleUrl: './win-per0018.css',
})
export class WinPer0018 implements OnInit {

  //Injections
  private route = inject(ActivatedRoute);
  private personasService = inject(PersonasService);
  private toastService = inject(ToastService);
  private funciones = inject(FuntionsService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

  //Declaraciones de variables
  loadingPersona = signal(true);
  successfullySaved = signal(false);
  idPersona = signal<number>(0);
  estadoPersona = signal<string>("INACTIVO");
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
    }
  ]);
  tiposIdentificacion = signal<Combo[]>([
    { codigo: "C", etiqueta: "Cédula" },
    { codigo: "R", etiqueta: "RUC" },
    { codigo: "P", etiqueta: "Pasaporte" },
  ]);

  //FORMULARIO
  public dataForm = this.fb.group({
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
    nombreTipoPersona: ['']
  }, {
    updateOn: 'blur'
  });

  get currentData(): Personas {
    const persona = this.dataForm.getRawValue() as Personas;
    return persona;
  }

  get tipoPersonaActual(): string | null | undefined {
    return this.dataForm.get('tipoPersona')?.value;
  }

  get razonSocialPersona(): string | null | undefined {
    return this.dataForm.get('razonSocial')?.value;
  }

  identificaciones = signal<Identificaciones[]>([]);

  ngOnInit(): void {
    this.dataForm.valueChanges.subscribe(persona => {
      if (this.loadingPersona()) {
        return;
      }
      if(persona.tipoPersona === 'N'){
        persona.razonSocial = persona.apellido1 + ' ' + persona.apellido2 + ' ' + persona.nombre1 + ' ' + persona.nombre2;
      }
      this.saveForm(persona as Personas);
    });

    this.cargaCombos();
    this.idPersona.set(Number(this.route.snapshot.paramMap.get('id')));
    this.cargaPersona(this.idPersona());
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

  //FUNCIONES DE CARGA DE DATOS
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

  //CARGA LOS DATOS DE LA PERSONA CONSULTADA
  cargaPersona(idPersona: number): void {
    this.loadingPersona.set(true);
    if (idPersona !== 0) {
      this.personasService.personaPorId(idPersona).subscribe({
        next: (resp) => {
          //ESTADO
          this.esActivo.set(resp.data.estadoPersona === "A" ? true : false);
          this.estadoPersona.set(resp.data.estadoPersona === "A" ? "ACTIVO" : "INACTIVO");
          resp.data.fechaNacimiento = this.funciones.convertirAFecha(resp.data.fechaNacimiento);
          //PEGA LOS DATOS EN EL FORMULARIO
          this.dataForm.reset(resp.data);
          this.loadingPersona.set(false);
        },
        error: (err) => {
          this.loadingPersona.set(false);
          this.toastService.showMessage("error", "Error", "Ha ocurrido un error al cargar los datos de la persona: " + err.error.message, err.error.status);
        }
      });
      //CARGA LAS IDENTIFICACIONES DE LA PERSONA CONSULTADA
      this.cargaIdentificaciones();
    }
  }

  //OPERACIONES
  //CREATE/UPDATE
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
  insertarIdentificacion(): void {
    const nueva: Identificaciones = {
      idIdentificacion: 0, // Id temporal negativo
      idPersona: this.idPersona(),   // o 0 si aún no existe
      idTipoIdentificacion: '',
      descripcionIdentificacion: '',
      fechaCaducidad: null,
      principalIdentificacion: 'N'
    };

    let mensaje = this.funciones.insertRow(
      this.identificaciones,
      nueva,
      'idIdentificacion',
      this.idPersona() !== 0,
      'btnGrdPer001020'
    );
    if (mensaje !== '') {
      this.toastService.showMessage("error", "Error", mensaje);
    }
  }
  cambiarEstado(estado: string): void {
    this.confirmationService.confirm({
      message: '¿Realmente desea cambiar el estado de esta persona?',
      header: 'Cambio de estado',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.esActivo.set(estado === "A" ? true : false);
        this.estadoPersona.set(estado === "A" ? "ACTIVO" : "INACTIVO");
        this.dataForm.patchValue({
          estadoPersona: estado
        });
      }
    });
  }
  //READ
  cargaIdentificaciones(): void {
    this.identificaciones.set([]);
    this.personasService.listaIdentificaciones(this.idPersona()).subscribe({
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
          this.identificaciones.set(this.identificaciones().filter(item => item.idIdentificacion != rowData.idIdentificacion));
        }
      });
    }
  }

}
