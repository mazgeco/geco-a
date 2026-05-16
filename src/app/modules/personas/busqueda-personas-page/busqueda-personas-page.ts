import { Component, inject, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';

@Component({
  selector: 'app-busqueda-personas-page',
  imports: [...PRIMENG_MODULES],
  templateUrl: './busqueda-personas-page.html',
  styleUrl: './busqueda-personas-page.css',
})
export class BusquedaPersonasPage implements OnInit {

  router = inject(Router);

  ngOnInit(): void {
    
  }

  openPersona(): void {
    this.router.navigate(['/personas/persona/']);
  }

}
