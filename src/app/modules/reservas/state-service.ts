import { computed, Injectable, signal } from '@angular/core';
import { EstadoReserva, EstadoReservaNombre, Reservas } from '../../interfaces/reservas.interfaces';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  reserva = signal<Reservas | null>(null);

  codigo = computed(() => this.reserva()?.idReserva ?? 0);

  nombre = computed(() => this.reserva()?.nombrePersona ?? '');

  estado = computed(() => {
    if(this.reserva()?.estadoReserva === EstadoReserva.XXX || this.reserva()?.estadoReserva === EstadoReserva.PAG){
      return false;
    } else {
      return true;
    }    
  });

  estadoNombre = computed(
    () => EstadoReservaNombre[this.reserva()?.estadoReserva as EstadoReserva] ?? '',
  );
}
