import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PRIMENG_MODULES } from '../../shared/primeng/primeng.imports';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-proveedoreslayout',
  imports: [...PRIMENG_MODULES, RouterOutlet],
  templateUrl: './proveedores-layout.html',
  styles: ``,
})
export class ProveedoresLayout implements OnInit {
  private authService = inject(AuthService);
  nombreUsuario = signal<string>('');
  router = inject(Router);
  menuItems: MenuItem[] | undefined;

  ngOnInit(): void {
    this.nombreUsuario.set(this.authService.nombrePersona());
    this.menuItems = [
      {
        label: 'Módulos',
        icon: 'pi pi-angle-double-left',
        routerLink: '/main/',
      },
      {
        label: 'Dashboard',
        icon: 'pi pi-chart-bar',
        routerLink: '/proveedores/dash',
      },
      {
        label: 'Proveedores',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Proveedores (búsqueda/creación)',
            routerLink: '/proveedores/search',
          },
        ],
      },
      {
        label: 'Insumos',
        icon: 'pi pi-barcode',
        items: [
          {
            label: 'Insumo (búsqueda/creación)',
            routerLink: '/proveedores/searchinsumo'
          },          
          {
            label: 'Clasificadores',
            routerLink: '/proveedores/clasificadores'
          },
          {
            label: 'Tipos de insumo',
            routerLink: '/proveedores/tiposinsumo'
          }
        ],
      },
      {
        label: 'Reportes',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Reporte proveedores',
          },
        ],
      },
    ];
  }
}
