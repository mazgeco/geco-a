import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

import { SavedRow } from '../interfaces/general.interface';
import { ProveedoresResponse } from '../interfaces/proveedores.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private idUsuario = 'mgzapata';

  buscaProveedor(nombre: string): Observable<ProveedoresResponse> {
    return this.http.get<ProveedoresResponse>(
      `${this.apiUrl}proveedores/busqueda?nombre=${nombre}`,
    );
  }
}
