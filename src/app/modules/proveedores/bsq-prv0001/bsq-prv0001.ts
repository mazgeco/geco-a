import { Component, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';
import { EstadoProveedor, Opcion, Proveedores } from '../../../interfaces/proveedores.interfaces';

@Component({
  selector: 'app-bsq-prv0001',
  imports: [...PRIMENG_MODULES],
  templateUrl: './bsq-prv0001.html',
  styleUrl: './bsq-prv0001.css',
})
export class BsqPrv0001 implements OnInit {

  router = inject(Router);
  proveedores = signal<Proveedores[]>([
    {
      idProveedor: 1,
      idPersona: 1111,
      nombreProveedor: "Agencia 1",
      estadoProveedor: EstadoProveedor.A,
      esInterno: Opcion.N,
      idUsuarioCrea: "sistemas",
      fechaCrea: "2020-01-01"
    },
    {
      idProveedor: 2,
      idPersona: 1112,
      nombreProveedor: "Agencia 2",
      estadoProveedor: EstadoProveedor.A,
      esInterno: Opcion.N,
      idUsuarioCrea: "sistemas",
      fechaCrea: "2020-01-01"
    },
    {
      idProveedor: 3,
      idPersona: 1113,
      nombreProveedor: "Agencia 3",
      estadoProveedor: EstadoProveedor.A,
      esInterno: Opcion.N,
      idUsuarioCrea: "sistemas",
      fechaCrea: "2020-01-01"
    }
  ]);

  ngOnInit(): void {

  }

  openProveedor(): void {
    this.router.navigate(['/proveedores/proveedor/', '0']);
  }

  seleccionarProveedor(proveedor: Proveedores): void {
    this.router.navigate(['/proveedores/proveedor/', proveedor.idProveedor]);
  }
}
