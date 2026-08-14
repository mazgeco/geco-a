import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PRIMENG_MODULES } from '../../shared/primeng/primeng.imports';


@Component({
  selector: 'app-proveedoreslayout',
  imports: [...PRIMENG_MODULES, RouterOutlet],
  templateUrl: './proveedores-layout.html',
  styles: ``,
})
export class ProveedoresLayout implements OnInit {

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
        routerLink: '/proveedores/dash'
      },
      {
        label: 'Proveedores',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Proveedores (búsqueda/creación)',
            routerLink: '/proveedores/search'
          }
        ]
      },
      {
        label: 'Reportes',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Reporte proveedores'
          }
        ]
      }
    ];
  }
}
