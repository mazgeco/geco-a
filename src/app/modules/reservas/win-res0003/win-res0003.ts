//Imports core
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
//Imports propios
import { FrmRes0003 } from './frm-res0003/frm-res0003';
import { GrdRes0021 } from './grd-res0021/grd-res0021';
import { StateService } from '../state-service';

@Component({
  selector: 'app-win-res0003',
  imports: [...PRIMENG_MODULES, FrmRes0003, GrdRes0021],
  templateUrl: './win-res0003.html',
  styleUrl: './win-res0003.css',
})
export class WinRes0003 implements OnInit {
  idReserva = signal<number>(0);

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  stateService = inject(StateService);

  ngOnInit(): void {
    this.stateService.reserva.set(null);
    //Toma el dato enviado por el router para colocar en el id principal
    this.idReserva.set(Number(this.route.snapshot.paramMap.get('id')));
  }
  reservaGuardada(id: number): void {
    if (this.idReserva() === id) return;
    this.idReserva.set(id);
    this.location.replaceState(`/reservas/reserva/${id}`);
  }
}
