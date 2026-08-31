import { Component, computed, inject, Input, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { InsumoItinerario, TipoInsumo, ListaInsumo, ListaProveedores} from '../../../../interfaces/productos.interfaces';
import { FuntionsService } from '../../../../services/functions.service';
import { ProductosService } from '../../../../services/productos.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { MessageService } from '../../../../services/message.service';
import { ToastService } from '../../../../services/toast.service';
import { StateService } from '../state-service';
import { CommonModule } from '@angular/common'; // Necesario para [ngClass]
import { FormsModule } from '@angular/forms';   // Necesario para [(ngModel)]

@Component({
  selector: 'app-grd-prd0011',
  imports: [...PRIMENG_MODULES, CommonModule, FormsModule],
  templateUrl: './grd-prd0011.html',
  styles: ``,
})
export class GrdPrd0011  {

  @Input()
  idProducto!: string;

  modeloCobro: number = 1;
}
