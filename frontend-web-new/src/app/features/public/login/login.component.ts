import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LogIn, User, Lock, Shield, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly LogIn = LogIn;
  readonly User = User;
  readonly Lock = Lock;
  readonly Shield = Shield;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  error: string = '';
  isLoading: boolean = false;

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.error = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe({
      next: (res) => {
        if (res.usuario.rol === 'ADMIN') {
          this.router.navigate(['/admin/panel']);
        } else {
          this.router.navigate(['/cliente/panel']);
        }
      },
      error: () => {
        this.error = 'Credenciales incorrectas. Verifica tu usuario y contraseña.';
        this.isLoading = false;
      }
    });
  }
}
