import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) { }

  /**
   * showMessage: Envía un mensaje del tipo requerido
   * @param type: Puede ser: success, error, warn, info
   * @param summary 
   * @param detail 
   * @param status: Es el status del error que viene del back-end
   * @param life 
   */
  showMessage(type: string, summary: string, detail: string = '', status: string = '', life = 2000) {
    if (status !== 'NOT_FOUND') {
      this.messageService.add({
        severity: type,
        summary,
        detail,
        life
      });
    }
  }

  clear() {
    this.messageService.clear();
  }
}