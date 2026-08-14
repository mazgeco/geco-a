import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PRIMENG_MODULES } from '../../shared/primeng/primeng.imports';

@Component({
  selector: 'app-personas-layout',
  imports: [...PRIMENG_MODULES, RouterOutlet],
  templateUrl: './personas-layout.html',
})
export class PersonasLayout implements OnInit {
  router = inject(Router);
  menuItems: MenuItem[] | undefined;

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Módulos',
        icon: 'pi pi-angle-double-left',
        routerLink: '/main/',
      },
      {
        label: 'Dashboard',
        icon: 'pi pi-chart-bar',
        routerLink: '/personas/dash',
      },
      {
        label: 'Parametrización',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Tipos',
            items: [
              {
                label: 'Tipos de teléfonos',
                routerLink: '/personas/tipo-telefono/',
              },
              {
                label: 'Tipos de direcciones',
                routerLink: '/personas/tipo-direccion/',
              },
              {
                label: 'Tipos de empresas',
                routerLink: '/personas/tipo-empresa/',
              },
              {
                label: 'Tipos de denominación',
                routerLink: '/personas/tipo-denominacion/',
              },
              {
                label: 'Tipos de identificación',
                routerLink: '/personas/tipo-identificacion/',
              },
              {
                label: 'Tipos de características',
                routerLink: '/personas/tipo-caracteristicas/',
              },
              {
                label: 'Tipos de ficha médica',
                routerLink: '/personas/duplicates/',
              },
            ],
          },
          {
            label: 'Ubicación',
            items: [
              {
                label: 'Paises',
                routerLink: '/personas/duplicates/',
              },
              {
                label: 'Provincias/Estados',
                routerLink: '/personas/duplicates/',
              },
              {
                label: 'Ciudades',
                routerLink: '/personas/duplicates/',
              },
            ],
          },
          {
            label: 'Nacionalidades',
            routerLink: '/personas/duplicates/',
          }
        ],
      },
      {
        label: 'Personas',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Persona (búsqueda/creación)',
            routerLink: '/personas/search/',
          },
          {
            label: 'Unificar duplicados',
            routerLink: '/personas/duplicates/',
          },
        ],
      },
      {
        label: 'Reportes',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Reporte cumpleaños',
          },
          {
            label: 'Reporte personas',
          },
        ],
      },
    ];
  }
}
