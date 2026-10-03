//Imports core
import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
//Imports propios
import { FrmSeg0003 } from './frm-seg0003/frm-seg0003';
import { StateService } from './state.service';

@Component({
  selector: 'app-win-seg0007',
  imports: [...PRIMENG_MODULES, FrmSeg0003],
  templateUrl: './win-seg0007.html',
  styleUrl: './win-seg0007.css',
})
export class WinSeg0007 implements OnInit {
  
  idUsuario = signal<string>("");

  private route = inject(ActivatedRoute);
  stateService = inject(StateService);

  ngOnInit(): void {
    this.stateService.usuario.set(null);
    //Toma el dato enviado por el router para colocar en el id principal
    this.idUsuario.set(String(this.route.snapshot.paramMap.get('id')));
  }
}
