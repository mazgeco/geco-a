import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-grd-per0008',
  imports: [],
  templateUrl: './grd-per0008.html',
  styleUrl: './grd-per0008.css',
})
export class GrdPer0008 implements OnInit {
  //LLAMADA AL idPersona
  @Input()
  idPersona!: number;

  ngOnInit(): void {
    
  }
}
