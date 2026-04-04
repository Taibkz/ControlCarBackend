import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CalendarClock, Trash2, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-gestion-citas',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, LucideAngularModule],
  templateUrl: './gestion-citas.component.html'
})
export class GestionCitasComponent implements OnInit {
  private http = inject(HttpClient);

  citas: any[] = [];
  loading = true;

  readonly CalendarClock = CalendarClock;
  readonly Trash2 = Trash2;

  columnas = [
    { key: 'PENDIENTE', title: 'Pendientes', color: '#fcd34d', bg: 'rgba(245, 158, 11, 0.1)' },
    { key: 'CONFIRMADA', title: 'Confirmadas', color: '#93c5fd', bg: 'rgba(59, 130, 246, 0.1)' },
    { key: 'EN_CURSO', title: 'En Curso', color: '#d8b4fe', bg: 'rgba(168, 85, 247, 0.1)' },
    { key: 'FINALIZADA', title: 'Finalizadas', color: '#6ee7b7', bg: 'rgba(16, 185, 129, 0.1)' },
    { key: 'CANCELADA', title: 'Canceladas', color: '#fca5a5', bg: 'rgba(239, 68, 68, 0.1)' }
  ];

  ngOnInit() {
    this.fetchCitas();
  }

  fetchCitas() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/admin/citas`).subscribe({
      next: (res) => {
        this.citas = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando citas:', err);
        this.loading = false;
      }
    });
  }

  agrupadas(key: string) {
    return this.citas.filter(c => c.estado === key);
  }

  handleEstadoChange(id: number, e: any) {
    const nuevoEstado = e.target.value;
    this.http.put(`${environment.apiUrl}/admin/citas/${id}/estado?estado=${nuevoEstado}`, {}).subscribe({
      next: () => this.fetchCitas(),
      error: () => alert("Error al actualizar la cita")
    });
  }

  handleEliminar(id: number) {
    if(window.confirm('¿Seguro que deseas eliminar esta cita permanentemente?')) {
      this.http.delete(`${environment.apiUrl}/admin/citas/${id}`).subscribe({
        next: () => this.fetchCitas(),
        error: () => alert("Error al eliminar")
      });
    }
  }
}
