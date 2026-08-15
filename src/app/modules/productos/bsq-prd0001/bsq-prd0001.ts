import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';
import { ProductosService } from '../../../services/productos.service';
import { ToastService } from '../../../services/toast.service';
import { Productos } from '../../../interfaces/productos.interfaces';
import { MessageService } from '../../../services/message.service';
import { StatusMessage } from '../../../interfaces/general.interface';
import { EstadoProducto, IndividualGeneral, Opcion, TipoBien, TipoPrecio } from '../../../interfaces/productos.interfaces';

@Component({
  selector: 'app-bsq-prd0001',
  imports: [...PRIMENG_MODULES],
  templateUrl: './bsq-prd0001.html',
  styleUrl: './bsq-prd0001.css',
})
export class BsqPrd0001 {

  router = inject(Router);
  productosService = inject(ProductosService)
  toastService = inject(ToastService);
  productos = signal<Productos[]>([]);
  loading = signal<boolean>(false);
  notificacion = signal<string>("");

  //Variables para manejo de mensajes
  messageService = inject(MessageService);
  statusMessages = signal<Record<string, StatusMessage>>({});
  busquedaMessage = computed(() =>
    this.messageService.obtener(this.statusMessages, 'msgBsqPrd0001')
  );


  buscarProducto(nombre: string): void {
    this.loading.set(true),
      this.productosService.buscaProducto(nombre).subscribe({
        next: (resp) => {
          this.productos.set([]);
          this.productos.set(resp.data);
          this.messageService.mostrar(
            this.statusMessages,
            'msgBsqPrd0001',
            'success',
            `${resp.data.length} registros encontrados`
          );
          this.loading.set(false);
        },
        error: (err) => {
          this.productos.set([]);
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

  // ngOnInit(): void {
    
  // }
  
    openProducto(): void {
      this.router.navigate(['/productos/producto/', '0']);
    }
  
    seleccionarProducto(producto: Productos):void{
      this.router.navigate(['/productos/producto/',  producto.idProducto]);
    }
}
