import { computed, Injectable, signal } from '@angular/core';
import { Usuarios } from '../../../interfaces/seguridades.interface';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  usuario = signal<Usuarios | null>(null);

  codigo = computed(() => this.usuario()?.idUsuario ?? "");

  nombre = computed(() => this.usuario()?.nombrePersona ?? '');

  estado = computed(() => (this.usuario()?.estadoUsuario === 'A' ? true : false));

  estadoNombre = computed(() => {
    return this.usuario()?.estadoUsuario === 'A' ? 'Activo' : 'Inactivo';
  });
}