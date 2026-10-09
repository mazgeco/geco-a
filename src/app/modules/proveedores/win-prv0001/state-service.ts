import { computed, Injectable, signal } from "@angular/core";
import { PersonaProveedor } from "../../../interfaces/proveedores.interfaces";

@Injectable({
  providedIn: 'root'
})
export class StateService {

  proveedor = signal<PersonaProveedor | null>(null);

  codigo = computed(() =>
    this.proveedor()?.idProveedor ?? 0
  );

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