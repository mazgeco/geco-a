import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PRIMENG_MODULES } from '../../shared/primeng/primeng.imports';

@Component({
  selector: 'app-productos-layout',
  imports: [...PRIMENG_MODULES, RouterOutlet],
  templateUrl: './productos-layout.html'
})
export class ProductosLayout implements OnInit {

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
        routerLink: '/productos/dash'
      },
      {
        label: 'Productos',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Productos (búsqueda/creación)',
            routerLink: '/productos/search'
          }
        ]
      },
      {
        label: 'Reportes',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Reporte productos'
          }
        ]
      }
    ];
  }

}
