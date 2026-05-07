import { Component, inject, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../shared/primeng/primeng.imports';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [...PRIMENG_MODULES, ReactiveFormsModule, NgClass],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

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
