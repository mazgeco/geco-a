import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';
import { Proveedores } from '../../../interfaces/proveedores.interfaces';
import { ProveedoresService } from '../../../services/proveedores.service';
import { ToastService } from '../../../services/toast.service';
import { MessageService } from '../../../services/message.service';
import { StatusMessage } from '../../../interfaces/general.interface';

@Component({
  selector: 'app-bsq-prv0001',
  imports: [...PRIMENG_MODULES],
  templateUrl: './bsq-prv0001.html',
  styleUrl: './bsq-prv0001.css',
})
export class BsqPrv0001 implements OnInit {
  router = inject(Router);
  toastService = inject(ToastService);
  loading = signal<boolean>(false);
  notificacion = signal<string>('');

  proveedoresService = inject(ProveedoresService);
  proveedores = signal<Proveedores[]>([]);

  //Variables para manejo de mensajes
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  busquedaMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgBsqPer0001')
  );

   buscarProveedor(nombre: string): void {
    this.loading.set(true),
      this.proveedoresService.buscaProveedor(nombre).subscribe({
        next: (resp) => {
          this.proveedores.set([]);
          this.proveedores.set(resp.data);
          this.messageService.mostrar(
            this.statusMessages,
            'msgBsqPer0001',
            'success',
            `${resp.data.length} registros encontrados`
          );
          this.loading.set(false);
        },
        error: (err) => {
          this.proveedores.set([]);
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

  openProveedor(): void {
    this.router.navigate(['/proveedores/proveedor/', '0']);
  }

  seleccionarProveedor(proveedor: Proveedores): void {
    this.router.navigate(['/proveedores/proveedor/', proveedor.idProveedor]);
  }
}
