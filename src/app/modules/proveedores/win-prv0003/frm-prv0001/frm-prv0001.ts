//Imports core
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
//Imports generales
import { Combo } from '../../../../interfaces/general.interface';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { EstadoInsumo, Insumos, TipoInsumo } from '../../../../interfaces/proveedores.interfaces';

//Servicios propios
import { ToastService } from '../../../../services/toast.service';
import { MessageService } from '../../../../services/message.service';
import { FuntionsService } from '../../../../services/functions.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { StateService } from '../state-service';
import { debounceTime } from 'rxjs';
import { ProveedoresService } from '../../../../services/proveedores.service';
import { GrdPrv0004 } from '../grd-prv0004/grd-prv0004';
import { GrdPrv0002 } from '../grd-prv0002/grd-prv0002';

@Component({
  selector: 'app-frm-prv0001',
  imports: [...PRIMENG_MODULES, ReactiveFormsModule, GrdPrv0004, GrdPrv0002],
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
  private proveedoresService = inject(ProveedoresService);

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
  tipoInsumo = signal<TipoInsumo[]>([]);

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
      codigo: 'P',
      etiqueta: 'Publico',
    },
    {
      codigo: 'V',
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
  tipoPrecio = signal<Combo[]>([
    {
      codigo: 'L',
      etiqueta: 'Lista de precios',
    },
    {
      codigo: 'I',
      etiqueta: 'Inventario',
    },
  ]);
  unidadMedida = signal<Combo[]>([
    {
      codigo: 'un',
      etiqueta: 'Unidad',
    },
    {
      codigo: 'hab',
      etiqueta: 'Habitaciones',
    },
    {
      codigo: 'no',
      etiqueta: 'Noches',
    },
  ]);

  //GETTER PARA TRAER LOS DATOS ACTUALES DE LOS PRODUCTOS
  get currentData(): Insumos {
    const insumos = this.frmPrv0001.getRawValue() as Insumos;
    return insumos;
  }

  public frmPrv0001 = this.fb.group(
    {
      idInsumo: [0 as number | null],
      idTipoInsumo: [null as number | null],
      idTipoPresentacion: [null as number | null],
      idUnidadMedida: [null as string | null],
      porcionXMedida: [1 as number | null],
      descripcionInsumo: ['' as string | null],
      costoPresupuestado: [0 as number | null],
      costoPromedio: [0 as number | null],
      estadoInsumo: ['I' as string | null],
      individualGeneral: ['I' as string | null],
      publicoPrivado: ['P' as string | null],
      tipoPrecioInsumo: ['L' as string | null],
      observacionInsumo: ['' as string | null],
      tipoBien: ['B' as string | null],
      darAnticipo: ['N' as string | null],
      idUsuarioCrea: [null as string | null],
      fechaCrea: [null as string | null],
      idUsuarioModifica: [null as string | null],
      fechaModifica: [null as string | null],
    },
    {
      updateOn: 'blur',
    },
  );

  ngOnInit(): void {
    this.cargaCombos();
    this.cargaDatos();
  }

  cargaDatos(): void {
    if (this.idInsumo !== null && this.idInsumo !== 0) {
      this.loadingInsumo.set(true);
      this.proveedoresService.cargaInsumo(this.idInsumo).subscribe({
        next: (resp) => {
          this.frmPrv0001.reset(resp.data);
          this.loadingInsumo.set(false);
          this.stateService.proveedor.set(resp.data);
          this.esActivo.set(resp.data.estadoInsumo === 'A' ? true : false);
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

  cargaCombos(): void {
    this.proveedoresService.listaTipoInsumo().subscribe({
      next: (resp) => {
        this.tipoInsumo.set(resp.data);
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
