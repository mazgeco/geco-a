//Imports core
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
//Imports generales
import { Combo } from '../../../../interfaces/general.interface';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { EstadoProducto, Productos, NombreTipoProducto, TipoBien, MedidaCalculoPrecio, Opcion} from '../../../../interfaces/productos.interfaces';

//Servicios propios
import { ToastService } from '../../../../services/toast.service';
import { MessageService } from '../../../../services/message.service';
import { ProductosService } from '../../../../services/productos.service';
import { FuntionsService } from '../../../../services/functions.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { StateService } from '../state-service';
import { debounceTime } from 'rxjs';
import { CommonModule } from '@angular/common'; // Necesario para [ngClass]
import { FormsModule } from '@angular/forms';
import { GrdPrd0011 } from "../grd-prd0011/grd-prd0011";   // Necesario para [(ngModel)]


@Component({
  selector: 'app-frm-prd0003',
  imports: [...PRIMENG_MODULES, ReactiveFormsModule, CommonModule, FormsModule, GrdPrd0011],
  providers: [ConfirmationService],
  templateUrl: './frm-prd0003.html',
  styleUrl: './frm-prd0003.css',
})
export class FrmPrd0003 {

   @Input()
  idProducto!: string;


  modeloCobro: number = 1;
}
