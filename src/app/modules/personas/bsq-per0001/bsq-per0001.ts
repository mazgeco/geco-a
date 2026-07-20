import { Component, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';
import { EstadoPersona, Personas } from '../../../interfaces/personas.interfaces';

@Component({
  selector: 'app-bsq-per0001',
  imports: [...PRIMENG_MODULES],
  templateUrl: './bsq-per0001.html',
  styleUrl: './bsq-per0001.css',
})
export class BsqPer0001 implements OnInit {

  router = inject(Router);
  personas = signal<Personas[]>([
    {
      idPersona: 5303,
      razonSocial: "Aseguradora del Sur",
      estadoPersona: EstadoPersona.A,
      nombreTipoPersona: "Jurídica",
      telefono: "+593 22-22-22",
      identificacion: "1712345678001",
      idUsuarioCrea: "sistemas",
      fechaCrea: "2020-01-01"
    },
    {
      idPersona: 2504,
      razonSocial: "29 TRAVEL",
      estadoPersona: EstadoPersona.A,
      nombreTipoPersona: "Jurídica",
      telefono: "+593 22-22-22",
      identificacion: "1712345678001",
      idUsuarioCrea: "sistemas",
      fechaCrea: "2020-01-01"
    },
    {
      idPersona: 2400,
      razonSocial: "Abercrombie & Kent Ecuador S.A",
      estadoPersona:EstadoPersona.A,
      nombreTipoPersona: "Jurídica",
      telefono: "+593 22-22-22",
      identificacion: "1712345678001",
      idUsuarioCrea: "sistemas",
      fechaCrea: "2020-01-01"
    },
    {
      idPersona: 2400,
      razonSocial: "Achiote Ecuador Cuisine",
      estadoPersona: EstadoPersona.A,
      nombreTipoPersona: "Jurídica",
      telefono: "+593 22-22-22",
      identificacion: "1712345678001",
      idUsuarioCrea: "sistemas",
      fechaCrea: "2020-01-01"
    }
  ]);

  ngOnInit(): void {
    
  }

  openPersona(): void {
    this.router.navigate(['/personas/persona/', '0']);
  }

  seleccionarPersona(persona: Personas):void{
    this.router.navigate(['/personas/persona/',  persona.idPersona]);
  }


}
