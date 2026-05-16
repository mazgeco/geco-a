import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PRIMENG_MODULES } from '../../shared/primeng/primeng.imports';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  imports: [...PRIMENG_MODULES, ReactiveFormsModule, NgClass],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css'
})
export class AuthLayout implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  invalidLogin = signal(false);

  public loginForm = this.fb.group({
    username: ['', [
      Validators.required,
      Validators.minLength(3)
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(6)
    ]]
  });

  ngOnInit(): void {
    
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.router.navigate(['/main']);
  }

  isInvalid(field: 'username' | 'password'): boolean {
    const control = this.loginForm.get(field);
    return !!control?.invalid && !!control?.touched;
  }
}
