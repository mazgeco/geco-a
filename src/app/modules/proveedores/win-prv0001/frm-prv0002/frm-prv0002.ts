//Imports core
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
//Imports generales
import { Combo } from '../../../../interfaces/general.interface';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { Personas} from '../../../../interfaces/personas.interfaces';
import { EstadoProveedor,Proveedores} from '../../../../interfaces/proveedores.interfaces';


//Servicios propios
import { ToastService } from '../../../../services/toast.service';
import { MessageService } from '../../../../services/message.service';
import { PersonasService } from '../../../../services/personas.service';
import { ProveedoresService } from '../../../../services/proveedores.service';
import { FuntionsService } from '../../../../services/functions.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { StateService } from '../state-service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-frm-prv0002',
  imports: [...PRIMENG_MODULES, ReactiveFormsModule],
  providers: [ConfirmationService],
  templateUrl: './frm-prv0002.html',
  styleUrl: './frm-prv0002.css',
})
export class FrmPrv0002 implements OnInit {
  @Input()
  idProveedor!: number;

  /******************************************************************************************
   * DECLARACIÓN DE VARIABLES
   *******************************************************************************************/

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>('WinPrv0001');
  idObjeto = signal<string>('FrmPrv0002');
  idTabla = signal<string>('235');
  permiso = signal<string>('w');

  //Declaración variable tipo EstadoProveedor que es un enum para usar en el HTML
  readonly EstadoProveedor = EstadoProveedor;

  //INJECTIONS PUBLICAS
  funciones = inject(FuntionsService);
  stateService = inject(StateService);

  //INJECTIONS PRIVADAS
  private proveedoresService = inject(ProveedoresService);
  private personasService = inject(PersonasService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  //VARIABLES PARA EL MANEJO DE LOS MENSAJES
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  proveedorMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgFrmPrv0002'),
  );

  //DECLARACIÓN DE VARIABLES
  loadingProveedor = signal(true);
  estadoProveedor = signal<string>('INACTIVO');
  esActivo = signal<boolean>(false);
  personas = signal<Personas[]>([]);
  tipoPersonaCombo = signal<Combo[]>([
    {
      codigo: "N",
      etiqueta: "Natural"
    },
    {
      codigo: "J",
      etiqueta: "Jurídica"
    }
  ]);
  estadoCombo = signal<Combo[]>([
    {
      codigo: "A",
      etiqueta: "Activo"
    },
    {
      codigo: "I",
      etiqueta: "Inactivo"
    }
  ]);
  tipoIdentificacionCombo = signal<Combo[]>([
    {
      codigo: "05",
      etiqueta: "Cédula"
    },
    {
      codigo: "04",
      etiqueta: "RUC"
    },
    {
      codigo: "06",
      etiqueta: "Pasaporte"
    }
  ]);

  //GETTER PARA TRAER LOS DATOS ACTUALES DE LOS PRODUCTOS
  get currentData(): Proveedores{
    const proveedor = this.frmPrv0002.getRawValue() as Proveedores;
    return proveedor;
  }

  public frmPrv0002 = this.fb.group(
    {
      idProveedor: [0],
      idPersona: [0],
      razonSocial: [''],
      nombreComercial: [''],
      estadoProveedor: ['I'],
      tipoPersona: ['J'],
      email: [''],
      tipoIdentificacion: [''],
      identificacion: [''],
      telefono: [''],
      direccion: [''],
      idUsuarioCrea: [''],
      fechaCrea: [''],
      idUsuarioModifica: [''],
      fechaModifica: [''],
    },
    {
      updateOn: 'blur',
    },
  );

  ngOnInit(): void {
    this.cargaDatos();
  }

  cargaDatos(): void {
    if (this.idProveedor !== null && this.idProveedor !== 0) {
      this.loadingProveedor.set(true);
      this.proveedoresService.personaProveedorXIdProveedor(this.idProveedor).subscribe({
        next: (resp) => {
          this.frmPrv0002.reset(resp.data);
          this.loadingProveedor.set(false);
        },
        error: (err) => {
          this.toastService.showMessage(
            'error',
            'Error',
            'Ha ocurrido un error al cargar los datos: ' + err.error.message,
            err.error.status,
          );
        },
      });
    }
  }

    //MÉTODO QUE CAMBIA EL ESTADO DEL PRODUCTO   
         cambiarEstado(estado: EstadoProveedor): void {
           this.confirmationService.confirm({
             message: '¿Realmente desea cambiar el estado de este producto?',
             header: 'Cambio de estado',
             acceptLabel: 'Aceptar',
             rejectLabel: 'Cancelar',
             accept: () => {
               this.esActivo.set(estado === "A" ? true : false);
               this.estadoProveedor.set(estado === "A" ? "ACTIVO" : "INACTIVO");
               this.frmPrv0002.patchValue({
                 estadoProveedor: estado
               });
               this.stateService.proveedor.update(p => ({
                 ...p!,
                 estadoProducto: estado
               }));
             }
           });
         }

  // 2. Método para buscar la persona en tu backend mientras escribes
buscarPersona(event: any): void {
  const termino = event.query.trim();
  if (termino.length < 3) {
    this.personas.set([]);
    return;
  }
  
  // Llama a tu servicio de personas (ajusta el nombre del servicio)
  this.personasService.buscaPersona(termino).subscribe({
    next: (resp) => {
      this.personas.set(resp.data);
    },
    error: (err) => {
      this.toastService.showMessage('error', 'Error', 'No se pudo buscar la persona');
    }
  });
}

// 3. Método para capturar la selección y llenar el formulario
seleccionarPersona(event: any): void {
  // Como quitamos optionValue en el HTML, event.value trae el objeto completo de la persona
  const persona = event.value; 
  
  // Autocompletas automáticamente otros campos del formulario basándote en la persona elegida
  this.frmPrv0002.patchValue({
    // Ajusta las variables según tu interfaz de Persona y tu FormGroup
   idPersona: persona.idPersona,
  nombreComercial: persona.nombreComercial, 
  identificacion: persona.identificacion,
  tipoIdentificacion: persona.tipoIdentificacion === 'P' ? '06' : 
                      persona.tipoIdentificacion === 'C' ? '05' : 
                      persona.tipoIdentificacion === 'R' ? '04' : persona.tipoIdentificacion,
  tipoPersona: persona.tipoPersona,
  email: persona.correoElectronico, 
  telefono: persona.telefono,
  direccion: persona.direccion,
  estadoProveedor: persona.estadoPersona === 'A' ? 'A' : 'I', 
  });
}



}
