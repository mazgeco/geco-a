import { computed, Injectable, signal, OnInit } from "@angular/core";
import { Insumos, EstadoInsumo } from "../../../interfaces/proveedores.interfaces";

@Injectable({
   providedIn: 'root' 
  })
export class StateService {
  insumo = signal<Insumos | null>(null);

  codigo = computed(() =>
    this.insumo()?.idInsumo ?? 0
  );

  nombre = computed(() =>
    this.insumo()?.descripcionInsumo ?? ''
  );

  estado = computed(() =>
    this.insumo()?.estadoInsumo === 'A' ? true : false
  );

  estadoNombre = computed(() => {
    return this.insumo()?.estadoInsumo === "A" ? "Activo" : "Inactivo"
  }
  );

}
