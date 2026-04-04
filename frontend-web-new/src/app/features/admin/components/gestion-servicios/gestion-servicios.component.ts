import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { Wrench, Plus, Pencil, Trash2, Clock, Euro, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-gestion-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, LucideAngularModule],
  templateUrl: './gestion-servicios.component.html'
})
export class GestionServiciosComponent implements OnInit {
  private http = inject(HttpClient);

  servicios: any[] = [];
  loading = true;
  showForm = false;
  editando: any = null;
  form = { nombre: '', descripcion: '', precio: 0, duracionMinutos: 60 };

  readonly Wrench = Wrench;
  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Clock = Clock;
  readonly Euro = Euro;

  ngOnInit() {
    this.fetchServicios();
  }

  fetchServicios() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/admin/servicios`).subscribe({
      next: (res) => {
        this.servicios = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openCreate() {
    this.editando = null;
    this.form = { nombre: '', descripcion: '', precio: 0, duracionMinutos: 60 };
    this.showForm = true;
  }

  openEdit(s: any) {
    this.editando = s;
    this.form = { nombre: s.nombre, descripcion: s.descripcion || '', precio: s.precio || 0, duracionMinutos: s.duracionMinutos || 60 };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editando = null;
  }

  handleSubmit() {
    const payload = { ...this.form };
    
    if (this.editando) {
      this.http.put(`${environment.apiUrl}/admin/servicios/${this.editando.id}`, payload).subscribe({
        next: () => {
          this.closeForm();
          this.fetchServicios();
        },
        error: () => alert('Error al actualizar')
      });
    } else {
      this.http.post(`${environment.apiUrl}/admin/servicios`, payload).subscribe({
        next: () => {
          this.closeForm();
          this.fetchServicios();
        },
        error: () => alert('Error al crear')
      });
    }
  }

  handleEliminar(id: number) {
    if (!window.confirm('¿Seguro que quieres eliminar este servicio?')) return;
    this.http.delete(`${environment.apiUrl}/admin/servicios/${id}`).subscribe({
      next: () => this.fetchServicios(),
      error: () => alert('Error al eliminar')
    });
  }
}
