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
        color:'#3b82f6'
      },
      {
        nombre: 'Productos',
        descripcion: 'Administración de todos los productos para la venta',
        ruta: '/productos',
        icono: 'pi pi-box',
        color: '#22c55e'
      },
      {
        nombre: 'Proveedores',
        descripcion: 'Control de proveedores e insumos',
        ruta: '/proveedores',
        icono: 'pi pi-truck',
        color: '#f59e0b'
      },
      {
        nombre: 'Reservas',
        descripcion: 'Gestión de reservas',
        ruta: '/reservas',
        icono: 'pi pi-calendar-plus',
        color: '#8b5cf6'
      },
      {
        nombre: 'Seguridades',
        descripcion: 'Roles y permisos',
        ruta: '/seguridades',
        icono: 'pi pi-shield',
        color: '#ef4444'
      },
      {
        nombre: 'Configuración',
        descripcion: 'Parámetros generales',
        ruta: '/configuracion',
        icono: 'pi pi-cog',
        color: '#14b8a6'
      }
    ]);
  }

  abrirModulo(modulo: Modulo): void {
    this.router.navigate([modulo.ruta]);
  }
}
