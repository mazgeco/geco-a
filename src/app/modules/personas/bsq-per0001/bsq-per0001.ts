import { Component, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';
import { Personas } from '../../../interfaces/personas.interfaces';

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
      estadoPersona: "A",
      nombreTipoPersona: "Jurídica",
      telefono: "+593 22-22-22",
      identificacion: "1712345678001"
    },
    {
      idPersona: 2504,
      razonSocial: "29 TRAVEL",
      estadoPersona: "A",
      nombreTipoPersona: "Jurídica",
      telefono: "+593 22-22-22",
      identificacion: "1712345678001"
    },
    {
      idPersona: 2400,
      razonSocial: "Abercrombie & Kent Ecuador S.A",
      estadoPersona: "A",
      nombreTipoPersona: "Jurídica",
      telefono: "+593 22-22-22",
      identificacion: "1712345678001"
    },
    {
      idPersona: 2400,
      razonSocial: "Achiote Ecuador Cuisine",
      estadoPersona: "A",
      nombreTipoPersona: "Jurídica",
      telefono: "+593 22-22-22",
      identificacion: "1712345678001"
    }
  ]);

  ngOnInit(): void {
    
  }

  openPersona(): void {
    this.router.navigate(['/personas/persona/']);
  }

  seleccionarPersona(persona: Personas):void{
    this.router.navigate(['/personas/persona/',  persona.idPersona]);
  }


}
