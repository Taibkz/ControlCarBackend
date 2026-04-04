import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { User, Save, Mail, AtSign, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, LucideAngularModule],
  templateUrl: './mi-perfil.component.html'
})
export class MiPerfilComponent implements OnInit {
  private http = inject(HttpClient);

  perfil: any = null;
  form = { nombreCompleto: '', email: '' };
  loading = true;
  saving = false;

  readonly User = User;
  readonly Save = Save;
  readonly Mail = Mail;
  readonly AtSign = AtSign;

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/cliente/perfil`).subscribe({
      next: (res) => {
        this.perfil = res;
        this.form = { nombreCompleto: res.nombreCompleto, email: res.email };
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSubmit() {
    this.saving = true;
    this.http.put<any>(`${environment.apiUrl}/cliente/perfil`, this.form).subscribe({
      next: (res) => {
        this.perfil = res;
        this.saving = false;
        alert('Perfil actualizado correctamente'); // En un entorno real se usaría un Toast
      },
      error: () => {
        this.saving = false;
        alert('Error al actualizar el perfil');
      }
    });
  }
}
