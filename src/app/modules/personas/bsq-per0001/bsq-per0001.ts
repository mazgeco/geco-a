import { Component, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';
import { PersonasService } from '../../../services/personas.service';
import { ToastService } from '../../../shared/toast.service';
import { Personas } from '../../../interfaces/personas.interfaces';

@Component({
  selector: 'app-bsq-per0001',
  imports: [...PRIMENG_MODULES],
  templateUrl: './bsq-per0001.html',
  styleUrl: './bsq-per0001.css',
})
export class BsqPer0001 implements OnInit {

  router = inject(Router);
  personasService = inject(PersonasService)
  toastService = inject(ToastService);
  personas = signal<Personas[]>([]);
  loading = signal<boolean>(false);
  notificacion = signal<string>("");

  ngOnInit(): void {

  }

  buscarPersona(nombre: string): void {
    this.loading.set(true),
      this.personasService.buscaPersona(nombre).subscribe({
        next: (resp) => {
          this.personas.set([]);
          this.personas.set(resp.data);
          this.notificacion.set(`${resp.data.length} registros encontrados`);
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

  /*
  cargarTickets() {
    this.loading = true;
    this.rifaService.listarTicketsXDonante().subscribe({
      next: (resp) => {
        this.tickets.set(resp.data);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los tickets: ' + (err.error?.message || err.message)
        });
      }
    });
  }
  
  */

  openPersona(): void {
    this.router.navigate(['/personas/persona/', '0']);
  }

  seleccionarPersona(persona: Personas): void {
    this.router.navigate(['/personas/persona/', persona.idPersona]);
  }


}
