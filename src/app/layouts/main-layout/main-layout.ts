import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PRIMENG_MODULES } from '../../shared/primeng/primeng.imports';
import { Modulo } from '../../interfaces/general.interface';

@Component({
  selector: 'app-main-layout',
  imports: [...PRIMENG_MODULES],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout implements OnInit {

  menuItems: MenuItem[] | undefined;
  router = inject(Router);
  modulos = signal<Modulo[]>([]);

  ngOnInit(): void {

    this.menuItems = [
      {
        label: "Salir",
        icon: "pi pi-power-off",
        routerLink: '/login/'
      }
    ];

    this.modulos.set([
      {
        nombre: 'Personas',
        descripcion: 'Administración de las personas del sistema',
        ruta: '/personas',
        icono: 'pi pi-users',
        color: '#f59e0b'
      },
      {
        nombre: 'Productos',
        descripcion: 'Administración de todos los productos para la venta',
        ruta: '/productos/home',
        icono: 'pi pi-objects-column',
        color: '#10b981'
      },
      {
        nombre: 'Proveedores',
        descripcion: 'Control de proveedores e insumos',
        ruta: '/personas/home',
        icono: 'pi pi-tags',
        color: '#044e35'
      },
      {
        nombre: 'Reservas',
        descripcion: 'Gestión de reservas',
        ruta: '/reservas/home',
        icono: 'pi pi-calendar-plus',
        color: '#730fd1'
      },
      {
        nombre: 'Seguridad',
        descripcion: 'Roles y permisos',
        ruta: '/seguridad/home',
        icono: 'pi pi-shield',
        color: '#e9e517'
      },
      {
        nombre: 'Configuración',
        descripcion: 'Parámetros generales',
        ruta: '/configuracion/home',
        icono: 'pi pi-cog',
        color: '#b91035'
      }
    ]);
  }

  abrirModulo(modulo: Modulo): void {
    this.router.navigate([modulo.ruta]);
  }
}
