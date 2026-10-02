import { Component, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { ChartModule } from 'primeng/chart';
import { ReservasService } from '../../../services/reservas.service';
import { FuntionsService } from '../../../services/functions.service';

@Component({
  selector: 'app-dsh-res0001',
  imports: [...PRIMENG_MODULES, ChartModule],
  templateUrl: './dsh-res0001.html',
  styleUrl: './dsh-res0001.css',
})
export class DshRes0001 implements OnInit {
  //Variables barras ventas por año y por mes
  pieData: any;
  pieOptions: any;
  isLoadingPie = signal<boolean>(false);
  //Variables barras ventas por año y por mes
  barData1: any;
  barOptions1: any;
  isLoadingBar1 = signal<boolean>(false);
  //Variables barras ventas por vendedor en un año
  barData2: any;
  barOptions2: any;
  isLoadingBar2 = signal<boolean>(false);

  data: any;
  options: any;
  barData: any;
  barOptions: any;

  private reservasService = inject(ReservasService);
  private functionsService = inject(FuntionsService);

  ngOnInit(): void {
    this.initBarChartVentasXAnioXMes();
    this.initBarChartVentasXVendedor();
    this.initPieChartReservasXEstado();
  }

  initPieChartReservasXEstado(): void {
    this.isLoadingPie.set(true);
    this.reservasService.graficoReservasXEstado().subscribe({
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
          text: 'Reservas por estado',
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

  initBarChartVentasXAnioXMes(): void {
    this.isLoadingBar1.set(true);
    this.reservasService.graficoVentasXAnioXMes().subscribe({
      next: (response) => {
        const datos = response.data;
        this.barData1 = {
          labels: datos.map((item) => item.mes),
          datasets: [
            {
              label: datos[0]?.anio1.toString(),
              data: datos.map((item) => item.ventasAnio1),
            },
            {
              label: datos[0]?.anio2.toString(),
              data: datos.map((item) => item.ventasAnio2),
            },
            {
              label: datos[0]?.anio3.toString(),
              data: datos.map((item) => item.ventasAnio3),
            },
          ],
        };
        this.barOptions1 = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            title: {
              display: true,
              text: 'Ventas por año por mes',
            },
          },
          scales: {
            x: {
              stacked: false,
            },
            y: {
              beginAtZero: true,
            },
          },
        };
        this.isLoadingBar1.set(false);
      },
      error: (err) => {
        console.error('Error al obtener gráfico de ventas por año y mes:', err);
        this.isLoadingBar1.set(false);
      },
    });
  }

  initBarChartVentasXVendedor(): void {
    this.isLoadingBar2.set(true);
    this.reservasService.graficoVentasXVendedor().subscribe({
      next: (resp) => {
        this.barData2 = this.functionsService.crearChart(resp.data);
        this.barOptions2 = {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,

          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: 'Ventas por vendedor',
            },
          },
          scales: {
            x: {
              beginAtZero: true,
            },
          },
        };
        this.isLoadingBar2.set(false);
      },
      error: (err) => {
        console.log(err.error.message);
        this.isLoadingBar2.set(false);
      },
    });
  }
}
