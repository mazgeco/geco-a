import { Component, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { ChartModule } from 'primeng/chart';
import { FuntionsService } from '../../../services/functions.service';
import { ProveedoresService } from '../../../services/proveedores.service';

@Component({
  selector: 'app-dsh-prv0001',
  imports: [...PRIMENG_MODULES, ChartModule],
  templateUrl: './dsh-prv0001.html',
  styleUrl: './dsh-prv0001.css',
})
export class DshPrv0001 implements OnInit {
  //Variables para las barras de proveedores por años
  barData1: any;
  barOptions1: any;
  isLoadingBar1 = signal<boolean>(false);
  //Variables para las barras de proveedores por clasificador
  barData2: any;
  barOptions2: any;
  isLoadingBar2 = signal<boolean>(false);
  //Variables para el pie de Estados
  pieData: any;
  pieOptions: any;
  isLoadingPie = signal<boolean>(false);
  //Funtions service
  functionsService = inject(FuntionsService);
  //Proveedores service
  proveedoresService = inject(ProveedoresService);

  data: any;
  options: any;

  ngOnInit(): void {
    this.initPieChartProveedoresPorEstado();
    this.initBarChartProveedoresPorAnio();
    this.initBarChartProveedoresPorClasificador();
  }

  initPieChartProveedoresPorEstado(): void {
    this.isLoadingPie.set(true);
    this.proveedoresService.graficoProveedorPorEstado().subscribe({
      next: (resp) => {
        this.pieData = this.functionsService.crearChart(resp.data);
        this.isLoadingPie.set(false);
      },
      error: (err) => {
        console.log(err.error.message);
        this.isLoadingPie.set(false);
      },
    });
    this.pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'Proveedores por estado',
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label;
              const value = context.raw;
              return `${label}: ${value.toLocaleString()}`;
            },
          },
        },
      },
    };
  }

  initBarChartProveedoresPorAnio(): void {
    this.isLoadingBar1.set(true);
    this.proveedoresService.graficoProveedorPorAnio().subscribe({
      next: (resp) => {
        this.barData1 = this.functionsService.crearChart(resp.data);
        this.isLoadingBar1.set(false);
      },
      error: (err) => {
        console.log(err.error.message);
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
          text: 'Proveedores por año'
        }
      },
      scales: {
        x: {
          beginAtZero: true
        }
      }
    };
  }

  initBarChartProveedoresPorClasificador(): void {
    this.isLoadingBar2.set(true);
    this.proveedoresService.graficoProveedorPorClasificador().subscribe({
      next: (resp) => {
        this.barData2 = this.functionsService.crearChart(resp.data);
        this.isLoadingBar2.set(false);
      },
      error: (err) => {
        console.log(err.error.message);
        this.isLoadingBar2.set(false);
      }
    });

    this.barOptions2 = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Proveedores por clasificador'
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
