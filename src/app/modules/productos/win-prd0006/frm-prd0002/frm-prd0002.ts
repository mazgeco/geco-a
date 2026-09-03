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

@Component({
  selector: 'app-frm-prd0002',
  imports: [...PRIMENG_MODULES, ReactiveFormsModule],
  providers: [ConfirmationService],
  templateUrl: './frm-prd0002.html',
  styleUrl: './frm-prd0002.css',
})
export class FrmPrd0002 implements OnInit {
 @Input()
  idProducto!: string;

 /******************************************************************************************
  * DECLARACIÓN DE VARIABLES
  *******************************************************************************************/

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>("WinPrd0006");
  idObjeto = signal<string>("FrmPrd0002");
  idTabla = signal<string>("211");
  permiso = signal<string>("w");

  //Declaración variable tipo EstadoProducto que es un enum para usar en el HTML
  readonly EstadoProducto = EstadoProducto;

  //INJECTIONS PUBLICAS
    funciones = inject(FuntionsService);
    stateService = inject(StateService);

  //INJECTIONS PRIVADAS
  private productosService = inject(ProductosService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

   //VARIABLES PARA EL MANEJO DE LOS MENSAJES
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  productoMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgFrmPrd0002'),
  );

  //DECLARACIÓN DE VARIABLES
  loadingProducto = signal(true);
    estadoProducto = signal<string>("INACTIVO");
    nombreTipoProducto = signal<NombreTipoProducto[]>([]);
    esActivo = signal<boolean>(false);  
    opcionesTipoBien = signal<Combo[]>([
      {
        codigo: 'BIE',
        etiqueta: 'Bien',
      },
      {
        codigo: 'SRV',
        etiqueta: 'Servicio',
      },
    ]);
     opcionesCuentas = signal<Combo[]>([
      {
        codigo: 'BIE',
        etiqueta: 'Bien',
      },
      {
        codigo: 'SRV',
        etiqueta: 'Servicio',
      },
    ]);
     opcionesIndividualGeneral = signal<Combo[]>([
      {
        codigo: 'G',
        etiqueta: 'General',
      },
      {
        codigo: 'I',
        etiqueta: 'Individual',
      },
    ]);
      opcionesUnidadesMedida = signal<Combo[]>([
      {
        codigo: 'N',
        etiqueta: 'Noches',
      },
      {
        codigo: 'H',
        etiqueta: 'Horas',
      },
       {
        codigo: 'U',
        etiqueta: 'Unidades',
      },
       {
        codigo: 'M',
        etiqueta: 'Mililitros (ml)',
      },
       {
        codigo: 'R',
        etiqueta: 'Metros cuadrados (m2)',
      },
       {
        codigo: 'C',
        etiqueta: 'Metros cubicos (m3)',
      },
       {
        codigo: 'G',
        etiqueta: 'Global',
      },
    ]);
    opcionSN = signal<Combo[]>([
      {
        codigo: 'S',
        etiqueta: 'Si',
      },
      {
        codigo: 'N',
        etiqueta: 'No',
      },
    ]);
 
   

  //DECLARACIÓN DE LA VARIABLE PARA FORMULARIO
  public frmPrd0002 = this.fb.group({
  idProducto: [''],
  idTipoProducto: [''],
  nombreTipoProducto: [''],
  descripcionProducto: [null as string |null],
  nombreCorto: [''],
  capacidadMinima: [null as number | null],
  capacidadMaxima: [null as number | null],
  estadoProducto: [''], 
  tipoPrecio: [''],
  idCuenta: [{ value: null as string | null, disabled: true }],
  precioSinUtilidad: [null as number | null],
  porcentajeUtilidad: [null as number |null],
  individualGeneral: [''],
  seReserva: [''],
  medidaCalculoPrecio: [null as MedidaCalculoPrecio | null],
  cantidadInicial: [null as number | null],
  totalInicial: [null as number | null],
  bloqueaHorario: [''],
  dependeItinerario: [''],
  nroEspacios: [null as number | null],
  esEspacio: [''],
  seDivide: [''],
  comisionFija: [null as number | null],
  tipoBien: [null as TipoBien | null],
  cortaItinerario: [null as Opcion | null],
  notas: [null as string | null],
  destinoPrincipal: [null as string | null],
  idUsuarioCrea: [''],
  fechaCrea: [''],
  idUsuarioModifica: [null as string | null],
  fechaModifica: [null as string | null]
  }, {
    updateOn: 'blur'
  });

   /******************************************************************************************
    * GETTERS
    *******************************************************************************************/
  
    //GETTER PARA TRAER LOS DATOS ACTUALES DE LOS PRODUCTOS
     get currentData(): Productos {
       const producto = this.frmPrd0002.getRawValue() as Productos;
       return producto;
     }

 /******************************************************************************************
   * MÉTODOS QUE EJECUTAN LOS PROCESOS
   *******************************************************************************************/

