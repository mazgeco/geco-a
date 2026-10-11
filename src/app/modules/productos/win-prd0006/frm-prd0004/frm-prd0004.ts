//Imports core
import { Component, Input, signal, inject, computed, OnInit, ChangeDetectorRef, OnChanges, SimpleChanges} from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { GrdPrd0006 } from '../grd-prd0006/grd-prd0006';
import { ConfirmationService } from 'primeng/api';
import { ProductosService } from '../../../../services/productos.service';
//Imports generales
import { Combo } from '../../../../interfaces/general.interface';
import { DiaItinerario, IdiomaXItinerario, Productos} from '../../../../interfaces/productos.interfaces';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { debounceTime } from 'rxjs';
import { MessageService } from '../../../../services/message.service';
import { StatusMessage } from '../../../../interfaces/general.interface';
import { StateService } from '../state-service';
import { FuntionsService } from '../../../../services/functions.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-frm-prd0004',
  imports: [...PRIMENG_MODULES, ReactiveFormsModule, GrdPrd0006],
  providers: [ConfirmationService],
  templateUrl: './frm-prd0004.html',
  styleUrl: './frm-prd0004.css',
})
export class FrmPrd0004 implements OnInit, OnChanges {
   @Input()
  idProducto!: string;


   /******************************************************************************************
  * DECLARACIÓN DE VARIABLES
  *******************************************************************************************/

  //IDENTIFICADORES PRINCIPALES
  idContenedor = signal<string>("WinPrd0006");
  idObjeto = signal<string>("FrmPrd0004");
  idTabla = signal<string>("207");
  permiso = signal<string>("w");

 //INJECTIONS PUBLICAS
  funciones = inject(FuntionsService);
  stateService = inject(StateService);

  //INJECTIONS PRIVADAS
  private fb = inject(FormBuilder);
  private productosService = inject(ProductosService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private cdr = inject(ChangeDetectorRef);

  //VARIABLES PARA EL MANEJO DE LOS MENSAJES
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  productoMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgFrmPrd0004'),
  );

  //DECLARACIÓN DE VARIABLES
  // Controladores de la interfaz (Días)
  dias = signal<number[]>([1, 2]); // Empezamos con 2 días base
  diaActivo = signal<number>(1);      // Dejamos el día 1 activo 
  listaCompletaDias = signal<DiaItinerario[]>([]);
  // Guardará el ID real de la base de datos para pasárselo a la grilla
  idItinerarioActivo = signal<number>(0);
  idIdiomaXItinerarioActual: number | null = null;
  public cambioIdiomaManual: boolean = false;
  idiomaPorItinerario = signal<Combo[]>([
        {
          codigo: 'es',
          etiqueta: 'Español',
        },
        {
          codigo: 'en',
          etiqueta: 'Inglés',
        },
      ]);

  public frmPrd0004 = this.fb.group({
    idItinerario: [null as number | null],
    idProducto: [''],
    diaItinerario: [null as number | null],
    imagenItinerario: [''],
    idIdiomaXItinerario: [null],
    idIdioma: ['ES'], 
    descripcionItinerario: [''],
    origen: [null as string | null],
    destino: [null as string | null],
    actividad: [null as string | null],
    duracionItinerario: [null as string | null],
    tipoComidaIncluida: [[] as string[]],
    observaciones: [null as string | null],
    idUsuarioCrea: [''],
    fechaCrea: [''],
    idUsuarioModifica: [null as string | null],
    fechaModifica: [null as string | null]
  });

  // GETTER PARA TRAER LOS DATOS ACTUALES DEL ITINERARIO
  get currentData(): DiaItinerario {
       const diaItinerario = this.frmPrd0004.getRawValue() as DiaItinerario;
       return diaItinerario;
  }

