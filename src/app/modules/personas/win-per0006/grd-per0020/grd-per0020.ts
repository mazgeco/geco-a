import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { FuntionsService } from '../../../../services/functions.service';
import { PersonasService } from '../../../../services/personas.service';
import { ToastService } from '../../../../services/toast.service';
import { MessageService } from '../../../../services/message.service';
import { FilaTabla, StatusMessage } from '../../../../interfaces/general.interface';
import { TipoCaracteristicas } from '../../../../interfaces/personas.interfaces';

@Component({
  selector: 'app-grd-per0020',
  imports: [...PRIMENG_MODULES],
  providers: [ConfirmationService],
  templateUrl: './grd-per0020.html',
  styles: ``,
})
export class GrdPer0020 implements OnInit {

  ngOnInit(): void {
    
  }

}