  //MÉTODO QUE SE CARGA AL INICIALIZARCE EL OBJETO PRINCIPAL WinPer0018
  ngOnInit(): void {
 //Carga de datos de los combos
    this.cargaCombos();

    //Carga los datos del producto consultada
       this.cargaProducto(this.idProducto);


   // 1. EL AUTOGUARDADO (Replicando el estándar del sistema)
    this.frmPrd0002.valueChanges.pipe(
      debounceTime(500)
    ).subscribe((producto) => {
     
      // Solo guardamos si al menos ya seleccionaron un Tipo de Producto 
      if (producto.idTipoProducto) {
        console.log('Autoguardando en segundo plano...', producto);
        
        // ¡Llamamos a la función centralizada!
        this.saveForm(producto as Productos);
      }
    });
  }



  //MÉTODO QUE CARGA LOS DATOS PARA LOS COMBOS
  cargaCombos(): void {
 //Carga la lista de tipos de productos  
    this.productosService.listaTipoProducto().subscribe({
      next: (resp) => {
        console.log('Datos reales del backend:', resp.data);
        this.nombreTipoProducto.set(resp.data);
      },
      error: (err) => {
        this.toastService.showMessage(
          'error',
          'Error',
          'Ha ocurrido un error al cargar los tipos de productos: ' + err.error.message,
          err.error.status,
        );
      },
    });
  }
  //MÉTODO QUE CAMBIA EL ESTADO DEL PRODUCTO   
       cambiarEstado(estado: EstadoProducto): void {
         this.confirmationService.confirm({
           message: '¿Realmente desea cambiar el estado de este producto?',
           header: 'Cambio de estado',
           acceptLabel: 'Aceptar',
           rejectLabel: 'Cancelar',
           accept: () => {
             this.esActivo.set(estado === "A" ? true : false);
             this.estadoProducto.set(estado === "A" ? "ACTIVO" : "INACTIVO");
             this.frmPrd0002.patchValue({
               estadoProducto: estado
             });
             this.stateService.producto.update(p => ({
               ...p!,
               estadoProducto: estado
             }));
           }
         });
       }

    //FUNCIÓN QUE CARGA LOS DATOS DEL PRODUCTO CONSULTADO
  cargaProducto(idProducto: string): void {
    this.loadingProducto.set(true);
    if (idProducto !== '0' && idProducto !== null) {
      this.productosService.productoPorId(idProducto).subscribe({
        next: (resp) => {
          //ESTADO
          this.esActivo.set(resp.data.estadoProducto === 'A' ? true : false);
          this.estadoProducto.set(resp.data.estadoProducto === 'A' ? 'ACTIVO' : 'INACTIVO');
         
          //PEGA LOS DATOS EN EL FORMULARIO
          this.frmPrd0002.reset(resp.data);
          this.loadingProducto.set(false);
          this.stateService.producto.set(resp.data);
          //Muestra un mensaje en la barra indicando que el producto se cargó correctamente
          this.messageService.mostrar(
            this.statusMessages,
            'msgFrmPrd0002',
            'success',
            'Producto cargado correctamente.',
          );
        },
        error: (err) => {
          this.loadingProducto.set(false);
          //Muestra el error en la barra
          this.messageService.mostrar(
            this.statusMessages,
            'msgFrmPrd0002',
            'error',
            'El producto no se cargó correctamente.',
          );
          this.toastService.showMessage(
            'error',
            'Error',
            'Ha ocurrido un error al cargar los datos del producto: ' + err.error.message,
            err.error.status,
          );
        },
      });
    }else {
      this.stateService.producto.update((actual) => ({
        ...actual!,
        idProducto: '0',
        nombreCorto: '',
        estadoProducto: this.EstadoProducto.I,
      }));
    }
  }



  // 3. EL GUARDADO CENTRAL (Ejecutado por el autoguardado)
 saveForm(producto: Productos): void {
    const idActual = this.frmPrd0002.get('idProducto')?.value || '';

    this.productosService.grabaProducto(idActual, producto).subscribe({
      next: (resp) => {
        // --- 1. BLOQUE DE CREACIÓN NUEVA ---
        if (resp && resp.idNoSecuencial && (!idActual || idActual === '0' || idActual === '')) {
          this.idProducto = resp.idNoSecuencial;
          this.frmPrd0002.patchValue({ idProducto: resp.idNoSecuencial }, { emitEvent: false }); 
          this.router.navigate(['/productos/producto', resp.idNoSecuencial], { replaceUrl: true });
        } 

        // --- 2. ACTUALIZAR EL NOMBRE EN LA CABECERA ---
        this.stateService.producto.set(producto);

        // --- 3. MENSAJE EN EL TOOLBAR ---
        this.messageService.mostrar(
          this.statusMessages,
          'msgFrmPrd0002',
          'success',
          'Dato grabado correctamente.'
        );
      },
      error: (err) => {
        console.error('Error al grabar:', err);
      }
    });
  }
}



