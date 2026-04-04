import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { History, Search, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-historial-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, LucideAngularModule],
  templateUrl: './historial-citas.component.html'
})
export class HistorialCitasComponent implements OnInit {
  private http = inject(HttpClient);

  citas: any[] = [];
  loading = true;
  busqueda = '';
  filtroEstado = 'todas';

  readonly HistoryIcon = History;
  readonly Search = Search;

  BADGE: any = {
    FINALIZADA: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', color: '#6ee7b7' },
    CANCELADA:  { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  color: '#fca5a5' },
  };

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/admin/citas`).subscribe({
      next: (res) => {
        this.citas = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando historial:', err);
        this.loading = false;
      }
    });
  }

  get filtradas() {
    const pasadas = this.citas.filter(c => ['FINALIZADA', 'CANCELADA'].includes(c.estado));
    return pasadas.filter(c => {
      const matchEstado = this.filtroEstado === 'todas' || c.estado === this.filtroEstado;
      const termino = this.busqueda.toLowerCase();
      const matchBusqueda = !termino ||
        c.cliente?.nombreCompleto?.toLowerCase().includes(termino) ||
        c.vehiculo?.matricula?.toLowerCase().includes(termino) ||
        c.servicio?.nombre?.toLowerCase().includes(termino);
      return matchEstado && matchBusqueda;
    });
  }
}
