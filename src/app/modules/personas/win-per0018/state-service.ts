import { computed, Injectable, signal } from '@angular/core';
import { Personas } from '../../../interfaces/personas.interfaces';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  persona = signal<Personas | null>(null);

  codigo = computed(() => this.persona()?.idPersona ?? 0);

  nombre = computed(() => this.persona()?.razonSocial ?? '');

  estado = computed(() => (this.persona()?.estadoPersona === 'A' ? true : false));

  estadoNombre = computed(() => {
    return this.persona()?.estadoPersona === 'A' ? 'Activo' : 'Inactivo';
  });
}
