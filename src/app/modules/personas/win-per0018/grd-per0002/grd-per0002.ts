import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-grd-per0002',
  imports: [],
  templateUrl: './grd-per0002.html',
  styleUrl: './grd-per0002.css',
})
export class GrdPer0002 implements OnInit {
  //LLAMADA AL idPersona
  @Input()
  idPersona!: number;

  ngOnInit(): void {
    
  }
  
}
