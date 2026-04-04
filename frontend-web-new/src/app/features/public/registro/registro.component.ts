import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UserPlus, User, Lock, Mail, CreditCard, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './registro.component.html'
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly UserPlus = UserPlus;
  readonly User = User;
  readonly Lock = Lock;
  readonly Mail = Mail;
  readonly CreditCard = CreditCard;

  registroForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    nombreCompleto: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  error: string = '';
  success: string = '';

  onSubmit() {
    if (this.registroForm.invalid) return;

    this.error = '';
    this.success = '';
    
    this.http.post<any>(`${environment.apiUrl}/auth/registro`, this.registroForm.value).subscribe({
      next: (res) => {
        this.success = res.message || 'Usuario registrado exitosamente.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Error al registrar usuario. Inténtalo de nuevo.';
        }
      }
    });
  }
}
