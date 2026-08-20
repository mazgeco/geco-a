import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ListaTipoProductoResponse, ListaProductosResponse, ProductoResponse, ItinerarioResponse, RespuestaIdiomaItinerario, Productos} from '../interfaces/productos.interfaces';
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
  itinerarioPorProducto(idProducto: string): Observable<ItinerarioResponse> {
    const params = new HttpParams().set('idProducto', idProducto);
    return this.http.get<ItinerarioResponse>(`${this.apiUrl}productos/itinerarios`, { params });
  }
   productoPorId(idProducto: string): Observable<ProductoResponse> {
      return this.http.get<ProductoResponse>(`${this.apiUrl}productos/${idProducto}`)
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
    }