import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { PRIMENG_MODULES } from '../../../../shared/primeng/primeng.imports';
@Component({
  selector: 'app-frm-prd0005',
  imports: [...PRIMENG_MODULES, ReactiveFormsModule,CheckboxModule, CommonModule],
  templateUrl: './frm-prd0005.html',
  styleUrl: './frm-prd0005.css',
})
export class FrmPrd0005 {

 @Input()
  idProducto!: string;
  
  private fb = inject(FormBuilder);

  // Creamos el FormGroup con un control para los checkboxes
  frmImpuestos = this.fb.group({
    impuestosSeleccionados: [[] as string[]] // Almacenará los valores seleccionados, ej: ['IVA', 'GALAPAGOS']
  });

  // 3. Creamos este método para limpiar la lógica del HTML
  isSeleccionado(valor: string): boolean {
    const seleccionados = this.frmImpuestos.get('impuestosSeleccionados')?.value as string[];
    return seleccionados ? seleccionados.includes(valor) : false;
  }
}
