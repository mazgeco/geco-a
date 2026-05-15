import { Component, inject, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-home-personas-page',
  imports: [...PRIMENG_MODULES, RouterOutlet],
  templateUrl: './home-personas-page.html',
  styleUrl: './home-personas-page.css',
})
export class HomePersonasPage implements OnInit {
  router = inject(Router);
  menuItems: MenuItem[] | undefined;

  ngOnInit(): void {
    this.menuItems = [
      {
        label: "Módulos",
        icon: "pi pi-angle-double-left",
        routerLink: "/main/"
      },
      {
        label: "Personas"
      },
      {
        label: "Reportes",
        items: [
          {
            label: "Reporte cumpleaños"
          },
          {
            label: "Reporte personas"
          }
        ]
      }
    ];
  }

}
