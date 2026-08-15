import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';
import { PersonasService } from '../../../services/personas.service';
import { ToastService } from '../../../services/toast.service';
import { Personas } from '../../../interfaces/personas.interfaces';
import { MessageService } from '../../../services/message.service';
import { StatusMessage } from '../../../interfaces/general.interface';

@Component({
  selector: 'app-bsq-per0001',
  imports: [...PRIMENG_MODULES],
  templateUrl: './bsq-per0001.html',
  styleUrl: './bsq-per0001.css',
})
export class BsqPer0001 {
  router = inject(Router);
  toastService = inject(ToastService);
  loading = signal<boolean>(false);
  notificacion = signal<string>("");
  
  personasService = inject(PersonasService);
  personas = signal<Personas[]>([]);

  //Variables para manejo de mensajes
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  busquedaMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgBsqPer0001')
  );


  buscarPersona(nombre: string): void {
    this.loading.set(true),
      this.personasService.buscaPersona(nombre).subscribe({
        next: (resp) => {
          this.personas.set([]);
          this.personas.set(resp.data);
          this.messageService.mostrar(
            this.statusMessages,
            'msgBsqPer0001',
            'success',
            `${resp.data.length} registros encontrados`
          );
          this.loading.set(false);
        },
        error: (err) => {
          this.personas.set([]);
          this.loading.set(false);
          if (err.error.status === "NOT_FOUND") {
            this.notificacion.set("0 registos encontrados");
          } else {
            this.notificacion.set("");
            this.toastService.showMessage("error", "Error", "Ha ocurrido un error: " + err.error.message);
          }
        }
      });
  }

  openPersona(): void {
    this.messageService.clearAllTimers();
    this.router.navigate(['/personas/persona/', '0']);
  }

  seleccionarPersona(persona: Personas): void {
    this.messageService.clearAllTimers();
    this.router.navigate(['/personas/persona/', persona.idPersona]);
  }
}
