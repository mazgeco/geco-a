import { Component, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dash-personas-page',
  imports: [...PRIMENG_MODULES, ChartModule],
  templateUrl: './dash-personas-page.html',
  styleUrl: './dash-personas-page.css',
})
export class DashPersonasPage implements OnInit {

  data: any;
  options: any;
  barData: any;
  barOptions: any;

  ngOnInit(): void {
    this.initPieChart();
    this.initBarChart();
  }

  initPieChart(): void {
    this.data = {
      labels: ['Java', 'Angular', 'Spring Boot', 'Docker'],
      datasets: [
        {
          data: [40, 25, 20, 15],
          backgroundColor: [
            '#42A5F5',
            '#66BB6A',
            '#FFA726',
            '#EF5350'
          ],
          hoverBackgroundColor: [
            '#64B5F6',
            '#81C784',
            '#FFB74D',
            '#E57373'
          ]
        }
      ]
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      }
    };
  }

  initBarChart(): void {
    this.barData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
      datasets: [
        {
          label: 'Ventas',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          borderWidth: 1,
          data: [120, 190, 300, 500, 200]
        },
        {
          label: 'Compras',
          backgroundColor: '#66BB6A',
          borderColor: '#43A047',
          borderWidth: 1,
          data: [100, 150, 250, 400, 180]
        }
      ]
    };

    this.barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };
  }

}
