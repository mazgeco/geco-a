import { computed, Injectable, signal } from "@angular/core";
import { PersonaProveedor } from "../../../interfaces/proveedores.interfaces";

@Injectable({
  providedIn: 'root'
})
export class StateService {

  proveedor = signal<PersonaProveedor | null>(null);

  nombre = computed(() =>
    this.proveedor()?.razonSocial ?? ''
  );

  estado = computed(() =>
    this.proveedor()?.estadoProveedor === 'A' ? true : false
  );

  estadoNombre = computed(() => {
    return this.proveedor()?.estadoProveedor === "A" ? "Activo" : "Inactivo"
  }
  );

}