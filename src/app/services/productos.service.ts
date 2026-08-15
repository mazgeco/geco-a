import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ListaTipoProductoResponse, ListaProductosResponse, ProductoResponse} from '../interfaces/productos.interfaces';
import { SavedRow } from '../interfaces/general.interface'

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;
    private idUsuario = "mgzapata";
 
    buscaProducto(nombre: string): Observable<ListaProductosResponse> {
    return this.http.get<ListaProductosResponse>(`${this.apiUrl}productos/busqueda?nombre=${nombre}`)
    }
   productoPorId(idProducto: string): Observable<ProductoResponse> {
      return this.http.get<ProductoResponse>(`${this.apiUrl}productos/${idProducto}`)
    }

    listaTipoProducto(): Observable<ListaTipoProductoResponse> {
    return this.http.get<ListaTipoProductoResponse>(`${this.apiUrl}productos/tipoproductos`);
    }
    }