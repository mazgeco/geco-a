import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PRIMENG_MODULES } from '../../shared/primeng/primeng.imports';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reservas-layout',
  imports: [...PRIMENG_MODULES, RouterOutlet],
  templateUrl: './reservas-layout.html',
  styles: ``,
})
export class ReservasLayout implements OnInit {
  
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
        routerLink: '/reservas/dash'
      },
      {
        label: 'Parametrización',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Rooming list',
            routerLink: '/reservas/roominglist'
          },
          {
            label: 'Motivos',
            routerLink: '/reservas/motivos'
          },
          {
            label: 'Tipo reserva',
            routerLink: '/reservas/tiporeserva'
          },
          {
            label: 'Parámetros orden de servicios',
            routerLink: '/reservas/paramorden'
          },
          {
            label: 'Exclusión de componentes',
            routerLink: '/reservas/search'
          },
          {
            label: 'Usuario por default',
            routerLink: '/reservas/usuariodefault'
          }
        ]
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
