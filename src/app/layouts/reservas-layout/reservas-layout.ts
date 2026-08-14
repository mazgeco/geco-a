import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PRIMENG_MODULES } from '../../shared/primeng/primeng.imports';

@Component({
  selector: 'app-reservas-layout',
  imports: [...PRIMENG_MODULES, RouterOutlet],
  templateUrl: './reservas-layout.html',
  styles: ``,
})
export class ReservasLayout implements OnInit {
  
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
        routerLink: '/reservas/dash'
      },
      {
        label: 'Reservas',
        icon: 'pi pi-calendar',
        items: [
          {
            label: 'Reservas (búsqueda/creación)',
            routerLink: '/reservas/search'
          }
        ]
      },
      {
        label: 'Reportes',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Reporte reservas'
          }
        ]
      }
    ];
  }
}
