import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PRIMENG_MODULES } from '../../shared/primeng/primeng.imports';

@Component({
  selector: 'app-seguridades-layout',
  imports: [...PRIMENG_MODULES, RouterOutlet],
  templateUrl: './seguridades-layout.html',
  styles: ``,
})
export class SeguridadesLayout implements OnInit {

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
        routerLink: '/seguridades/dash'
      },
      {
        label: 'Seguridades',
        icon: 'pi pi-shield',
        items: [
          {
            label: 'Usuarios (búsqueda/creación)',
            routerLink: '/seguridades/search'
          }
        ]
      },
      {
        label: 'Reportes',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Reporte usuarios'
          }
        ]
      }
    ];
  }


}
