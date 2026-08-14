import { Component, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';
import { EstadoReserva, EstadoReservaNombre, Reservas } from '../../../interfaces/reservas.interface';

@Component({
  selector: 'app-bsq-res0001',
  imports: [...PRIMENG_MODULES],
  templateUrl: './bsq-res0001.html',
  styleUrl: './bsq-res0001.css',
})
export class BsqRes0001 {
  router = inject(Router);
  readonly estadoReservaNombre = EstadoReservaNombre;

  reservas = signal<Reservas[]>([
    {
      idReserva: 1,
      idPersona: 1,
      nombrePersona: 'Cliente 1',
      estadoReserva: EstadoReserva.BLQ,
      codigoAgencia: 'CLI00001',
    },
    {
      idReserva: 2,
      idPersona: 1,
      nombrePersona: 'Cliente 1',
      estadoReserva: EstadoReserva.BLQ,
      codigoAgencia: 'CLI00001',
    },
    {
      idReserva: 3,
      idPersona: 1,
      nombrePersona: 'Cliente 1',
      estadoReserva: EstadoReserva.BLQ,
      codigoAgencia: 'CLI00001',
    },
    {
      idReserva: 4,
      idPersona: 1,
      nombrePersona: 'Cliente 1',
      estadoReserva: EstadoReserva.BLQ,
      codigoAgencia: 'CLI00001',
    },
  ]);

  estadoReserva(estado: EstadoReserva):string {
    let nombre:string = "";
    switch(estado){
      case "CNF":
        nombre = "Confirmada";
    }
    return nombre;
  }

  openReserva(): void {
    this.router.navigate(['/reservas/reserva/', '0']);
  }

  seleccionarReserva(reserva: Reservas): void {
    this.router.navigate(['/reservas/reserva/', reserva.idReserva]);
  }
}
