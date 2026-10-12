import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { ListaTipoProductoResponse, ListaProductosResponse, ProductoResponse, ItinerarioResponse, RespuestaIdiomaItinerario, Productos, DiaItinerario, InsumoItinerario, InsumoItinerarioResponse, IdiomaXItinerario, Operacion, ListaOperacionResponse, UnidadEstrategica, ListaUnidadEstrategicaResponse, Temporadas, ListaTemporadasResponse, ListaPrecioProductoResponse, GraficosResponse, TipoOperacionResponse, Impuesto, ImpuestoResponse, ImpuestoProducto, ImpuestosProductoResponse, TipoProducto,TipoProductoResponse, TarifaFila} from '../interfaces/productos.interfaces';
import { SavedRow } from '../interfaces/general.interface'

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  //private idUsuario = "mparraga";
  private authService = inject(AuthService);
 
    // buscaProducto(nombre: string): Observable<ListaProductosResponse> {
    // return this.http.get<ListaProductosResponse>(`${this.apiUrl}productos/busqueda?nombre=${nombre}`)
    // }

  buscaProducto(nombre: string): Observable<ListaProductosResponse> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<ListaProductosResponse>(`${this.apiUrl}productos/busqueda`, { params });
  }

  listaProductos(): Observable<ListaProductosResponse> {
    return this.http.get<ListaProductosResponse>(`${this.apiUrl}productos`);
  }
  
  productoPorId(idProducto: string): Observable<ProductoResponse> {
      return this.http.get<ProductoResponse>(`${this.apiUrl}productos/${idProducto}`)
  }

  itinerarioPorProducto(idProducto: string): Observable<ItinerarioResponse> {
    const params = new HttpParams().set('idProducto', idProducto);
    return this.http.get<ItinerarioResponse>(`${this.apiUrl}productos/itinerarios`, { params });
  }
   

  listaTipoProducto(): Observable<ListaTipoProductoResponse> {
    return this.http.get<ListaTipoProductoResponse>(`${this.apiUrl}productos/tipoproductos`);
  }

  obtenerDatosOperativos(idItinerario: number): Observable<RespuestaIdiomaItinerario> {
    return this.http.get<RespuestaIdiomaItinerario>(`${this.apiUrl}productos/${idItinerario}/idiomasxitinerarios`);
  }

  grabaProducto(idProducto: string, producto: Productos): Observable<SavedRow> {
    let graba = true;

    if (graba) {
      // Si el producto es nuevo (su ID es '0' o viene vacío)
      if (idProducto === '0' || idProducto === '') {
        // Mantenemos el ID como string vacío respetando tu interfaz estricta
        producto.idProducto = ''; 
        // Enviamos el POST para que el backend inserte y devuelva el nuevo código
        return this.http.post<SavedRow>(`${this.apiUrl}productos/${this.authService.idUsuario()}`, producto);
      } else {
        
        // Si ya tiene un código (ej. ADL001), se procesa como una actualización (PUT)
        const params = new HttpParams().set('idProducto', idProducto);
        return this.http.put<SavedRow>(`${this.apiUrl}productos/${this.authService.idUsuario()}`, producto, {
          params,
        }); 
      }
    }
    // Retorno por defecto en caso de que 'graba' sea false
    return of({
      status: 'NOT_FOUND',
      message: 'Datos incompletos',
      // Devolvemos 0 para satisfacer la interfaz y evitar el error de TypeScript
      // ya que convertir un texto como "ADL001" a número daría NaN
    //   idSecuencial: 0 
    } as SavedRow);
  }


 // ==========================================
  // MÉTODOS PARA LA TABLA DE INSUMOS X ITINERARIO
  // ==========================================

// ==========================================
  // CATÁLOGOS PARA LOS COMBOS
  // ==========================================
  
  listaTiposInsumos() {
    // Agregamos /productos/ para completar la ruta del controlador en Spring Boot
    return this.http.get<any>(`${this.apiUrl}productos/tipoinsumos/listatodo`); 
  }
  // Catálogo general para llenar el combo de insumos
 listaInsumos() {
    return this.http.get<any>(`${this.apiUrl}productos/insumos`);
  }

  listaProveedores() {
    return this.http.get<any>(`${this.apiUrl}proveedores`);
  }

grabaItinerario(itinerario: DiaItinerario): Observable<SavedRow> {
  if (!itinerario.idItinerario) {
    // POST (Nuevo): Envía el usuario en la url y el objeto en el body
    return this.http.post<SavedRow>(`${this.apiUrl}productos/${this.authService.idUsuario()}/itinerarios`, itinerario);
  } else {
    // PUT (Actualizar): Envía el usuario en la url y el idItinerario como QueryParam
    return this.http.put<SavedRow>(
      `${this.apiUrl}productos/${this.authService.idUsuario()}/itinerarios?idItinerario=${itinerario.idItinerario}`, 
      itinerario
    );
  }
}

