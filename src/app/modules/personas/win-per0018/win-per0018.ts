//Imports core
import { ActivatedRoute } from '@angular/router';
import {
  Component,
  computed,
  inject,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
//Objetos
import { GrdPer0010 } from './grd-per0010/grd-per0010';
import { GrdPer0006 } from './grd-per0006/grd-per0006';
import { GrdPer0002 } from './grd-per0002/grd-per0002';
import { GrdPer0008 } from './grd-per0008/grd-per0008';
import { GrdPer0019 } from './grd-per0019/grd-per0019';
import { FrmPer0001 } from './frm-per0001/frm-per0001';
import { StateService } from './state.service';

@Component({
  selector: 'app-win-per0018',
  imports: [
    ...PRIMENG_MODULES,
    FrmPer0001,
    GrdPer0002,
    GrdPer0006,
    GrdPer0008,
    GrdPer0010,
    GrdPer0019,
  ],
  providers: [ConfirmationService],
  templateUrl: './win-per0018.html',
  styleUrl: './win-per0018.css',
})
export class WinPer0018 implements OnInit {
  private route = inject(ActivatedRoute);
  stateService = inject(StateService);

  private idPersonaRuta = signal<number>(0);

  readonly idPersona = computed(
    () => this.stateService.persona()?.idPersona ?? this.idPersonaRuta(),
  );

  ngOnInit(): void {
    this.stateService.persona.set(null);
    this.idPersonaRuta.set(Number(this.route.snapshot.paramMap.get('id')) || 0);
  }
}
