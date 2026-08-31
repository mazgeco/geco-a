
//Imports core
import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
//Objetos
// import { GrdPer0010 } from './grd-per0010/grd-per0010';
// import { GrdPer0006 } from "./grd-per0006/grd-per0006";
// import { GrdPer0002 } from './grd-per0002/grd-per0002';
// import { GrdPer0008 } from './grd-per0008/grd-per0008';
// import { GrdPer0019 } from './grd-per0019/grd-per0019';
import { FrmPrd0002 } from "./frm-prd0002/frm-prd0002";
import { FrmPrd0004 } from "./frm-prd0004/frm-prd0004";
import { StateService } from './state-service';
import { GrdPrd0011 } from "./grd-prd0011/grd-prd0011";


@Component({
  selector: 'app-win-prd0006',
  imports: [...PRIMENG_MODULES, FrmPrd0002, FrmPrd0004, GrdPrd0011],
  providers: [ConfirmationService],
  templateUrl: './win-prd0006.html',
  styleUrl: './win-prd0006.css'
})
export class WinPrd0006 implements OnInit {

  idProducto = signal<string>('0');

  private route = inject(ActivatedRoute);
  stateService = inject(StateService);

  ngOnInit(): void {
    //Toma el dato enviado por el router para colocar en el id principal
    //this.idProducto.set(this.route.snapshot.paramMap.get('id') || '0');
    this.route.paramMap.subscribe(params => {
      const nuevoId = params.get('id') || '0';
      this.idProducto.set(nuevoId);
    });
  }

}