import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';
import {
  EstadoReserva,
  EstadoReservaNombre,
  Reservas,
} from '../../../interfaces/reservas.interface';
import { ReservasService } from '../../../services/reservas.service';
import { StatusMessage } from '../../../interfaces/general.interface';
import { MessageService } from '../../../services/message.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-bsq-res0001',
  imports: [...PRIMENG_MODULES],
  templateUrl: './bsq-res0001.html',
  styleUrl: './bsq-res0001.css',
})
export class BsqRes0001 {
  router = inject(Router);
  toastService = inject(ToastService);
  loading = signal<boolean>(false);
  notificacion = signal<string>('');
  
  private reservasService = inject(ReservasService);
  reservas = signal<Reservas[]>([]);
  readonly estadoReservaNombre = EstadoReservaNombre;

  //Variables para manejo de mensajes
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  busquedaMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgBsqRes0001'),
  );

  buscaReservas(nombre: string): void {
    (this.loading.set(true),
      this.reservasService.buscaReservas(nombre).subscribe({
        next: (resp) => {
          this.reservas.set([]);
          this.reservas.set(resp.data);
          this.messageService.mostrar(
            this.statusMessages,
            'msgBsqRes0001',
            'success',
            `${resp.data.length} registros encontrados`,
          );
          this.loading.set(false);
        },
        error: (err) => {
          this.reservas.set([]);
          this.loading.set(false);
          if (err.error.status === 'NOT_FOUND') {
            this.notificacion.set('0 registos encontrados');
          } else {
            this.notificacion.set('');
            this.toastService.showMessage(
              'error',
              'Error',
              'Ha ocurrido un error: ' + err.error.message,
            );
          }
        },
      }));
  }

  estadoReserva(estado: EstadoReserva): string {
    let nombre: string = '';
    switch (estado) {
      case 'CNF':
        nombre = 'Confirmada';
    }
    return nombre;
  }

  openReserva(): void {
    this.messageService.clearAllTimers();
    this.router.navigate(['/reservas/reserva/', '0']);
  }

  seleccionarReserva(reserva: Reservas): void {
    this.messageService.clearAllTimers();
    this.router.navigate(['/reservas/reserva/', reserva.idReserva]);
  }
}
