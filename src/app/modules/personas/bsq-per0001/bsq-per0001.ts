import { Component, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';
import { EstadoPersona, Personas } from '../../../interfaces/personas.interfaces';
import { PersonasService } from '../../../services/personas.service';

@Component({
  selector: 'app-bsq-per0001',
  imports: [...PRIMENG_MODULES],
  templateUrl: './bsq-per0001.html',
  styleUrl: './bsq-per0001.css',
})
export class BsqPer0001 implements OnInit {

  router = inject(Router);
  personasService = inject(PersonasService)
  loading:boolean = false;
  personas = signal<Personas[]>([]);

  ngOnInit(): void {
    
  }

  buscarPersona(nombre: string): void {
    this.loading = true;
    this.personasService.buscaPersona(nombre).subscribe({
      next: (resp) => {
        //console.log(resp.data);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.log(err.error.message);
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

  seleccionarPersona(persona: Personas):void{
    this.router.navigate(['/personas/persona/',  persona.idPersona]);
  }


}
