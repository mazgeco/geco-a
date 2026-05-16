import { Component, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng/primeng.imports';

@Component({
  selector: 'app-personas-page',
  imports: [...PRIMENG_MODULES],
  templateUrl: './personas-page.html',
  styleUrl: './personas-page.css',
})
export class PersonasPage implements OnInit {

  ngOnInit(): void {
    
  }
}
