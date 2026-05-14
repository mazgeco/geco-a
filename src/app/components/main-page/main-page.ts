import { Component, inject, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';

interface Modulo {
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
}

@Component({
  selector: 'app-main-page',
  imports: [...PRIMENG_MODULES],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {

  router = inject(Router);

  modulos = signal<Modulo[]>([
    {
      nombre: 'Personas',
      descripcion: 'Administración de las personas del sistema',
      icono: 'pi pi-users',
      color: '#f59e0b'
    },
    {
      nombre: 'Productos',
      descripcion: 'Administración de todos los productos para la venta',
      icono: 'pi pi-objects-column',
      color: '#10b981'
    },
    {
      nombre: 'Proveedores',
      descripcion: 'Control de proveedores e insumos',
      icono: 'pi pi-tags',
      color: '#044e35'
    },
    {
      nombre: 'Reservas',
      descripcion: 'Gestión de reservas',
      icono: 'pi pi-calendar-plus',
      color: '#730fd1'
    },
    {
      nombre: 'Seguridad',
      descripcion: 'Roles y permisos',
      icono: 'pi pi-shield',
      color: '#e9e517'
    },
    {
      nombre: 'Configuración',
      descripcion: 'Parámetros generales',
      icono: 'pi pi-cog',
      color: '#b91035'
    }
  ]);

  abrirModulo(modulo: Modulo): void {
    console.log(modulo.descripcion);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }


}