// Guardado o actualización de textos operativos para la segunda tabla (prd_idioma_x_itinerario)
  grabarTextosOperativos(idiomaXItinerario: IdiomaXItinerario): Observable<SavedRow> {
    if (!idiomaXItinerario.idIdiomaXItinerario || idiomaXItinerario.idIdiomaXItinerario === 0) {
      // POST (Nuevo): Cuando no tiene ID, crea el registro
      return this.http.post<SavedRow>(`${this.apiUrl}productos/${this.authService.idUsuario()}/idiomasxitinerarios`, idiomaXItinerario);
    } else {
      // PUT (Actualizar): Cuando ya tiene ID, actualiza enviándolo por query param (o como lo maneje el backend)
      return this.http.put<SavedRow>(
        `${this.apiUrl}productos/${this.authService.idUsuario()}/idiomasxitinerarios?idIdiomaXItinerario=${idiomaXItinerario.idIdiomaXItinerario}`,
        idiomaXItinerario
      );
    }
  }


  // Lee los insumos de un itinerario (día) específico
  // OJO: El backend pide idItinerario por Query Param
//  listaInsumosPorItinerario(idItinerario: number) {
//     // Le quitamos el '/' inicial y le agregamos 'productos/'
//     return this.http.get<any>(`${this.apiUrl}productos/insumosxitinerario/itinerario?idItinerario=${idItinerario}`);
//   }

  listaInsumosPorItinerario(idItinerario: number): Observable<InsumoItinerarioResponse> {
      return this.http.get<InsumoItinerarioResponse>(`${this.apiUrl}productos/insumosxitinerario/itinerario?idItinerario=${idItinerario}`);
    }
  

  // Inserta o actualiza un insumo
  // grabaInsumoItinerario(insumo: InsumoItinerario, idUsuario: string) {
  //   if (insumo.idInsumoXItinerario === 0) {
  //      insumo.idInsumoXItinerario = null;
  //     // POST (Nuevo): Pasamos el idUsuario en la URL
  //     return this.http.post<any>(`${this.apiUrl}productos/insumosxitinerario/${idUsuario}`, insumo);
  //   } else {
  //     // PUT (Actualizar): Pasamos idUsuario en URL y el idInsumoXItinerario como Query Param
  //     return this.http.put<any>(
  //       `${this.apiUrl}productos/insumosxitinerario/${idUsuario}?idInsumoXItinerario=${insumo.idInsumoXItinerario}`, 
  //       insumo
  //     );
  //   }
  // }

   grabaInsumoItinerario(insumo: InsumoItinerario, nuevaFila: boolean): Observable<SavedRow> {
        if (nuevaFila) {
          insumo.idInsumoXItinerario = null;
          return this.http.post<SavedRow>(
            `${this.apiUrl}productos/insumosxitinerario/${this.authService.idUsuario()}`,
            insumo,
          );
        } else {
          const params = new HttpParams().set('idInsumoXItinerario', insumo.idInsumoXItinerario!);
          return this.http.put<SavedRow>(
            `${this.apiUrl}productos/insumosxitinerario/${this.authService.idUsuario()}`,
            insumo,
            { params },
          );
        }
      }



  eliminaInsumoItinerario(idInsumoXItinerario: number): Observable<SavedRow> {
    const params = new HttpParams().set('idInsumoXItinerario', idInsumoXItinerario!);
    return this.http.delete<SavedRow>(`${this.apiUrl}productos/insumosxitinerario/${this.authService.idUsuario()}`, {
      params,
    });
  }

  // Asegúrate de importar Observable desde 'rxjs'
  eliminarItinerario(idItinerario: number, idUsuario: string): Observable<any> {
    const url = `${this.apiUrl}productos/${this.authService.idUsuario()}/itinerarios?idItinerario=${idItinerario}`;
    return this.http.delete(url);
  }

   listaOperaciones(): Observable<ListaOperacionResponse> {
      return this.http.get<ListaOperacionResponse>(`${this.apiUrl}productos/operaciones`);
    }

   grabaOperacion(operacion: Operacion, nuevaFila: boolean): Observable<SavedRow> {
        if (nuevaFila) {
          operacion.idOperacion = null;
          return this.http.post<SavedRow>(
            `${this.apiUrl}productos/${this.authService.idUsuario()}/operaciones`,
            operacion,
          );
        } else {
          const params = new HttpParams().set('idOperacion', operacion.idOperacion!);
          return this.http.put<SavedRow>(
            `${this.apiUrl}productos/${this.authService.idUsuario()}/operaciones`,
            operacion,
            { params },
          );
        }
      }

    eliminaOperacion(idOperacion: number): Observable<SavedRow> {
    const params = new HttpParams().set('idOperacion', idOperacion);
    return this.http.delete<SavedRow>(`${this.apiUrl}productos/${this.authService.idUsuario()}/operaciones`, {
      params,
    });
  }



   listaUnidadEstrategica(): Observable<ListaUnidadEstrategicaResponse> {
      return this.http.get<ListaUnidadEstrategicaResponse>(`${this.apiUrl}productos/unidadesestrategicas`);
    }

   grabaUnidadEstrategica(unidad: UnidadEstrategica, nuevaFila: boolean): Observable<SavedRow> {
        if (nuevaFila) {
          unidad.idUnidadEstrategica = null;
          return this.http.post<SavedRow>(
            `${this.apiUrl}productos/${this.authService.idUsuario()}/unidadesestrategicas`,
            unidad,
          );
        } else {
          const params = new HttpParams().set('idUnidadEstrategica', unidad.idUnidadEstrategica!);
          return this.http.put<SavedRow>(
            `${this.apiUrl}productos/${this.authService.idUsuario()}/unidadesestrategicas`,
            unidad,
            { params },
          );
        }
      }

  eliminaUnidadEstrategica(idUnidadEstrategica: number): Observable<SavedRow> {
    const params = new HttpParams().set('idUnidadEstrategica', idUnidadEstrategica);
    return this.http.delete<SavedRow>(`${this.apiUrl}productos/${this.authService.idUsuario()}/unidadesestrategicas`, {
      params,
    });
  }


   listaTemporadas(): Observable<ListaTemporadasResponse> {
      return this.http.get<ListaTemporadasResponse>(`${this.apiUrl}productos/temporadas`);
    }

   grabaTemporada(temporada: Temporadas, nuevaFila: boolean): Observable<SavedRow> {
        if (nuevaFila) {
          temporada.idTemporada = null;
          return this.http.post<SavedRow>(
            `${this.apiUrl}productos/${this.authService.idUsuario()}/temporadas`,
            temporada,
          );
        } else {
          const params = new HttpParams().set('idTemporada', temporada.idTemporada!);
          return this.http.put<SavedRow>(
            `${this.apiUrl}productos/${this.authService.idUsuario()}/temporadas`,
            temporada,
            { params },
          );
        }
      }

  eliminaTemporada(idTemporada: number): Observable<SavedRow> {
    const params = new HttpParams().set('idTemporada', idTemporada);
    return this.http.delete<SavedRow>(`${this.apiUrl}productos/${this.authService.idUsuario()}/temporadas`, {
      params,
    });
  }

  // En tu productos.service.ts
  actualizarTipoPrecio(idProducto: string, payload: any): Observable<any> {
  const url = `${this.apiUrl}productos/${this.authService.idUsuario()}?idProducto=${idProducto}`;
  return this.http.put(url, payload);
  }

  listaPreciosProductos(idProducto: string, idTemporada: number): Observable<ListaPrecioProductoResponse> {
  return this.http.get<ListaPrecioProductoResponse>(`${this.apiUrl}productos/preciosproductoxtemporada/productotemporada?idProducto=${idProducto}&idTemporada=${idTemporada}`);
  }

  graficoProductosEstado(): Observable<GraficosResponse> {
      return this.http.get<GraficosResponse>(`${this.apiUrl}productos/grafico/estado`);
  }

  graficoProductosTipoPrecio(): Observable<GraficosResponse> {
      return this.http.get<GraficosResponse>(`${this.apiUrl}productos/grafico/tipoprecio`);
    }
  
  graficoProductosTipoProducto(): Observable<GraficosResponse> {
      return this.http.get<GraficosResponse>(`${this.apiUrl}productos/grafico/tipoproducto`);
    }

  listaTiposOperacionXempresa(): Observable<TipoOperacionResponse> {
    return this.http.get<TipoOperacionResponse>(`${this.apiUrl}productos/tiposoperacionxempresa`);
  }

  cargaImpuestos(): Observable<ImpuestoResponse> {
    return this.http.get<ImpuestoResponse>(`${this.apiUrl}productos/impuestos`);
  }

  grabaImpuesto(impuesto: Impuesto, nuevaFila: boolean): Observable<SavedRow> {
        if (nuevaFila) {
         // impuesto.idImpuesto = '';
          return this.http.post<SavedRow>(
            `${this.apiUrl}productos/${this.authService.idUsuario()}/impuestos`,
            impuesto,
          );
        } else {
          const params = new HttpParams().set('idImpuesto', impuesto.idImpuesto!);
          return this.http.put<SavedRow>(
            `${this.apiUrl}productos/${this.authService.idUsuario()}/impuestos`,
            impuesto,
            { params },
          );
        }
      }
  eliminaImpuesto(idImpuesto: string): Observable<SavedRow> {
    const params = new HttpParams().set('idImpuesto', idImpuesto!);
    return this.http.delete<SavedRow>(`${this.apiUrl}productos/${this.authService.idUsuario()}/impuestos`, {
      params,
    });
  }

  obtenerImpuestosActivos(): Observable<ImpuestoResponse> {
    return this.http.get<ImpuestoResponse>(`${this.apiUrl}productos/impuestos/activos`);
  }

  obtenerImpuestosPorProducto(idProducto: string) {
    return this.http.get<ImpuestosProductoResponse>(`${this.apiUrl}productos/${idProducto}/impuestosxproductos`);
  }

  grabaImpuestoProducto(impuesto: ImpuestoProducto, idUsuario: string): Observable<SavedRow> {
      if (!impuesto.idImpuestoXProducto || impuesto.idImpuestoXProducto === 0) {
    // POST (Nuevo): Envía el usuario en la url y el objeto en el body
    return this.http.post<SavedRow>(`${this.apiUrl}productos/${this.authService.idUsuario()}/impuestosxproductos`, impuesto);
  } else {
    // PUT (Actualizar): Envía el usuario en la url y el idItinerario como QueryParam
    return this.http.put<SavedRow>(
      `${this.apiUrl}productos/${this.authService.idUsuario()}/impuestosxproductos?idImpuestoXProducto=${impuesto.idImpuestoXProducto}`,
      impuesto
    );
  } 
}

