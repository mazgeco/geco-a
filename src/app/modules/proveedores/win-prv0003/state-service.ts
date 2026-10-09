import { computed, Injectable, signal, OnInit } from "@angular/core";
import { Insumos, EstadoInsumo } from "../../../interfaces/proveedores.interfaces";

@Injectable({
   providedIn: 'root' 
  })
export class StateService {
  proveedor = signal<Insumos | null>(null);

  estadoInsumo = computed(() => 
    this.proveedor()?.estadoInsumo === EstadoInsumo.A
  );
}
