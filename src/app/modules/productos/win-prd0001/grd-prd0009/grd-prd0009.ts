import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { NgClass } from '@angular/common';

import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
import { FuntionsService } from '../../../../services/functions.service';
import { PersonasService } from '../../../../services/personas.service';
import { ToastService } from '../../../../services/toast.service';
import { MessageService } from '../../../../services/message.service';
import {
  FilaTabla,
  StatusMessage,
} from '../../../../interfaces/general.interface';
@Component({
  selector: 'app-grd-prd0009',
  imports: [...PRIMENG_MODULES, NgClass],
   providers: [ConfirmationService],
  templateUrl: './grd-prd0009.html',
  styles: ``,
})
export class GrdPrd0009 {}