eliminaImpuestoProducto(idImpuestoXProducto: number, idUsuario: string): Observable<any> {
  return this.http.delete<any>(
    `${this.apiUrl}productos/${this.authService.idUsuario()}/impuestosxproductos?idImpuestoXProducto=${idImpuestoXProducto}`
  );
}

cargarTipoProducto(): Observable<TipoProductoResponse> {
      return this.http.get<TipoProductoResponse>(`${this.apiUrl}productos/tipoproductos`);
    }

    eliminaTipoProducto(idTipoProducto: string): Observable<SavedRow> {
    const params = new HttpParams().set('idTipoProducto', idTipoProducto!);
    return this.http.delete<SavedRow>(`${this.apiUrl}productos/${this.authService.idUsuario()}/tipoproductos`, {
      params,
    });
  }

   

 grabaTipoProducto(TipoProducto: TipoProducto, nuevaFila: boolean): Observable<SavedRow> {
        if (nuevaFila) {
          //TipoProducto.idTipoProducto = null;
          return this.http.post<SavedRow>(
            `${this.apiUrl}productos/${this.authService.idUsuario()}/tipoproductos`,
            TipoProducto,
          );
        } else {
          const params = new HttpParams().set('idTipoProducto', TipoProducto.idTipoProducto!);
          return this.http.put<SavedRow>(
            `${this.apiUrl}productos/${this.authService.idUsuario()}/tipoproductos`,
            TipoProducto,
            { params },
          );
        }
      }

    grabaTarifa(Tarifa: TarifaFila) {
    if (Tarifa.idPrecioProductoXTemporada === 0) {
       //Tarifa.idPrecioProductoXTemporada = null;
      // POST (Nuevo): Pasamos el idUsuario en la URL
      return this.http.post<any>(`${this.apiUrl}productos/${this.authService.idUsuario()}/preciosproductoxtemporada`, Tarifa);
    } else {
      // PUT (Actualizar): Pasamos idUsuario en URL y el idInsumoXItinerario como Query Param
      return this.http.put<any>(
        `${this.apiUrl}productos/${this.authService.idUsuario()}/preciosproductoxtemporada?idPrecioProductoXTemporada=${Tarifa.idPrecioProductoXTemporada}`, 
        Tarifa
      );
    }
  }

  eliminaTarifa(idPrecioProductoXTemporada: number): Observable<SavedRow> {
    const params = new HttpParams().set('idPrecioProductoXTemporada', idPrecioProductoXTemporada!);
    return this.http.delete<SavedRow>(`${this.apiUrl}productos/${this.authService.idUsuario()}/preciosproductoxtemporada`, {
      params,
    });
  }




}



   