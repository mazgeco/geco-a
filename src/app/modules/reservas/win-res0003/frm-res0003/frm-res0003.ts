import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs';
//Imports generales
import { Combo } from '../../../../interfaces/general.interface';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { CatalogDialogComponent } from '../../../../shared/catalog-dialog-component/catalog-dialog-component';
import { FuntionsService } from '../../../../services/functions.service';
import { CatalogService } from '../../../../services/catalog.service';
import { StateService } from '../../state-service';
@Component({
  selector: 'app-frm-res0003',
  imports: [...PRIMENG_MODULES, CatalogDialogComponent, ReactiveFormsModule],
  providers: [ConfirmationService, ReactiveFormsModule, CatalogDialogComponent],
  templateUrl: './frm-res0003.html',
  styleUrl: './frm-res0003.css',
})
export class FrmRes0003 {
  //LLAMADA AL ID Master
  @Input()
  idReserva!: number;

  /******************************************************************************************
   * DECLARACIÓN DE VARIABLES
   *******************************************************************************************/

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>('WinRes0003');
  idObjeto = signal<string>('FrmRes0003');
  idTabla = signal<string>('253');
  permiso = signal<string>('w');

  //INJECTIONS PUBLICAS
  funciones = inject(FuntionsService);
  stateService = inject(StateService);
  catalogService = inject(CatalogService);

  
}
