import { Component, inject, OnChanges, OnDestroy, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';
import { EstadoProducto, IndividualGeneral, Opcion, Productos, TipoBien, TipoPrecio } from '../../../interfaces/productos.interfaces';

@Component({
  selector: 'app-bsq-prd0001',
  imports: [...PRIMENG_MODULES],
  templateUrl: './bsq-prd0001.html',
  styleUrl: './bsq-prd0001.css',
})
export class BsqPrd0001 implements OnInit {

  router = inject(Router);
  productos = signal<Productos[]>([
    {
      idProducto: "PROD0001",
      idTipoProducto: "TPRD0001",
      nombreTipoProducto: "Tour",
      nombreCorto: "Tour Galápagos 7 días",
      estadoProducto: EstadoProducto.A,
      tipoBien: TipoBien.Srv,
      tipoPrecio: TipoPrecio.F,
      cortaItinerario: Opcion.N,
      individualGeneral: IndividualGeneral.G,
      seReserva: Opcion.S,
      bloqueaHorario: Opcion.N,
      dependeItinerario: Opcion.S,
      esEspacio: Opcion.N,
      seDivide: Opcion.N,
      idUsuarioCrea: "sistemas",
      fechaCrea: "2020-01-01"
    },
    {
      idProducto: "PROD0002",
      idTipoProducto: "TPRD0001",
      nombreTipoProducto: "Tour",
      nombreCorto: "Tour Sierra 7 días",
      estadoProducto: EstadoProducto.A,
      tipoBien: TipoBien.Srv,
      tipoPrecio: TipoPrecio.F,
      cortaItinerario: Opcion.N,
      individualGeneral: IndividualGeneral.G,
      seReserva: Opcion.S,
      bloqueaHorario: Opcion.N,
      dependeItinerario: Opcion.S,
      esEspacio: Opcion.N,
      seDivide: Opcion.N,
      idUsuarioCrea: "sistemas",
      fechaCrea: "2020-01-01"
    },
    {
      idProducto: "PROD0003",
      idTipoProducto: "TPRD0001",
      nombreTipoProducto: "Tour",
      nombreCorto: "Tour Oriente 7 días",
      estadoProducto: EstadoProducto.A,
      tipoBien: TipoBien.Srv,
      tipoPrecio: TipoPrecio.F,
      cortaItinerario: Opcion.N,
      individualGeneral: IndividualGeneral.G,
      seReserva: Opcion.S,
      bloqueaHorario: Opcion.N,
      dependeItinerario: Opcion.S,
      esEspacio: Opcion.N,
      seDivide: Opcion.N,
      idUsuarioCrea: "sistemas",
      fechaCrea: "2020-01-01"
    }
  ]);

  ngOnInit(): void {
    
  }
  
    openProducto(): void {
      this.router.navigate(['/productos/producto/', '0']);
    }
  
    seleccionarProducto(producto: Productos):void{
      this.router.navigate(['/productos/producto/',  producto.idProducto]);
    }
}
