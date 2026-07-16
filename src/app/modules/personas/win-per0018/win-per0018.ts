import { Component, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Identificaciones } from '../../../interfaces/personas.interfaces';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-win-per0018',
  imports: [...PRIMENG_MODULES, DatePipe, NgClass],
  templateUrl: './win-per0018.html',
  styleUrl: './win-per0018.css',
})
export class WinPer0018 implements OnInit {

  private route = inject(ActivatedRoute);
  datoVer = signal<string>("general");
  idPersona = signal<number>(0);

  opciones: any[] = [
    {label:"Datos generales", value:'general'},
    {label:"Identificaciones", value:'identificaciones'},
    {label:"Direcciones", value:'direcciones'},
    {label:"Teléfonos", value:'telefonos'},
    {label:"Características", value:'caracteristicas'},
    {label:"Ficha médica", value:'ficha'}
  ];

  identificaciones = signal<Identificaciones[]>([
    {
      idIdentificacion: 1,
      idPersona: 1,
      idTipoIdentificacion: "C",
      descripcionIdentificacion: "1714361647",
      principalIdentificacion: "S",
      fechaCaducidad: new Date('2030-05-31'),
      idUsuarioCrea: "mgzapata",
      fechaCrea: new Date('2025-05-31'),
      idUsuarioModifica: "mgzapata",
      fechaModifica: new Date('2025-05-31')
    },
    {
      idIdentificacion: 2,
      idPersona: 1,
      idTipoIdentificacion: "R",
      descripcionIdentificacion: "1714361647001",
      principalIdentificacion: "N",
      fechaCaducidad: new Date('2030-05-31'),
      idUsuarioCrea: "mgzapata",
      fechaCrea: new Date('2025-05-31'),
      idUsuarioModifica: "mgzapata",
      fechaModifica: new Date('2025-05-31')
    }
  ]);

  ngOnInit(): void {
    this.idPersona.set(Number(this.route.snapshot.paramMap.get('id')));
  }

  cambiaDatoVer(event: any):void {
    this.datoVer.set(event.value);
  }
}
