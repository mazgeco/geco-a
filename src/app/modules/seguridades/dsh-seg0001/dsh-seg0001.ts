import { Component, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { ChartModule } from 'primeng/chart';
import { FuntionsService } from '../../../services/functions.service';
import { SeguridadesService } from '../../../services/seguridades.service';

@Component({
  selector: 'app-dsh-seg0001',
  imports: [...PRIMENG_MODULES, ChartModule],
  templateUrl: './dsh-seg0001.html',
  styleUrl: './dsh-seg0001.css',
})
export class DshSeg0001 implements OnInit {
  //Variagles pie permisos por perfil
  pieData: any;
  pieOptions: any;
  isLoadingPie = signal<boolean>(false);
  //Variables barras logeo usuarios
  barData1: any;
  barOptions1: any;
  isLoadingBar1 = signal<boolean>(false);
  //Variables barras usuarios por perfil
  barData2: any;
  barOptions2: any;
  isLoadingBar2 = signal<boolean>(false);
  //Funtions service
  functionsService = inject(FuntionsService);
  //Seguridades service
  seguridadesService = inject(SeguridadesService);


  ngOnInit(): void {
    this.initPieChartPermisosXPerfil();
    this.initBarChartLogeoUsuarios();
    this.initBarChartNroUsuariosXPerfil();
  }

  initPieChartPermisosXPerfil(): void {
    this.isLoadingPie.set(true);
    this.seguridadesService.graficoNroPermisosXPerfil().subscribe({
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
          text: 'Permisos por perfil',
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

  initBarChartLogeoUsuarios(): void {
    this.isLoadingBar1.set(true);
    this.seguridadesService.graficoLogeoUsuarios().subscribe({
      next: (resp) => {
        this.barData1 = this.functionsService.crearChart(resp.data);
        this.isLoadingBar1.set(false);
      },
      error: (err) => {
        console.log(err.error.message);
        this.isLoadingBar1.set(false);
      },
    });
    this.barOptions1 = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Logeo por usuario último mes',
        },
      },
      scales: {
        x: {
          beginAtZero: true,
        },
      },
    };
  }

  initBarChartNroUsuariosXPerfil(): void {
    this.isLoadingBar2.set(true);
    this.seguridadesService.graficoNroUsuariosXPerfil().subscribe({
      next: (resp) => {
        this.barData2 = this.functionsService.crearChart(resp.data);
        this.isLoadingBar2.set(false);
      },
      error: (err) => {
        console.log(err.error.message);
        this.isLoadingBar2.set(false);
      },
    });
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
          text: '#Usuarios por perfil',
        },
      },
      scales: {
        x: {
          beginAtZero: true,
        },
      },
    };
  }
}
