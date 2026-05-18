import { Component, inject, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bsq-per0001',
  imports: [...PRIMENG_MODULES],
  templateUrl: './bsq-per0001.html',
  styleUrl: './bsq-per0001.css',
})
export class BsqPer0001 implements OnInit {

  router = inject(Router);

  ngOnInit(): void {
    
  }

  openPersona(): void {
    this.router.navigate(['/personas/persona/']);
  }


}