  ngOnInit(): void {

    if (this.idProducto) {
      this.frmPrd0004.patchValue({ 
        idProducto: this.idProducto,
        diaItinerario: this.diaActivo()
      }, { emitEvent: false });
    }

    if (this.idProducto && this.idProducto !== '0') {
      console.log('¡Código recibido en la pestaña! Buscando itinerario para:', this.idProducto);
      this.cargarItinerarioDesdeBD();
    }

    this.frmPrd0004.valueChanges.pipe(
    debounceTime(500)
    ).subscribe((itinerario) => {
      console.log('Angular detectó cambios. Datos del form:', itinerario);
      if (itinerario.idProducto) { 
      console.log('ID del producto real es:', itinerario.idProducto);
      console.log('Autoguardando itinerario en segundo plano...', itinerario);
      // Llamamos a la función centralizada
      this.saveForm(itinerario as DiaItinerario); 
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Verificamos si el componente padre nos acaba de enviar un nuevo idProducto
    if (changes['idProducto'] && changes['idProducto'].currentValue) {
      const nuevoId = changes['idProducto'].currentValue;

      // Si el ID es válido y ya no es el '0' provisional, actualizamos el formulario silenciosamente
      if (nuevoId !== '0') {
        this.frmPrd0004.patchValue({
          idProducto: nuevoId
        }, { emitEvent: false }); 
        
        console.log('ID real recibido e inyectado en el formulario de itinerarios:', nuevoId);
      }
    }
  }

  cargarItinerarioDesdeBD(): void {
    this.productosService.itinerarioPorProducto(this.idProducto).subscribe({
      next: (respuesta) => {
        console.log('🔴 DATOS REALES DEL ITINERARIO:', respuesta);
        // 1. Extraemos el arreglo de 7 elementos que vimos en consola
        const listaItinerario = respuesta.data;
        if (listaItinerario && listaItinerario.length > 0) {
          // Agregamos la normalización aquí mismo:
          const diasNormalizados = listaItinerario.map((d: any) => 
          typeof d === 'object' && d !== null ? d : { diaItinerario: d, idItinerario: null }
          ).sort((a: any, b: any) => a.diaItinerario - b.diaItinerario);
          // Y guardamos la lista normalizada en tu señal:
          this.listaCompletaDias.set(diasNormalizados);
          // NUEVO: Guardamos la lista completa en la signal para no perder los IDs reales
          //this.listaCompletaDias.set(listaItinerario);
          this.seleccionarDia(listaItinerario[0].diaItinerario);
          // 2. Extraemos el número del día.
          const diasMapeados = listaItinerario.map((item: any) => item.diaItinerario);
          // 3. Limpiamos duplicados (por precaución) y ordenamos
          const diasUnicos = Array.from(new Set(diasMapeados)) as number[];
          const diasOrdenados = diasUnicos
            .filter(d => d !== undefined && d !== null)
            .sort((a, b) => a - b);
          // 4. Inyectamos los días reales a tu carrusel
          this.dias.set(diasOrdenados);
          // 5. Dejamos el primer día seleccionado por defecto y traemos sus datos
          if (diasOrdenados.length > 0) {
            const primerDia = diasOrdenados[0];
            this.diaActivo.set(primerDia);
            // Buscamos el ID real en la lista completa
            const primerDiaCompleto = listaItinerario.find((d: any) => d.diaItinerario === primerDia);
            if (primerDiaCompleto) {
              this.cargarDatosOperativos(primerDiaCompleto.idItinerario);
            }
          }
        } else {
          // 1. Sincronizamos tu memoria principal para que tu 'agregarDiaSecuencial' pueda leer el "1" y sacar el max() correctamente.
          this.listaCompletaDias.set([{ diaItinerario: 1, idItinerario: 0 }as any]);
          // 2. Pintamos el botón visual "1" en el carrusel
          this.dias.set([1]);
          // 3. Simulamos que el usuario hizo clic en el Día 1 para activar el formulario y que no salga en blanco
          this.seleccionarDia(1);
        }
      },
      error: (error) => {
        console.error('Error al intentar traer el itinerario:', error);
      }
    });
  }

  // =====================================================================
  // NUEVOS MÉTODOS PARA LA FICHA OPERATIVA
  // =====================================================================

  cargarDatosOperativos(idItinerario: number): void {
    if (!idItinerario || idItinerario === 0) return;
    this.idIdiomaXItinerarioActual = null;
    this.productosService.obtenerDatosOperativos(idItinerario).subscribe({
    next: (respuesta) => {
      const idiomaActual = this.frmPrd0004.get('idIdioma')?.value || 'es';
      const listaDatos = respuesta.data || [];
      
      let datosParaMostrar = listaDatos.find((item: any) => item.idIdioma === idiomaActual);

      // 👉 2. LA MAGIA: Si no encontró el idioma actual, pero SÍ hay datos guardados 
      // y NO fue un cambio manual (es decir, cargaste la página o cambiaste de día), 
      // entonces agarra el primer idioma que encuentre (ej. el Inglés).
      if (!datosParaMostrar && listaDatos.length > 0 && !this.cambioIdiomaManual) {
        datosParaMostrar = listaDatos[0];
      }

      if (datosParaMostrar) {
        this.idIdiomaXItinerarioActual = datosParaMostrar.idIdiomaXItinerario;
        const textoBD = datosParaMostrar.tipoComidaIncluida;
        const arrayComidas = textoBD ? textoBD.split(',').map((l: string) => l.trim()) : [];
        
        this.frmPrd0004.patchValue({
          idItinerario: datosParaMostrar.idItinerario,
          idIdioma: datosParaMostrar.idIdioma, // 👈 Actualiza el combo al idioma que encontró
          tipoComidaIncluida: arrayComidas,
          duracionItinerario: datosParaMostrar.duracionItinerario,
          descripcionItinerario: datosParaMostrar.descripcionItinerario,
          origen: datosParaMostrar.origen,
          destino: datosParaMostrar.destino,
          actividad: datosParaMostrar.actividad,
          observaciones: datosParaMostrar.observaciones,
          idUsuarioCrea: datosParaMostrar.idUsuarioCrea,
          fechaCrea: datosParaMostrar.fechaCrea,
          idUsuarioModifica: datosParaMostrar.idUsuarioModifica,
          fechaModifica: datosParaMostrar.fechaModifica
        }, { emitEvent: false });

      } else {
        // 👉 3. SI FUE CAMBIO MANUAL Y NO HAY DATOS: Limpiamos los campos 
        // pero DEJAMOS el combo quieto para que puedas empezar a escribir el nuevo idioma.
        this.idIdiomaXItinerarioActual = null;
        
        this.frmPrd0004.patchValue({
          idItinerario: idItinerario,
          idIdioma: idiomaActual,
          tipoComidaIncluida: [],
          duracionItinerario: null,
          descripcionItinerario: '',
          origen: '',
          destino: '',
          actividad: '',
          observaciones: ''
        }, { emitEvent: false });
      }
      // 👉 4. APAGAMOS LA BANDERA al terminar para la próxima vez
      this.cambioIdiomaManual = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      this.idIdiomaXItinerarioActual = null;
      this.cambioIdiomaManual = false; // Apagamos también si hay error
    }
  });
  }

  seleccionarDia(numeroDia: number): void {
    this.diaActivo.set(numeroDia);
    console.log('DÍA CLICKEADO:', numeroDia);
    console.log('BUSCANDO EN LA LISTA:', this.listaCompletaDias());
    this.idIdiomaXItinerarioActual = null;
    // Buscamos el objeto completo del día en la lista que trajo Java
    const diaEncontrado = this.listaCompletaDias().find((d: any) => Number(d.diaItinerario) === Number(numeroDia));
    console.log('DÍA ENCONTRADO:', diaEncontrado);
    if (diaEncontrado && diaEncontrado.idItinerario) {
      this.frmPrd0004.patchValue({
        idItinerario: diaEncontrado.idItinerario,
        diaItinerario: numeroDia
      }, { emitEvent: false });
      //  Actualizamos el Signal para avisarle a la grilla
      this.idItinerarioActivo.set(diaEncontrado.idItinerario);
      // cargamos sus datos operativos
      this.cargarDatosOperativos(diaEncontrado.idItinerario);
    } else {
      // Si el día no existe en la lista (es nuevo), LIMPIAMOS el formulario
      this.frmPrd0004.patchValue({
        idItinerario: null,          
        diaItinerario: numeroDia,    
        descripcionItinerario: '',    
        origen: '',
        destino: '',
        actividad: '',
        duracionItinerario: '',
        observaciones: '',
        tipoComidaIncluida: []
      }, { emitEvent: false });
      this.idItinerarioActivo.set(0); // Reseteamos el signal del ID
    }
  }

  alCambiarIdioma(nuevoIdioma: string): void {
  // 👉 1. ACTIVAMOS LA BANDERA PORQUE FUE UN CLIC MANUAL
  this.cambioIdiomaManual = true; 
  this.frmPrd0004.patchValue({ idIdioma: nuevoIdioma }, { emitEvent: false });
  const diaActual = this.diaActivo();
  if (diaActual) {
    this.seleccionarDia(diaActual);
  }
  }

  // ==========================================
  // LÓGICA DEL CARRUSEL DE DÍAS
  // ==========================================
 
  agregarDiaSecuencial() {
    // 1. Usamos la lista completa de objetos
    const diasActuales = this.listaCompletaDias() as any[];
    // 2. Encontrar el día mayor y sumarle 1
    let nuevoDia = 1; // Por defecto es 1 si la lista está vacía
    if (diasActuales && diasActuales.length > 0) {
      const numerosDias = diasActuales.map(d => Number(d.diaItinerario));
      nuevoDia = Math.max(...numerosDias) + 1;
    }
    // 3. Agregamos el nuevo día estructurado a la lista completa
    const nuevaLista = [...diasActuales, { diaItinerario: nuevoDia, idItinerario: null }];
    // 4. Actualizamos ambas señales para que ninguna se quede atrás
    this.listaCompletaDias.set(nuevaLista);
    this.dias.set(nuevaLista);
    this.diaActivo.set(nuevoDia);
    this.idItinerarioActivo.set(0);
    // 5. Limpiamos el formulario para el nuevo ingreso
    this.frmPrd0004.patchValue({
      idItinerario: null,
      diaItinerario: nuevoDia,
      descripcionItinerario: '',
      origen: '',
      destino: '',
      actividad: '',
      duracionItinerario: '',
      observaciones: '',
      tipoComidaIncluida: []
    }, { emitEvent: false });
    this.idIdiomaXItinerarioActual = null;
  }

  // EL GUARDADO CENTRAL (Ejecutado por el autoguardado)
  saveForm(itinerario: DiaItinerario): void {
    const idActual = this.frmPrd0004.get('idItinerario')?.value || '';
    this.productosService.grabaItinerario(itinerario).subscribe({
      next: (resp) => {
        console.log('Respuesta del guardado en Java:', resp);
        if (resp && resp.idSecuencial && (!idActual || idActual === 0)) {
          this.frmPrd0004.patchValue({ idItinerario: Number(resp.idSecuencial) }, { emitEvent: false });
          // Actualizamos el Signal activo para que la grilla y el sistema sepan qué día estamos tocando
          this.idItinerarioActivo.set(Number(resp.idSecuencial));
          // 3. Actualizamos la lista local de días para que el día 4 o 5 queden registrados formalmente
        const diaActual = Number(this.diaActivo()); 
        this.dias.update((lista: any[]) => {
          // Buscamos convirtiendo ambos a número por seguridad
          const index = lista.findIndex((d: any) => Number(d.diaItinerario) === diaActual);
          if (index >= 0) {
            // Si ya existe, actualizamos su ID
            lista[index].idItinerario = Number(resp.idSecuencial);
            return [...lista];
          } else {
            // Si no existía, lo agregamos oficialmente como objeto con su número e ID
            return [...lista, { diaItinerario: diaActual, idItinerario: Number(resp.idSecuencial) }];
          }
        });
        }
        this.messageService.mostrar(
          this.statusMessages,
          'msgFrmPrd0004',
          'success',
          'Dato grabado correctamente.'
        );
        // --- 4. GUARDADO DE TEXTOS (prd_idioma_x_itinerario) ---
        // Sacamos todos los valores del formulario reactivo porque ahí están los datos de ambas interfaces
        const formValues = this.frmPrd0004.getRawValue();
        if (formValues.idIdioma) {
          const dtoTextos: IdiomaXItinerario = {
            // Si ya tenemos un ID guardado en memoria, lo enviamos para que Java actualice. Si no, va en 0 para crear.
            idIdiomaXItinerario: this.idIdiomaXItinerarioActual ? this.idIdiomaXItinerarioActual : null,
            idIdioma: formValues.idIdioma,
            // idTipoInclusion: 0,
            idItinerario: resp.idSecuencial ? Number(resp.idSecuencial) : Number(idActual),
            descripcionItinerario: formValues.descripcionItinerario || '',
            origen: formValues.origen || '',
            destino: formValues.destino || '',
            actividad: formValues.actividad || '',
            tipoComidaIncluida: formValues.tipoComidaIncluida ? formValues.tipoComidaIncluida.join(', ') : null,
            duracionItinerario: formValues.duracionItinerario || '',
            observaciones: formValues.observaciones || ''
          };
          this.productosService.grabarTextosOperativos(dtoTextos).subscribe({
            next: (resTextos: any) => {
              console.log('Textos operativos guardados', resTextos);
                this.messageService.mostrar(
                this.statusMessages,
                'msgFrmPrd0004',
                'success',
                'Dato grabado correctamente.'
              );
              // Capturamos el ID que devuelve el backend (revisa si en tu respuesta viene como 'idNoSecuencial' o 'idSecuencial')
              const idGenerado = resTextos.idSecuencial || resTextos.idNoSecuencial;
              if (idGenerado) {
                this.idIdiomaXItinerarioActual = Number(idGenerado);
              }
            },
            error: (errTextos) => console.error('Error al guardar textos', errTextos)
          });
        }
      },
      error: (err) => {
      console.error('Error al grabar:', err);
    }
    });
  }

  eliminarDia(): void {
  const idParaBorrar = this.idItinerarioActivo();
  const numeroDiaActual = this.diaActivo(); // Necesitamos el número del día (ej. 4)

  // ESCENARIO 1: El día es nuevo (no está guardado en base de datos)
  if (!idParaBorrar || idParaBorrar === 0) {
    // Filtramos la lista para quitar el cuadrito actual
    const listaActual = this.listaCompletaDias() as any[];
    const listaActualizada = listaActual.filter(d => Number(d.diaItinerario) !== Number(numeroDiaActual));
    
    // Actualizamos las variables de la pantalla
    this.listaCompletaDias.set(listaActualizada);
    this.dias.set(listaActualizada);
    
    // Reseteamos las selecciones
    this.idItinerarioActivo.set(0);
    this.diaActivo.set(0);
    
    // Limpiamos el formulario (usando tu método patchValue)
    this.frmPrd0004.patchValue({
      idItinerario: null, diaItinerario: null, descripcionItinerario: '',
      origen: '', destino: '', actividad: '', duracionItinerario: '',
      observaciones: '', tipoComidaIncluida: []
    }, { emitEvent: false });

    // Opcional: mostrar un mensaje de que se quitó
    //this.toastService.showMessage('success', 'Éxito', 'El día se eliminó correctamente.', '');
    this.messageService.mostrar(this.statusMessages, 'msgFrmPrd0004', 'success', 'El día se eliminó correctamente.');
    return; // Detenemos la ejecución aquí, no llamamos al backend
  }

  // ESCENARIO 2: El día ya existe en la base de datos
  this.confirmationService.confirm({
    message: '¿Está seguro que desea eliminar este día y todos sus insumos?',
    header: 'Eliminar',
    //icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Aceptar',
    rejectLabel: 'Cancelar',
    //acceptButtonStyleClass: 'p-button-danger',
    accept: () => {
      // Tu código actual de borrado en base de datos
      this.productosService.eliminarItinerario(idParaBorrar, 'ADMIN').subscribe({
        next: (resp) => {
         // this.toastService.showMessage('success', 'Éxito', 'El día del itinerario se eliminó correctamente.', '');
         this.messageService.mostrar(this.statusMessages, 'msgFrmPrd0004', 'success', 'El día del itinerario se eliminó correctamente.');
         this.idItinerarioActivo.set(0); 
          this.cargarItinerarioDesdeBD(); // Asegúrate de que este sea el nombre correcto de tu método
        },
        error: (err) => {
          this.toastService.showMessage('error', 'Error', 'No se pudo eliminar el día.', err.error?.status || '');
        }
      });
    }
  });
}



}

