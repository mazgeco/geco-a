//Imports core
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
//Imports generales
import { Combo } from '../../../../interfaces/general.interface';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { EstadoInsumo, Insumos} from '../../../../interfaces/proveedores.interfaces';


//Servicios propios
import { ToastService } from '../../../../services/toast.service';
import { MessageService } from '../../../../services/message.service';
import { FuntionsService } from '../../../../services/functions.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { StateService } from '../state-service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-frm-prv0001',
  imports: [...PRIMENG_MODULES, ReactiveFormsModule],
  providers: [ConfirmationService],
  templateUrl: './frm-prv0001.html',
  styleUrl: './frm-prv0001.css',
})
export class FrmPrv0001 implements OnInit {
  @Input()
  idInsumo!: number;

  /******************************************************************************************
   * DECLARACIÓN DE VARIABLES
   *******************************************************************************************/

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>('WinPrv0003');
  idObjeto = signal<string>('FrmPrv0001');
  idTabla = signal<string>('205');
  permiso = signal<string>('w');

  //Declaración variable tipo EstadoInsumo que es un enum para usar en el HTML
  //readonly estadoInsumo = EstadoInsumo;

  //INJECTIONS PUBLICAS
  funciones = inject(FuntionsService);
  stateService = inject(StateService);

  //INJECTIONS PRIVADAS
 //private proveedoresService = inject(ProveedoresService);
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
  loadingInsumo = signal(true);
  EstadoInsumo = signal<string>('INACTIVO');
  esActivo = signal<boolean>(false);
  
    tipoBienCombo = signal<Combo[]>([
      {
        codigo: 'B',
        etiqueta: 'Bien',
      },
      {
        codigo: 'S',
        etiqueta: 'Servicio',
      },
    ]);
    publicoPrivado = signal<Combo[]>([
      {
        codigo: 'PU',
        etiqueta: 'Publico',
      },
      {
        codigo: 'P',
        etiqueta: 'Privado',
      },
    ]);
    individualGeneral = signal<Combo[]>([
      {
        codigo: 'I',
        etiqueta: 'Individual',
      },
      {
        codigo: 'G',
        etiqueta: 'General',
      },
    ]);
        cajaChica = signal<Combo[]>([
      {
        codigo: 'S',
        etiqueta: 'Si',
      },
      {
        codigo: 'N',
        etiqueta: 'No',
      },
    ]);
        darAnticipo = signal<Combo[]>([
      {
        codigo: 'S',
        etiqueta: 'Si',
      },
      {
        codigo: 'N',
        etiqueta: 'No',
      },
    ]);
      estadoInsumo = signal<Combo[]>([
    {
      codigo: 'A',
      etiqueta: 'Activo',
    },
    {
      codigo: 'I',
      etiqueta: 'Inactivo',
    },
  ]);

  //GETTER PARA TRAER LOS DATOS ACTUALES DE LOS PRODUCTOS
  get currentData(): Insumos{
    const insumos = this.frmPrv0001.getRawValue() as Insumos;
    return insumos;
  }

  public frmPrv0001 = this.fb.group(
    {

      idInsumo: [],
  idTipoInsumo: [],
  idTipoPresentacion: [],
  idUbicacionExistencia: [],
  idUnidadMedida: [],
  idProveedor: [],
  porcionXMedida: [],
  descripcionInsumo: [],
  costoPresupuestado: [],
  costoPromedio: [],
  idMonedaPresupuesto: [],
  estadoInsumo: [],
  individualGeneral: [],
  imagenInsumo: [],
  stockMaximo: [],
  stockMinimo: [],
  publicoPrivado: [],
  tipoPrecioInsumo: [],
  observacionInsumo: [],
  tipoBien: [],
  darAnticipo: [],
  codigoExterno: [],
  cajaChica: [],
  idUsuarioCrea: [],
  fechaCrea: [],
  idUsuarioModifica: [],
  fechaModifica: [],
    },
    {
      updateOn: 'blur',
    },
  );

  ngOnInit(): void {
   // this.cargaDatos();
  }  
}
