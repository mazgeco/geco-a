import { Injectable, signal } from '@angular/core';

export interface CatalogConfig {
  codigo: string;
  titulo: string;
  campoDescripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  visible = signal(false);

  catalogoActual = signal<CatalogConfig | null>(null);

  abrir(config: CatalogConfig) {

    this.catalogoActual.set(config);
    this.visible.set(true);

  }


  cerrar() {

    this.visible.set(false);
    this.catalogoActual.set(null);

  }

}