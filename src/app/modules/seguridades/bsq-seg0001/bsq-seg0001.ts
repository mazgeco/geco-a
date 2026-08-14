import { Component, inject, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';
import { Usuarios } from '../../../interfaces/seguridades.interface';

@Component({
  selector: 'app-bsq-seg0001',
  imports: [...PRIMENG_MODULES],
  templateUrl: './bsq-seg0001.html',
  styleUrl: './bsq-seg0001.css',
})
export class BsqSeg0001 {
  router = inject(Router);

  usuarios = signal<Usuarios[]>([
    {
      idUsuario: 'mgzapata',
      idPersona: 5,
      idPerfil: 'ADM',
      estadoUsuario: 'A',
      nombrePersona: 'Gabriela Zapata',
    },
    {
      idUsuario: 'lsuarez',
      idPersona: 2,
      idPerfil: 'ADM',
      estadoUsuario: 'A',
      nombrePersona: 'Lua Suárez',
    },
    {
      idUsuario: 'mparra',
      idPersona: 5,
      idPerfil: 'ADM',
      estadoUsuario: 'A',
      nombrePersona: 'Malena Parra',
    },
    {
      idUsuario: 'lnaranjo',
      idPersona: 4,
      idPerfil: 'ADM',
      estadoUsuario: 'A',
      nombrePersona: 'Laura Naranjo',
    },
    {
      idUsuario: 'rrosales',
      idPersona: 3,
      idPerfil: 'ADM',
      estadoUsuario: 'A',
      nombrePersona: 'Rosa Rosales',
    },
  ]);

  openUsuario(): void {
    this.router.navigate(['/seguridades/usuario/', '0']);
  }

  seleccionarUsuario(usuario: Usuarios): void {
    this.router.navigate(['/seguridades/usuario/', usuario.idUsuario]);
  }
}
