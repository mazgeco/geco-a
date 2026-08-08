import { Routes } from '@angular/router';
import * as Layouts from './layouts/layouts.exports';
import * as Personas from './modules/personas/personas.exports';
import * as Productos from './modules/productos/productos.exports';
import * as Proveedores from './modules/proveedores/proveedores.exports';

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
      { path: '', redirectTo: 'dash', pathMatch: 'full' }
    ]
  },  
  {
    path: 'productos',
    component: Layouts.ProductosLayout,
    children: [
      { path: 'dash', component: Productos.DshPrd0001 },
      { path: 'search', component: Productos.BsqPrd0001 },
      { path: 'producto/:id', component: Productos.WinPrd0006 },
      { path: '', redirectTo: 'dash', pathMatch: 'full' }
    ]
  },
  {
    path: 'proveedores',
    component: Layouts.ProveedoresLayout,
    children: [
      { path: 'dash', component: Proveedores.DshPrv0001 },
      { path: 'search', component: Proveedores.BsqPrv0001 },
      { path: 'proveedor/:id', component: Proveedores.WinPrv0001 },
      { path: '', redirectTo: 'dash', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
