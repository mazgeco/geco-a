//Imports core
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
//Imports generales
import { Combo } from '../../../../interfaces/general.interface';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { EstadoProducto, Productos, NombreTipoProducto, TipoBien, MedidaCalculoPrecio, Opcion, Temporadas} from '../../../../interfaces/productos.interfaces';

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
export class FrmPrd0003 implements OnInit {

   @Input()
  idProducto!: string;

  /******************************************************************************************
  * DECLARACIÓN DE VARIABLES
  *******************************************************************************************/

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>("WinPrd0006");
  idObjeto = signal<string>("FrmPrd0003");
  idTabla = signal<string>("211");
  permiso = signal<string>("w");

  
 

  // INJECTIONS PÚBLICAS Y PRIVADAS
  funciones = inject(FuntionsService);
  stateService = inject(StateService);
  private confirmationService = inject(ConfirmationService);
  private productosService = inject(ProductosService); // Cambiado a ProductosService
  private toastService = inject(ToastService);

   //VARIABLES PARA EL MANEJO DE LOS MENSAJES
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  productoMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgFrmPrd0003'),
  );

  temporada = signal<Temporadas[]>([]);
  temporadaSeleccionada = signal<number | null>(null);

  modeloCobro: number | null = null;

  get currentData() {
  // Construimos un objeto al vuelo con la información básica que ya posees
  return {
    idProducto: this.idProducto 
  };
}

  ngOnInit(): void {
    this.cargarTemporadas();
    
    if (this.idProducto && this.idProducto !== '0') {
    // Si el producto SÍ existe (es modo edición), entonces vamos a Java
      this.consultarTipoPrecio();
  }
  }

    // READ TIPOS PARA EL COMBOBOX
  cargarTemporadas(): void {
    this.productosService.listaTemporadas().subscribe({
      next: (resp) => {
        // 1. Guardamos los tipos en el Signal
        this.temporada.set(resp.data);

        const preferido = resp.data.find((t: Temporadas) => t.principalTemporada === 'S');
      if (preferido) {
        this.temporadaSeleccionada.set(preferido.idTemporada);
      }
      },
      error: (err) => {
        this.toastService.showMessage('error', 'Error', 'Error al cargar tipos: ' + err.error.message);
      }
    });
  }

  consultarTipoPrecio() {
  // Verificamos que tengamos un ID válido para buscar
  if (!this.idProducto) return;

  this.productosService.productoPorId(this.idProducto).subscribe({
    next: (respuesta) => {
      // Extraemos la letra que guardó la BD (asumiendo que viene en respuesta.data.tipoPrecio)
      const tipoPrecioBD = respuesta.data.tipoPrecio;

      // Marcamos el Radio Button según la letra recibida
      if (tipoPrecioBD === 'T') {
        this.modeloCobro = 1; // Marca el Modelo Estacional (Variable)
      } else if (tipoPrecioBD === 'F') {
        this.modeloCobro = 2; // Marca el Modelo de Tarifa Plana (Fijo)
      } else {
        this.modeloCobro = null; // Si aún no tiene precio asignado
      }
    },
    error: (err) => {
      this.toastService.showMessage('error', 'Error', 'No se pudo cargar el tipo de precio');
    }
  });
}

  autoguardarModelo(nuevoModelo: string | number) {
  // 1. Verificamos si el clic llegó al TypeScript
  console.log('🔄 1. Clic detectado. Ejecutando autoguardado del modelo a:', nuevoModelo);

  const tipoPrecioBD = nuevoModelo == 1 ? 'T' : 'F';
  const payloadUpdateParcial = { tipoPrecio: tipoPrecioBD };
  
  // ASEGÚRATE de que this.idProducto no esté undefined o vacío
  console.log('📦 2. Datos a enviar. ID Producto:', this.idProducto, 'Payload:', payloadUpdateParcial);

  // 3. Disparamos la petición
  this.productosService.actualizarTipoPrecio(this.idProducto, payloadUpdateParcial)
    .subscribe({
      next: (resp) => {
        console.log('✅ 3. ÉXITO: La base de datos respondió:', resp);
        this.messageService.mostrar(
          this.statusMessages,
          'msgFrmPrd0003',
          'success',
          'Dato grabado correctamente.'
        );
      },
      error: (err) => {
        console.error('❌ 3. ERROR: Falló la petición a Spring Boot:', err);
        this.toastService.showMessage('error', 'Error', 'No se pudo guardar el modelo de cobro.');
      }
    });
}



}
