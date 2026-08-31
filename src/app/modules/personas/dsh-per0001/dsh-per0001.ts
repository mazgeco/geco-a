import { Component, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { ChartModule } from 'primeng/chart';
import { PersonasService } from '../../../services/personas.service';
import { FuntionsService } from '../../../services/functions.service';


@Component({
  selector: 'app-dsh-per0001',
  imports: [...PRIMENG_MODULES, ChartModule],
  templateUrl: './dsh-per0001.html',
  styleUrl: './dsh-per0001.css',
})
export class DshPer0001 implements OnInit {

  //Variables para las barras de personas por módulos
  barData: any;
  barOptions: any;
  isLoadingBar = signal<boolean>(false);
  //Variables para el pie de Nacionalidades
  pieData1: any;
  pieOptions1: any;
  isLoadingPie1 = signal<boolean>(false);
  //Variables para el pie de Tipos de Empresas
  pieData2: any;
  pieOptions2: any;
  isLoadingPie2 = signal<boolean>(false);
  //Funtions service
  functionsService = inject(FuntionsService);
  //Servicio personas
  personasService = inject(PersonasService);

  ngOnInit(): void {
    this.initPieNacionalidades();
    this.initPieTipoEmpresas();
    this.initBarPersonasModulos();
  }

  //Pie de Nacionalidades
  initPieNacionalidades(): void {
    this.isLoadingPie1.set(true);
    this.personasService.graficoNacionalidades().subscribe({
      next: (resp) => {
        this.pieData1 = this.functionsService.crearChart(resp.data);
        this.isLoadingPie1.set(false);
      },
      error: (err) => {
        console.log(err.error.message);
        this.isLoadingPie1.set(false);
      }
    });
    this.pieOptions1 = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Nacionalidades'
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

  //Pie de Tipos de empresas
  initPieTipoEmpresas(): void {
    this.isLoadingPie2.set(true);
    this.personasService.graficoTipoEmpresas().subscribe({
      next: (resp) => {
        this.pieData2 = this.functionsService.crearChart(resp.data);
        this.isLoadingPie2.set(false);
      },
      error: (err) => {
        console.log(err.error.message);
        this.isLoadingPie2.set(false);
      }
    });
    this.pieOptions2 = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Tipos de Empresas'
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

  initBarPersonasModulos(): void {
    this.isLoadingBar.set(true);
    this.personasService.graficoPersonasModulos().subscribe({
      next: (resp) => {
        this.barData = this.functionsService.crearChart(resp.data);
        this.isLoadingBar.set(false);
      },
      error: (err) => {
        console.log(err.error.message);
        this.isLoadingBar.set(false);
      }
    });

    this.barOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Personas por módulo'
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
