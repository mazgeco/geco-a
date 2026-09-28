//Imports core
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
//Imports generales
import { Combo } from '../../../../interfaces/general.interface';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { EstadoProveedor} from '../../../../interfaces/proveedores.interfaces';

//Servicios propios
import { ToastService } from '../../../../services/toast.service';
import { MessageService } from '../../../../services/message.service';
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
export class FrmPrv0002 {

  @Input()
  idProveedor!: number;

   /******************************************************************************************
  * DECLARACIÓN DE VARIABLES
  *******************************************************************************************/

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>("WinPrv0001");
  idObjeto = signal<string>("FrmPrv0002");
  idTabla = signal<string>("235");
  permiso = signal<string>("w");

  //Declaración variable tipo EstadoProveedor que es un enum para usar en el HTML
  readonly EstadoProveedor = EstadoProveedor;

  //INJECTIONS PUBLICAS
    funciones = inject(FuntionsService);
    stateService = inject(StateService);

  //INJECTIONS PRIVADAS
  private proveedoresService = inject(ProveedoresService);
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
    estadoProveedor = signal<string>("INACTIVO");
    //nombreTipoProveedor = signal<NombreTipoProveedor[]>([]);
    esActivo = signal<boolean>(false);

    // //GETTER PARA TRAER LOS DATOS ACTUALES DE LOS PRODUCTOS
    //      get currentData(): Proveedores {
    //        const proveedor = this.frmPrv0002.getRawValue() as Proveedores;
    //        return proveedor;
    //      }

}
