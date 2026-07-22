import { Component, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Combo, Denominaciones, Identificaciones, Nacionalidades, Opcion, Paises, Personas, TipoEmpresas } from '../../../interfaces/personas.interfaces';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { PersonasService } from '../../../services/personas.service';
import { ToastService } from '../../../shared/toast.service';


@Component({
  selector: 'app-win-per0018',
  imports: [...PRIMENG_MODULES, DatePipe, NgClass, ReactiveFormsModule],
  templateUrl: './win-per0018.html',
  styleUrl: './win-per0018.css',
})
export class WinPer0018 implements OnInit {

  private route = inject(ActivatedRoute);
  private personasService = inject(PersonasService);
  private toastService = inject(ToastService);

  datoVer = signal<string>("general");
  idPersona = signal<number>(0);
  estadoPersona = signal<string>("INACTIVO");
  successfullySaved = signal(false);
  denominaciones = signal<Denominaciones[]>([]);
  nacionalidades = signal<Nacionalidades[]>([]);
  tipoEmpresas = signal<TipoEmpresas[]>([]);
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
  genero = signal<Combo[]>([
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
  esActivo: boolean = false;
  private fb = inject(FormBuilder);

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
    fechaNacimiento: [new Date()],
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
  });

  get currentData(): Personas {
    const persona = this.dataForm.value as Personas;
    return persona;
  }

  get tipoPersonaActual(): string | null | undefined {
    return this.dataForm.get('tipoPersona')?.value;
  }

  get razonSocialPersona(): string | null | undefined {
    return this.dataForm.get('razonSocial')?.value;
  }


  opciones: any[] = [
    { label: "Datos generales", value: 'general' },
    { label: "Identificaciones", value: 'identificaciones' },
    { label: "Direcciones", value: 'direcciones' },
    { label: "Teléfonos", value: 'telefonos' },
    { label: "Características", value: 'caracteristicas' },
    { label: "Ficha médica", value: 'ficha' }
  ];

  identificaciones = signal<Identificaciones[]>([
    {
      idIdentificacion: 1,
      idPersona: 1,
      idTipoIdentificacion: "C",
      descripcionIdentificacion: "1714361647",
      principalIdentificacion: "S",
      fechaCaducidad: new Date('2030-05-31'),
      idUsuarioCrea: "mgzapata",
      fechaCrea: new Date('2025-05-31'),
      idUsuarioModifica: "mgzapata",
      fechaModifica: new Date('2025-05-31')
    },
    {
      idIdentificacion: 2,
      idPersona: 1,
      idTipoIdentificacion: "R",
      descripcionIdentificacion: "1714361647001",
      principalIdentificacion: "N",
      fechaCaducidad: new Date('2030-05-31'),
      idUsuarioCrea: "mgzapata",
      fechaCrea: new Date('2025-05-31'),
      idUsuarioModifica: "mgzapata",
      fechaModifica: new Date('2025-05-31')
    }
  ]);

  ngOnInit(): void {

    //CARGA DENOMINCACIONES
    this.personasService.listaDenominaciones().subscribe({
      next: (resp) => {
        this.denominaciones.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage("error", "Error", "Ha ocurrido un error al cargar las denominaciones: " + err.error.message);
      }
    });

    //CARGA NACIONALIDADES
    this.personasService.listaNacionalidades().subscribe({
      next: (resp) => {
        this.nacionalidades.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage("error", "Error", "Ha ocurrido un error al cargar las denominaciones: " + err.error.message);
      }
    });

    //CARGA PAÍSES
    this.personasService.listaPaises().subscribe({
      next: (resp) => {
        this.paises.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage("error", "Error", "Ha ocurrido un error al cargar las denominaciones: " + err.error.message);
      }
    });

    //CARGA TIPO EMPRESAS
    this.personasService.listaTipoEmpresas().subscribe({
      next: (resp) => {
        this.tipoEmpresas.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage("error", "Error", "Ha ocurrido un error al cargar las denominaciones: " + err.error.message);
      }
    });


    //CARGA LOS DATOS DE LA PERSONA CONSULTADA
    this.idPersona.set(Number(this.route.snapshot.paramMap.get('id')));
    if (this.idPersona() !== 0) {
      this.personasService.personaPorId((this.idPersona())).subscribe({
        next: (resp) => {
          //ESTADO
          let estado = (resp.data.estadoPersona === "A" ? "ACTIVO" : "INACTIVO");
          this.esActivo = (resp.data.estadoPersona === "A" ? true : false);
          this.estadoPersona.set(estado);
          if (resp.data.fechaNacimiento && (typeof resp.data.fechaNacimiento === "string")) {
            resp.data.fechaNacimiento = this.convertirAFecha(resp.data.fechaNacimiento);
          }
          //PEGA LOS DATOS EN EL FORMULARIO
          this.dataForm.reset(resp.data);
        },
        error: (err) => {
          this.toastService.showMessage("error", "Error", "Ha ocurrido un error al cargar los datos de la persona: " + err.error.message);
        }
      });
    }
  }

  cambiaDatoVer(event: any): void {
    this.datoVer.set(event.value);
  }

  // Función para convertir YYYY-MM-DD a Date sin errores de zona horaria
  convertirAFecha(fechaStr: string): Date | null {
    if (!fechaStr) return null;
    const partes = fechaStr.split('-').map(Number); // [1978, 3, 2]
    // Nota: el mes en JS va de 0 a 11, por eso restamos 1
    return new Date(partes[0], partes[1] - 1, partes[2]);
  }

}
