import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';
import { Insumos } from '../../../interfaces/proveedores.interfaces';
import { ProveedoresService } from '../../../services/proveedores.service';
import { ToastService } from '../../../services/toast.service';
import { MessageService } from '../../../services/message.service';
import { StatusMessage } from '../../../interfaces/general.interface';

@Component({
  selector: 'app-bsq-prv0002',
  imports: [...PRIMENG_MODULES],
  templateUrl: './bsq-prv0002.html',
  styleUrl: './bsq-prv0002.css',
})
export class BsqPrv0002 implements OnInit {
  router = inject(Router);
  toastService = inject(ToastService);
  loading = signal<boolean>(false);
  notificacion = signal<string>('');

  proveedoresService = inject(ProveedoresService);
  insumos = signal<Insumos[]>([]);

  //Variables para manejo de mensajes
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  busquedaMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgBsqPer0001')
  );

   buscarInsumos(nombre: string): void {
    this.loading.set(true),
      this.proveedoresService.buscaInsumos(nombre).subscribe({
        next: (resp) => {
          this.insumos.set([]);
          this.insumos.set(resp.data);
          this.messageService.mostrar(
            this.statusMessages,
            'msgBsqPer0001',
            'success',
            `${resp.data.length} registros encontrados`
          );
          this.loading.set(false);
        },
        error: (err) => {
          this.insumos.set([]);
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

  ngOnInit(): void {}

  openInsumo(): void {
    this.router.navigate(['/proveedores/insumo/', '0']);
  }

  seleccionarInsumo(insumo: Insumos): void {
    this.router.navigate(['/proveedores/insumo/', insumo.idInsumo]);
  }
}
