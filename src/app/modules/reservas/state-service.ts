import { computed, Injectable, signal } from '@angular/core';
import { EstadoReserva, EstadoReservaNombre, Reservas } from '../../interfaces/reservas.interface';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  reserva = signal<Reservas | null>(null);

  codigo = computed(() => this.reserva()?.idReserva ?? 0);

  nombre = computed(() => this.reserva()?.nombrePersona ?? '');

  estado = computed(() => (this.reserva()?.estadoReserva === EstadoReserva.CNF ? true : false));

  estadoNombre = computed(() => {
    EstadoReservaNombre[this.reserva()?.estadoReserva as EstadoReserva] ?? ''
  });
}