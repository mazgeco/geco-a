import { Routes } from '@angular/router';
import * as Layouts from './layouts/layouts.exports';
import * as Personas from './modules/personas/personas.exports';
import * as Productos from './modules/productos/productos.exports';
import * as Proveedores from './modules/proveedores/proveedores.exports';
import * as Reservas from './modules/reservas/reservas.exports';
import * as Seguridades from './modules/seguridades/seguridades.exports';
import * as Configuracion from './modules/configuracion/configuracion.exports';

export const routes: Routes = [
  {
    path: 'login',
    component: Layouts.AuthLayout
  },
  {
    path: 'main',
    component: Layouts.MainLayout
  },
  {
    path: 'personas',
    component: Layouts.PersonasLayout,
    children: [
      { path: 'dash', component: Personas.DshPer0001 },
      { path: 'search', component: Personas.BsqPer0001 },
      { path: 'persona/:id', component: Personas.WinPer0018 },
      { path: 'tipo-telefono', component: Personas.WinPer0001 },
      { path: 'tipo-direccion', component: Personas.WinPer0008 },
      { path: 'tipo-empresa', component: Personas.WinPer0002 },
      { path: 'tipo-denominacion', component: Personas.WinPer0003 },
      { path: 'tipo-identificacion', component: Personas.WinPer0005 },
      { path: 'tipo-caracteristicas', component: Personas.WinPer0006 },
      { path: 'paises', component: Personas.WinPer0009 },
      { path: 'provincias', component: Personas.WinPer0010 },
      { path: 'ciudades', component: Personas.WinPer0011 },
      { path: 'nacionalidades', component: Personas.WinPer0017 },
      { path: '', redirectTo: 'dash', pathMatch: 'full' },
    ]
  },
  {
    path: 'productos',
    component: Layouts.ProductosLayout,
    children: [
      { path: 'dash', component: Productos.DshPrd0001 },
      { path: 'search', component: Productos.BsqPrd0001 },
      { path: 'producto/:id', component: Productos.WinPrd0006 },
      { path: 'parametrizacion/operacion', component: Productos.WinPrd0001 },
      { path: 'parametrizacion/uens', component: Productos.WinPrd0002 },
      { path: 'parametrizacion/temporadas', component: Productos.WinPrd0003 },
      { path: 'parametrizacion/impuestos', component: Productos.WinPrd0004 },
      { path: '', redirectTo: 'dash', pathMatch: 'full' },
    ]
  },
  {
    path: 'proveedores',
    component: Layouts.ProveedoresLayout,
    children: [
      { path: 'dash', component: Proveedores.DshPrv0001 },
      { path: 'search', component: Proveedores.BsqPrv0001 },
      { path: 'proveedor/:id', component: Proveedores.WinPrv0001 },
      { path: '', redirectTo: 'dash', pathMatch: 'full' },
    ]
  },
  {
    path: 'reservas',
    component: Layouts.ReservasLayout,
    children: [
      { path: 'dash', component: Reservas.DshRes0001 },
      { path: 'search', component: Reservas.BsqRes0001 },
      { path: 'reserva/:id', component: Reservas.WinRes0003 },
      { path: '', redirectTo: 'dash', pathMatch: 'full' },
    ]
  },
  {
    path: 'seguridades',
    component: Layouts.SeguridadesLayout,
    children: [
      { path: 'dash', component: Seguridades.DshSeg0001 },
      { path: 'search', component: Seguridades.BsqSeg0001 },
      { path: 'usuario/:id', component: Seguridades.WinSeg0007 },
      { path: '', redirectTo: 'dash', pathMatch: 'full' },
    ]
  },
  {
    path: 'configuracion',
    component: Layouts.ConfiguracionLayout,
    children: [
      { path: 'dash', component: Configuracion.DshCnf0001 },
      { path: 'search', component: Configuracion.BsqCnf0001 },
      { path: 'empresa', component: Configuracion.WinCnf0001 },
      { path: '', redirectTo: 'dash', pathMatch: 'full' },
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
