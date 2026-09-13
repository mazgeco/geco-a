//Imports core
import { Component, Input, signal, inject, computed, OnInit, ChangeDetectorRef, OnChanges, SimpleChanges} from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { GrdPrd0006 } from '../grd-prd0006/grd-prd0006';
import {  FormGroup, FormArray } from '@angular/forms';
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
  
  //DECLARACIÓN DE LA VARIABLE PARA FORMULARIO
// public frmPrd0004 = this.fb.group({
//   idIdioma: ['es'],
//   idItinerario: [null as number | null],       
//   // idTipoInclusion: [null as number | null],
//   duracionItinerario: [null as string | null],
//    tipoComidaIncluida: [[] as string[]],
//   origen: [null as string | null],
//   destino: [null as string | null],
//   actividad: [null as string | null],
//   descripcion: [null as string | null],
//   observacion: [null as string | null]
// });

public frmPrd0004 = this.fb.group({
  // --- CAMPOS DE LA TABLA: prd_itinerario (Estructura) ---
  idItinerario: [null as number | null],
  idProducto: [''],
  diaItinerario: [null as number | null],
  imagenItinerario: [''],

  // --- CAMPOS DE LA TABLA: prd_idioma_x_itinerario (Textos/Operativos) ---
  idIdiomaXItinerario: [null],
  idIdioma: ['ES'], // Por ejemplo, un idioma por defecto
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
// get currentData(): DiaItinerario {
//   return this.frmPrd0004.getRawValue() as DiaItinerario;
// }
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
  
  // Validamos si ya existe el ID del producto maestro. 
  // OJO: Si idProducto está deshabilitado en el form, usa this.currentData.idProducto en su lugar.
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
          // Si el array viene vacío, limpiamos la pantalla
          this.dias.set([]);
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
      console.log('🔴 DATOS REALES DEL Idioma:', respuesta);
      const idiomaActual = this.frmPrd0004.get('idIdioma')?.value || 'es';
      const listaDatos = respuesta.data || [];

      let datosParaMostrar = listaDatos.find((item: any) => item.idIdioma === idiomaActual);

      if (!datosParaMostrar && listaDatos.length > 0) {
        datosParaMostrar = listaDatos[0];
      }

      if (datosParaMostrar) {
        // Inyectamos todo el DTO real al formulario
        this.idIdiomaXItinerarioActual = datosParaMostrar.idIdiomaXItinerario;
        const textoBD = datosParaMostrar.tipoComidaIncluida; // O como se llame la propiedad que viene del backend
        const arrayComidas: string[] = textoBD ? textoBD.split(',').map(letra => letra.trim()) : [];
        this.frmPrd0004.patchValue({
          idItinerario: datosParaMostrar.idItinerario,
          idIdioma: datosParaMostrar.idIdioma,
          // idTipoInclusion: datosParaMostrar.idTipoInclusion,
          tipoComidaIncluida: arrayComidas,
          duracionItinerario: datosParaMostrar.duracionItinerario,
          descripcionItinerario: datosParaMostrar.descripcionItinerario,
          origen: datosParaMostrar.origen,
          destino: datosParaMostrar.destino,
          actividad: datosParaMostrar.actividad,
          observaciones: datosParaMostrar.observaciones,
          // Agrega estos campos de auditoría aquí mismo:
  idUsuarioCrea: datosParaMostrar.idUsuarioCrea,
  fechaCrea: datosParaMostrar.fechaCrea,
  idUsuarioModifica: datosParaMostrar.idUsuarioModifica,
  fechaModifica: datosParaMostrar.fechaModifica
          
        }, { emitEvent: false });
      }else {
        // --- 2. SI NO EXISTE, LO RESETeamos A NULL PARA QUE CREE UNO NUEVO (POST) ---
        this.idIdiomaXItinerarioActual = null;
      }

      this.cdr.detectChanges();
    },
    error: (error) => {
      // Si el día no existe o da 404, aseguramos que el ID quede en null para crear uno nuevo con POST
      this.idIdiomaXItinerarioActual = null;
      console.log('Error al traer la ficha operativa (puede ser un día nuevo)', error);
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
      // 1. Asignamos el idItinerario al formulario
      this.frmPrd0004.patchValue({
        //idItinerario: diaEncontrado.idItinerario
        // ...diaEncontrado,
        idItinerario: diaEncontrado.idItinerario,
      diaItinerario: numeroDia
      }, { emitEvent: false });

      // 2. LO NUEVO: Actualizamos el Signal para avisarle a la grilla
      this.idItinerarioActivo.set(diaEncontrado.idItinerario);

      // 3. Y luego cargamos sus datos operativos
      this.cargarDatosOperativos(diaEncontrado.idItinerario);
    } else {
      // --- LA PIEZA QUE FALTABA ---
      // Si el día no existe en la lista (es nuevo), LIMPIAMOS el formulario
      this.frmPrd0004.patchValue({
        idItinerario: null,          // Fundamental: null para que Java haga un INSERT
        diaItinerario: numeroDia,    // Actualizamos al nuevo número de día (ej. 2)
        descripcionItinerario: '',    // Vaciamos el texto que haya quedado del día 1
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
  // 1. Obligamos al formulario a reconocer el nuevo idioma instantáneamente
  this.frmPrd0004.patchValue({ idIdioma: nuevoIdioma }, { emitEvent: false });
  
  // 2. Disparamos la búsqueda de los datos
  const diaActual = this.diaActivo();
  if (diaActual) {
    this.seleccionarDia(diaActual);
  }
}




  // ==========================================
  // LÓGICA DEL CARRUSEL DE DÍAS
  // ==========================================
 

  // agregarDiaSecuencial() {
  //   const diasActuales = this.dias();
  //   const nuevoDia = diasActuales.length + 1;
  //   this.dias.set([...diasActuales, nuevoDia]);
  //   this.diaActivo.set(nuevoDia); 
  //   // --- NUEVO: Limpiamos la memoria del formulario para el día entrante ---
  //   this.frmPrd0004.patchValue({
  //     idItinerario: null,        // VITAL: Al ser null, Java sabrá que debe crear un registro nuevo (INSERT)
  //     diaItinerario: nuevoDia,   // Actualizamos la variable interna al nuevo número de día (ej. 2)
  //     descripcionItinerario: '',  // Vaciamos el texto que haya quedado del día anterior
  //     origen: '',                   // Vacío
  //   destino: '',                  // Vacío
  //   actividad: '',                // Vacío -> ¡Aquí estaba el error, se quedaba con la del día 6!
  //   duracionItinerario: '',       // Vacío
  //   observaciones: '',            // Vacío
  //   tipoComidaIncluida: []        // Vacío
  //   }, { emitEvent: false });
  //   this.idIdiomaXItinerarioActual = null; // Limpiamos el ID del texto operativo anterior
  // this.idItinerarioActivo.set(0);       // Reseteamos el signal de la grilla de insumos
  // }

  agregarDiaSecuencial() {
  // 1. Usamos la lista completa de objetos
  const diasActuales = this.listaCompletaDias() as any[];
  const nuevodia = diasActuales.length + 1;
  
  // // 2. Agregamos el nuevo día estructurado a la lista completa
  // this.listaCompletaDias.set([
  //   ...diasActuales, 
  //   { dialitinerario: nuevodia, iditinerario: null }
  // ]);
  const nuevaLista = [...diasActuales, { diaItinerario: nuevodia, idItinerario: null }];
  
  // Actualizamos ambas señales para que ninguna se quede atrás
  this.listaCompletaDias.set(nuevaLista);
  this.dias.set(nuevaLista);
  
  this.diaActivo.set(nuevodia);
  this.idItinerarioActivo.set(0);
  
  this.frmPrd0004.patchValue({
    idItinerario: null,
    diaItinerario: nuevodia,
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

  // 3. EL GUARDADO CENTRAL (Ejecutado por el autoguardado)
 saveForm(itinerario: DiaItinerario): void {
    const idActual = this.frmPrd0004.get('idItinerario')?.value || '';

    this.productosService.grabaItinerario(itinerario, 'ADMIN').subscribe({
      next: (resp) => {
        console.log('Respuesta del guardado en Java:', resp);
       
      if (resp && resp.idNoSecuencial && (!idActual || idActual === 0)) {
        // this.idItinerario = resp.idItinerario; // (Descomenta si usas esta variable local)
        this.frmPrd0004.patchValue({ idItinerario: Number(resp.idNoSecuencial) }, { emitEvent: false });
        // 2. Actualizamos el Signal activo para que la grilla y el sistema sepan qué día estamos tocando
        this.idItinerarioActivo.set(Number(resp.idNoSecuencial));
        // 3. ¡AQUÍ! Actualizamos la lista local de días para que el día 4 o 5 queden registrados formalmente
  
    const diaActual = Number(this.diaActivo()); 
this.dias.update((lista: any[]) => {
  // Buscamos convirtiendo ambos a número por seguridad
  const index = lista.findIndex((d: any) => Number(d.diaItinerario) === diaActual);

  if (index >= 0) {
    // Si ya existe, actualizamos su ID
    lista[index].idItinerario = Number(resp.idNoSecuencial);
    return [...lista];
  } else {
    // Si no existía, lo agregamos oficialmente como objeto con su número e ID
    return [...lista, { diaItinerario: diaActual, idItinerario: Number(resp.idNoSecuencial) }];
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
        // --- 4. GUARDADO DE TEXTOS (prd_idioma_x_itinerario) ---
        const formValues = this.frmPrd0004.getRawValue();

        if (formValues.idIdioma) {
          
          const dtoTextos: IdiomaXItinerario = {
            // Si ya tenemos un ID guardado en memoria, lo enviamos para que Java actualice. Si no, va en 0 para crear.
            idIdiomaXItinerario: this.idIdiomaXItinerarioActual ? this.idIdiomaXItinerarioActual : null,
            idIdioma: formValues.idIdioma,
            // idTipoInclusion: 0,
            idItinerario: resp.idNoSecuencial ? Number(resp.idNoSecuencial) : Number(idActual),
            descripcionItinerario: formValues.descripcionItinerario || '',
            origen: formValues.origen || '',
            destino: formValues.destino || '',
            actividad: formValues.actividad || '',
            tipoComidaIncluida: formValues.tipoComidaIncluida ? formValues.tipoComidaIncluida.join(', ') : null,
            duracionItinerario: formValues.duracionItinerario || '',
            observaciones: formValues.observaciones || ''
          };

          this.productosService.grabarTextosOperativos(dtoTextos, 'ADMIN').subscribe({
            next: (resTextos: any) => {
              console.log('Textos operativos guardados', resTextos);
            
                     this.messageService.mostrar(
                      this.statusMessages,
                    'msgFrmPrd0004',
                    'success',
                    'Dato grabado correctamente.'
        );
              // Capturamos el ID que devuelve el backend (revisa si en tu respuesta viene como 'idNoSecuencial' o 'idSecuencial')
              const idGenerado = resTextos.idNoSecuencial || resTextos.idSecuencial;
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

// eliminarDia(): void {
//     // 1. Obtenemos el registro actual de la pantalla
//     const diaActual = this.currentData();

//     // 2. Validamos que realmente exista un ID (para no intentar borrar un día que aún no se guarda)
//     if (!diaActual || !diaActual.idItinerario) {
//       console.warn('No hay un día válido seleccionado para eliminar.');
//       return;
//     }

//     // 3. Pedimos confirmación al usuario (buena práctica para evitar accidentes)
//     if (confirm(`¿Estás seguro de que deseas eliminar la planificación del Día ${diaActual.diaItinerario}?`)) {
      
//       // TODO: Aquí debes poner el usuario real que está logueado en el sistema. 
//       // Por ahora usaré 'ddiaz' basándome en tu base de datos.
//       const idUsuario = 'ddiaz'; 

//       // 4. Llamamos al servicio que acabamos de crear
//       this.productoService.eliminarItinerario(diaActual.idItinerario, idUsuario).subscribe({
//         next: (respuesta) => {
//           console.log('Día eliminado correctamente', respuesta);
          
//           // 5. Recargamos la lista desde Java para que desaparezca el cuadrito azul del día borrado
//           this.cargarItinerarioDesdeBD();
          
//           // Aquí también podrías agregar un Toast de PrimeNG indicando "Eliminado con éxito"
//         },
//         error: (error) => {
//           console.error('Error al intentar eliminar el día', error);
//         }
//       });
//     }
//   }



}

