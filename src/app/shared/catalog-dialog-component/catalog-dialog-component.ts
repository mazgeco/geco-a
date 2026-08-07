import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { CatalogService } from '../../services/catalog.service';


@Component({
  selector: 'app-catalog-dialog',
  standalone: true,
  imports: [
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './catalog-dialog-component.html',
  styleUrl: './catalog-dialog-component.css'
})
export class CatalogDialogComponent {


  catalogService = inject(CatalogService);


  descripcion = '';


  guardar(){

    const catalogo = this.catalogService.catalogoActual();

    console.log({
      codigo: catalogo?.codigo,
      descripcion: this.descripcion
    });


    // Aquí después irá:
    // this.catalogService.guardar(...)


    this.descripcion = '';

    this.catalogService.cerrar();

  }


  cerrar(){

    this.descripcion = '';

    this.catalogService.cerrar();

  }

}