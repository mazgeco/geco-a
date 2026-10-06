//Imports core
import { ActivatedRoute } from '@angular/router';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
//Objetos
import { StateService } from './state-service';
import { FrmPrv0002 } from "./frm-prv0002/frm-prv0002";

@Component({
  selector: 'app-win-prv0001',
  imports: [...PRIMENG_MODULES, FrmPrv0002],
  providers: [ConfirmationService],
  templateUrl: './win-prv0001.html',
  styleUrl: './win-prv0001.css',
})
export class WinPrv0001 implements OnInit {
  idProveedor = signal<number>(0);

  private route = inject(ActivatedRoute);
  stateService = inject(StateService);

  ngOnInit(): void {
    //Toma el dato enviado por el router para colocar en el id principal
    this.idProveedor.set(Number(this.route.snapshot.paramMap.get('id')));
    this.route.paramMap.subscribe(params => {
      const nuevoId = Number(params.get('id')) || 0;
      this.idProveedor.set(nuevoId);
    });
  }
}






