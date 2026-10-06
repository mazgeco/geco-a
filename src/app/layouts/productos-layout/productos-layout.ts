import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PRIMENG_MODULES } from '../../shared/primeng/primeng.imports';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-productos-layout',
  imports: [...PRIMENG_MODULES, RouterOutlet],
  templateUrl: './productos-layout.html'
})
export class ProductosLayout implements OnInit {

  private authService = inject(AuthService);
  nombreUsuario = signal<string>("");
  router = inject(Router);
  menuItems: MenuItem[] | undefined;


  ngOnInit(): void {

    this.nombreUsuario.set(this.authService.nombrePersona());

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
        label: 'Parametrización',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Operación',
            routerLink: '/productos/parametrizacion/operacion'
          },
          {
            label: 'UEN',
            routerLink: '/productos/parametrizacion/uens',
          },
           {
            label: 'Temporadas',
            routerLink: '/productos/parametrizacion/temporadas',
          },
           {
            label: 'Impuestos',
            routerLink: '/productos/parametrizacion/impuestos',
          },
           {
            label: 'Tipo de producto',
            routerLink: '/productos/parametrizacion/tipo-producto',
          }
        ],
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
