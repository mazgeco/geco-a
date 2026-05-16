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
   * @param summary: Título del mensaje
   * @param detail: Texto del mensaje
   * @param life: El tiempo en ms que dura el mensaje en pantalla, se puede modificar, pero por default es 2s
   */
  showMessage(type: string, summary: string, detail: string = '', life = 2000) {
    this.messageService.add({
      severity: type,
      summary,
      detail,
      life
    });
  }

  clear() {
    this.messageService.clear();
  }
}