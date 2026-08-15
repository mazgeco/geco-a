import { computed, Injectable, signal } from "@angular/core";
import { Productos } from "../../../interfaces/productos.interfaces";

@Injectable({
  providedIn: 'root'
})
export class StateService {

  producto = signal<Productos | null>(null);

  nombre = computed(() =>
    this.producto()?.nombreCorto ?? ''
  );

  estado = computed(() =>
    this.producto()?.estadoProducto === 'A' ? true : false
  );

  estadoNombre = computed(() => {
    return this.producto()?.estadoProducto === "A" ? "Activo" : "Inactivo"
  }
  );

}