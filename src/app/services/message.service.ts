import { Injectable, WritableSignal } from '@angular/core';
import { StatusMessage } from '../interfaces/general.interface';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private readonly icons: Record<StatusMessage['severity'], string> = {
    success: 'pi pi-check-circle',
    info: 'pi pi-info-circle',
    warn: 'pi pi-exclamation-triangle',
    error: 'pi pi-times-circle',
    secondary: 'pi pi-info-circle',
    contrast: 'pi pi-megaphone'
  };

  private readonly timers: Record<string, ReturnType<typeof setTimeout>> = {};

  mostrar(
    mensajes: WritableSignal<Record<string, StatusMessage>>,
    id: string,
    severity: StatusMessage['severity'],
    text: string,
    icon?: string,
    duracion: number = 4000
  ): void {

    mensajes.update(m => ({
      ...m,
      [id]: {
        severity,
        text,
        icon: icon ?? this.icons[severity],
        visible: true
      }
    }));

    if (this.timers[id]) {
      clearTimeout(this.timers[id]);
    }

    if (duracion > 0) {
      this.timers[id] = setTimeout(() => {
        this.ocultar(mensajes, id);
        delete this.timers[id];
      }, duracion);

    }

  }

  clearAllTimers(): void {
    for (const [id, timer] of Object.entries(this.timers)) {
      clearTimeout(timer);
      delete this.timers[id];
    }
  }

  ocultar(
    mensajes: WritableSignal<Record<string, StatusMessage>>,
    id: string
  ): void {
    mensajes.update(m => ({
      ...m,
      [id]: {
        ...m[id],
        visible: false
      }
    }));
  }

  obtener(
    mensajes: WritableSignal<Record<string, StatusMessage>>,
    id: string
  ): StatusMessage | null {
    return mensajes()[id] ?? null;
  }

}