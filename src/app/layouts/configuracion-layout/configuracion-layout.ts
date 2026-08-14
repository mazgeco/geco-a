import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PRIMENG_MODULES } from '../../shared/primeng/primeng.imports';

@Component({
  selector: 'app-configuracion-layout',
  imports: [...PRIMENG_MODULES, RouterOutlet],
  templateUrl: './configuracion-layout.html',
  styles: ``,
})
export class ConfiguracionLayout implements OnInit {

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
        routerLink: '/configuracion/dash'
      },
      {
        label: 'Configuracion',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Empresa',
            routerLink: '/configuracion/empresa'
          }
        ]
      },
      {
        label: 'Reportes',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Reporte configuraciones'
          }
        ]
      }
    ];
  }

}
