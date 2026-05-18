import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PRIMENG_MODULES } from '../../shared/primeng/primeng.imports';

@Component({
  selector: 'app-personas-layout',
  imports: [...PRIMENG_MODULES, RouterOutlet],
  templateUrl: './personas-layout.html'
})
export class PersonasLayout implements OnInit {
   router = inject(Router);
  menuItems: MenuItem[] | undefined;

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Módulos',
        icon: 'pi pi-angle-double-left',
        routerLink: '/main/'
      },
      {
        label: 'Dashboard',
        icon: 'pi pi-chart-bar',
        routerLink: '/personas/dash'
      },
      {
        label: 'Personas',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Persona (búsqueda/creación)',
            routerLink: '/personas/search/'
          },
          {
            label: 'Unificar duplicados',
            routerLink: '/personas/duplicates/'
          }
        ]
      },
      {
        label: 'Reportes',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Reporte cumpleaños'
          },
          {
            label: 'Reporte personas'
          }
        ]
      }
    ];
  }
}
