import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';
import { Usuarios } from '../../../interfaces/seguridades.interface';
import { SeguridadesService } from '../../../services/seguridades.service';
import { MessageService } from '../../../services/message.service';
import { StatusMessage } from '../../../interfaces/general.interface';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-bsq-seg0001',
  imports: [...PRIMENG_MODULES],
  templateUrl: './bsq-seg0001.html',
  styleUrl: './bsq-seg0001.css',
})
export class BsqSeg0001 {
  router = inject(Router);
  seguridadesService = inject(SeguridadesService);
  toastService = inject(ToastService);
  usuarios = signal<Usuarios[]>([]);
  loading = signal<boolean>(false);
  notificacion = signal<string>('');

  //Variables para manejo de mensajes
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  busquedaMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgBsqSeg0001'),
  );
  
  buscarUsuario(nombre: string): void {
    this.loading.set(true),
      this.seguridadesService.buscaUsuario(nombre).subscribe({
        next: (resp) => {
          this.usuarios.set([]);
          this.usuarios.set(resp.data);
          this.messageService.mostrar(
            this.statusMessages,
            'msgBsqSeg0001',
            'success',
            `${resp.data.length} registros encontrados`
          );
          this.loading.set(false);
        },
        error: (err) => {
          this.usuarios.set([]);
          this.loading.set(false);
          if (err.error.status === "NOT_FOUND") {
            this.notificacion.set("0 registos encontrados");
          } else {
            this.notificacion.set("");
            this.toastService.showMessage("error", "Error", "Ha ocurrido un error: " + err.error.message);
          }
        }
      });
  }

  openUsuario(): void {
    this.messageService.clearAllTimers();
    this.router.navigate(['/seguridades/usuario/', '0']);
  }

  seleccionarUsuario(usuario: Usuarios): void {
    this.messageService.clearAllTimers();
    this.router.navigate(['/seguridades/usuario/', usuario.idUsuario]);
  }
}
