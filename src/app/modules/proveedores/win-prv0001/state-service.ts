import { computed, Injectable, signal } from "@angular/core";
import { Proveedores } from "../../../interfaces/proveedores.interfaces";

@Injectable({
  providedIn: 'root'
})
export class StateService {

  proveedor = signal<Proveedores | null>(null);

  nombre = computed(() =>
    this.proveedor()?.nombrePersona ?? ''
  );

  estado = computed(() =>
    this.proveedor()?.estadoProveedor === 'A' ? true : false
  );

  estadoNombre = computed(() => {
    return this.proveedor()?.estadoProveedor === "A" ? "Activo" : "Inactivo"
  }
  );

}