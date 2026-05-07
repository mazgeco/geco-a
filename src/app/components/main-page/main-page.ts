import { Component } from '@angular/core';
import { PRIMENG_MODULES } from '../../shared/primeng/primeng.imports';

@Component({
  selector: 'app-main-page',
  imports: [...PRIMENG_MODULES],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {
  
}
