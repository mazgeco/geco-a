import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PRIMENG_MODULES } from '../../shared/primeng/primeng.imports';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { SeguridadesService } from '../../services/seguridades.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-layout',
  imports: [...PRIMENG_MODULES, ReactiveFormsModule, NgClass],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private seguridadService = inject(SeguridadesService);
  private authService = inject(AuthService);

  invalidLogin = signal(false);
  sesionExpirada = inject(ActivatedRoute).snapshot.queryParamMap.get('sesion') === 'expirada';

  public loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.invalidLogin.set(false);

    const username = this.loginForm.controls.username.value!;
    const password = this.loginForm.controls.password.value!;

    this.seguridadService.validaUsuario(username, password).subscribe({
      next: (response) => {
        if (response.status !== 'OK' || !response.data?.token) {
          this.invalidLogin.set(true);
          return;
        }
        if (!this.authService.login(response.data)) {
          this.invalidLogin.set(true);
          return;
        }
        this.router.navigate(['/main']);
      },
      error: () => {
        this.invalidLogin.set(true);
      },
    });
  }

  isInvalid(field: 'username' | 'password'): boolean {
    const control = this.loginForm.get(field);
    return !!control?.invalid && !!control?.touched;
  }
}
