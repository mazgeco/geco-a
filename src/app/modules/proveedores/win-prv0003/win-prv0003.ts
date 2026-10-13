//Imports core
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Component, inject, Input, OnInit, signal } from '@angular/core';

//Objetos
import { StateService } from './state-service';
import { FrmPrv0001 } from './frm-prv0001/frm-prv0001';


@Component({
  selector: 'app-win-prv0003',
  imports: [...PRIMENG_MODULES, FrmPrv0001],
  providers: [ConfirmationService],
  templateUrl: './win-prv0003.html'
})

export class WinPrv0003 implements OnInit {
  idInsumo = signal<number>(0);

  private route = inject(ActivatedRoute);
  stateService = inject(StateService);

  ngOnInit(): void {
    this.stateService.insumo.set(null);
    //Toma el dato enviado por el router para colocar en el id principal
    this.idInsumo.set(Number(this.route.snapshot.paramMap.get('id')));
    this.route.paramMap.subscribe(params => {
      const nuevoId = Number(params.get('id')) || 0;
      this.idInsumo.set(nuevoId);
    });
  }
}

