import { Component, inject, OnChanges, OnDestroy, OnInit, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bsq-prd0001',
  imports: [...PRIMENG_MODULES],
  templateUrl: './bsq-prd0001.html',
  styleUrl: './bsq-prd0001.css',
})
export class BsqPrd0001 implements OnInit {

  router = inject(Router);

  ngOnInit(): void {
    
  }
}
