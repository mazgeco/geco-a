import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ListaTipoProductoResponse, ListaProductosResponse, ProductoResponse, ItinerarioResponse, RespuestaIdiomaItinerario, Productos, DiaItinerario, InsumoItinerario, IdiomaXItinerario, Operacion, ListaOperacionResponse, UnidadEstrategica, ListaUnidadEstrategicaResponse, Temporadas, ListaTemporadasResponse, ListaPrecioProductoResponse} from '../interfaces/productos.interfaces';
import { SavedRow } from '../interfaces/general.interface'

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private idUsuario = "mgzapata";
 
    // buscaProducto(nombre: string): Observable<ListaProductosResponse> {
    // return this.http.get<ListaProductosResponse>(`${this.apiUrl}productos/busqueda?nombre=${nombre}`)
    // }

  buscaProducto(nombre: string): Observable<ListaProductosResponse> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<ListaProductosResponse>(`${this.apiUrl}productos/busqueda`, { params });
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
        return this.http.post<SavedRow>(`${this.apiUrl}productos/${this.idUsuario}`, producto);
      } else {
        
        // Si ya tiene un código (ej. ADL001), se procesa como una actualización (PUT)
        const params = new HttpParams().set('idProducto', idProducto);
        return this.http.put<SavedRow>(`${this.apiUrl}productos/${this.idUsuario}`, producto, {
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

grabaItinerario(itinerario: DiaItinerario, idUsuario: string): Observable<SavedRow> {
  if (!itinerario.idItinerario) {
    // POST (Nuevo): Envía el usuario en la url y el objeto en el body
    return this.http.post<SavedRow>(`${this.apiUrl}productos/${idUsuario}/itinerarios`, itinerario);
  } else {
    // PUT (Actualizar): Envía el usuario en la url y el idItinerario como QueryParam
    return this.http.put<SavedRow>(
      `${this.apiUrl}productos/${idUsuario}/itinerarios?idItinerario=${itinerario.idItinerario}`, 
      itinerario
    );
  }
}

// Guardado o actualización de textos operativos para la segunda tabla (prd_idioma_x_itinerario)
  grabarTextosOperativos(dto: IdiomaXItinerario, idUsuario: string): Observable<SavedRow> {
    if (!dto.idIdiomaXItinerario || dto.idIdiomaXItinerario === 0) {
      // POST (Nuevo): Cuando no tiene ID, crea el registro
      return this.http.post<SavedRow>(`${this.apiUrl}productos/${idUsuario}/idiomasxitinerarios`, dto);
    } else {
      // PUT (Actualizar): Cuando ya tiene ID, actualiza enviándolo por query param (o como lo maneje el backend)
      return this.http.put<SavedRow>(
        `${this.apiUrl}productos/${idUsuario}/idiomasxitinerarios?idIdiomaXItinerario=${dto.idIdiomaXItinerario}`,
        dto
      );
    }
  }


  // Lee los insumos de un itinerario (día) específico
  // OJO: El backend pide idItinerario por Query Param
 listaInsumosPorItinerario(idItinerario: number) {
    // Le quitamos el '/' inicial y le agregamos 'productos/'
    return this.http.get<any>(`${this.apiUrl}productos/insumosxitinerario/itinerario?idItinerario=${idItinerario}`);
  }

  // Inserta o actualiza un insumo
  grabaInsumoItinerario(insumo: InsumoItinerario, idUsuario: string) {
    if (insumo.idInsumoXItinerario === 0) {
       insumo.idInsumoXItinerario = null;
      // POST (Nuevo): Pasamos el idUsuario en la URL
      return this.http.post<any>(`${this.apiUrl}productos/insumosxitinerario/${idUsuario}`, insumo);
    } else {
      // PUT (Actualizar): Pasamos idUsuario en URL y el idInsumoXItinerario como Query Param
      return this.http.put<any>(
        `${this.apiUrl}productos/insumosxitinerario/${idUsuario}?idInsumoXItinerario=${insumo.idInsumoXItinerario}`, 
        insumo
      );
    }
  }

 

  // Elimina un insumo (Asumiendo la estructura estándar del DELETE que no se ve completa en la foto)
  eliminaInsumoItinerario(idInsumoXItinerario: number, idUsuario: string) {
    return this.http.delete<any>(
      `${this.apiUrl}productos/insumosxitinerario/${idUsuario}?idInsumoXItinerario=${idInsumoXItinerario}`
    );
  }

  // Asegúrate de importar Observable desde 'rxjs'
  eliminarItinerario(idItinerario: number, idUsuario: string): Observable<any> {
    const url = `${this.apiUrl}productos/${idUsuario}/itinerarios?idItinerario=${idItinerario}`;
    return this.http.delete(url);
  }

   listaOperaciones(): Observable<ListaOperacionResponse> {
      return this.http.get<ListaOperacionResponse>(`${this.apiUrl}productos/operaciones`);
    }

   grabaOperacion(operacion: Operacion, nuevaFila: boolean): Observable<SavedRow> {
        if (nuevaFila) {
          operacion.idOperacion = null;
          return this.http.post<SavedRow>(
            `${this.apiUrl}productos/${this.idUsuario}/operaciones`,
            operacion,
          );
        } else {
          const params = new HttpParams().set('idOperacion', operacion.idOperacion!);
          return this.http.put<SavedRow>(
            `${this.apiUrl}productos/${this.idUsuario}/operaciones`,
            operacion,
            { params },
          );
        }
      }

    eliminaOperacion(idOperacion: number): Observable<SavedRow> {
    const params = new HttpParams().set('idOperacion', idOperacion);
    return this.http.delete<SavedRow>(`${this.apiUrl}productos/${this.idUsuario}/operaciones`, {
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
            `${this.apiUrl}productos/${this.idUsuario}/unidadesestrategicas`,
            unidad,
          );
        } else {
          const params = new HttpParams().set('idUnidadEstrategica', unidad.idUnidadEstrategica!);
          return this.http.put<SavedRow>(
            `${this.apiUrl}productos/${this.idUsuario}/unidadesestrategicas`,
            unidad,
            { params },
          );
        }
      }

  eliminaUnidadEstrategica(idUnidadEstrategica: number): Observable<SavedRow> {
    const params = new HttpParams().set('idUnidadEstrategica', idUnidadEstrategica);
    return this.http.delete<SavedRow>(`${this.apiUrl}productos/${this.idUsuario}/unidadesestrategicas`, {
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
            `${this.apiUrl}productos/${this.idUsuario}/temporadas`,
            temporada,
          );
        } else {
          const params = new HttpParams().set('idTemporada', temporada.idTemporada!);
          return this.http.put<SavedRow>(
            `${this.apiUrl}productos/${this.idUsuario}/temporadas`,
            temporada,
            { params },
          );
        }
      }

  eliminaTemporada(idTemporada: number): Observable<SavedRow> {
    const params = new HttpParams().set('idTemporada', idTemporada);
    return this.http.delete<SavedRow>(`${this.apiUrl}productos/${this.idUsuario}/temporadas`, {
      params,
    });
  }

  // En tu productos.service.ts
  actualizarTipoPrecio(idProducto: string, payload: any, idUsuario: string): Observable<any> {
  const url = `${this.apiUrl}productos/${idUsuario}?idProducto=${idProducto}`;
  return this.http.put(url, payload);
  }

  listaPreciosProductos(): Observable<ListaPrecioProductoResponse> {
  return this.http.get<ListaPrecioProductoResponse>(`${this.apiUrl}productos/precioproductos`);
}

    }

   