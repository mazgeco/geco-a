import { Component, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { ChartModule } from 'primeng/chart';
import { ProductosService } from '../../../services/productos.service';
import { FuntionsService } from '../../../services/functions.service';

@Component({
  selector: 'app-dsh-prd0001',
  imports: [...PRIMENG_MODULES, ChartModule],
  templateUrl: './dsh-prd0001.html',
  styleUrl: './dsh-prd0001.css',
})
export class DshPrd0001 implements OnInit {

  pieData: any;
  pieOptions: any;
  isLoadingPie = signal<boolean>(false);

  //Variables para estados de productos
  barData: any;
  barOptions: any;
  isLoadingBar = signal<boolean>(false);

  //Variables para productos por tipo de precio
  barData1: any;
  barOptions1: any;
  isLoadingBar1 = signal<boolean>(false);

  //Funtions service
  functionsService = inject(FuntionsService);
  //Servicio personas
  productosService = inject(ProductosService);

  ngOnInit(): void {
    this.initBarProductosEstado();
    this.initPieTipoProductos(); 
    this.initBarProductosTipoPrecio(); 
  }


  //Pie de tipo de productos
  initPieTipoProductos(): void {
    this.isLoadingPie.set(true);
    this.productosService.graficoProductosTipoProducto().subscribe({
      next: (resp) => {
        this.pieData = this.functionsService.crearChart(resp.data);
        this.isLoadingPie.set(false);
      },
      error: (err) => {
        console.log(err.error.message);
        this.isLoadingPie.set(false);
      }
    });
    this.pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Tipo de Productos'
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label;
              const value = context.raw;
              return `${label}: ${value.toLocaleString()}`;
            }
          }
        }
      }
    };
  }

  initBarProductosEstado(): void {
    this.isLoadingBar.set(true);

    this.productosService.graficoProductosEstado().subscribe({
      next: (resp) => {
        this.barData = this.functionsService.crearChart(resp.data);
        this.isLoadingBar.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoadingBar.set(false);
      }
    });

    this.barOptions = {
      indexAxis: 'x', 
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Productos por Estado'
        }
      },
      scales: {
        x: {
          beginAtZero: true
        }
      }
    };
  }

   initBarProductosTipoPrecio(): void {
    this.isLoadingBar1.set(true);

    this.productosService.graficoProductosTipoPrecio().subscribe({
      next: (resp) => {
        this.barData1 = this.functionsService.crearChart(resp.data);
        this.isLoadingBar1.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoadingBar1.set(false);
      }
    });

    this.barOptions1 = {
      indexAxis: 'y', 
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Productos por Tipo de Precio'
        }
      },
      scales: {
        x: {
          beginAtZero: true
        }
      }
    };
  }
}
