import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PRIMENG_MODULES } from '../../shared/primeng/primeng.imports';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-seguridades-layout',
  imports: [...PRIMENG_MODULES, RouterOutlet],
  templateUrl: './seguridades-layout.html',
  styles: ``,
})
export class SeguridadesLayout implements OnInit {

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
        routerLink: '/seguridades/dash'
      },
      {
        label: 'Accesos y permisos',
        icon: 'pi pi-lock',
        items: [
          {
            label: 'Accesos a los módulos',
            routerLink: '/seguridades/accmodulos'
          },
          {
            label: 'Accesos a los objetos',
            routerLink: '/seguridades/accobjetos'
          },
          {
            label: 'Accesos a los menús',
            routerLink: '/seguridades/accmenus'
          }
        ]
      },
      {
        label: 'Seguridades',
        icon: 'pi pi-shield',
        items: [
          {
            label: 'Usuarios (búsqueda/creación)',
            routerLink: '/seguridades/search'
          },
          {
            label: 'Objetos',
            routerLink: '/seguridades/objetos'
          },
          {
            label: 'Perfiles',
            routerLink: '/seguridades/perfiles'
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
