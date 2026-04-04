import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CalendarClock, XCircle, Clock, CheckCircle2, Ban, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, LucideAngularModule],
  templateUrl: './mis-citas.component.html'
})
export class MisCitasComponent implements OnInit {
  private http = inject(HttpClient);

  citas: any[] = [];
  loading = true;
  filtro = 'activas';

  readonly CalendarClock = CalendarClock;
  readonly XCircle = XCircle;
  readonly Clock = Clock;
  readonly CheckCircle2 = CheckCircle2;
  readonly Ban = Ban;

  ESTADO_STYLES: any = {
    PENDIENTE:  { color: '#fcd34d', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  iconName: 'Clock' },
    CONFIRMADA: { color: '#93c5fd', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)',  iconName: 'CheckCircle2' },
    EN_CURSO:   { color: '#d8b4fe', bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.3)',  iconName: 'Clock' },
    FINALIZADA: { color: '#6ee7b7', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)',  iconName: 'CheckCircle2' },
    CANCELADA:  { color: '#fca5a5', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   iconName: 'Ban' }
  };

  ACTIVOS = ['PENDIENTE', 'CONFIRMADA', 'EN_CURSO'];
  HISTORIAL = ['FINALIZADA', 'CANCELADA'];

  ngOnInit() {
    this.fetchCitas();
  }

  fetchCitas() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/cliente/citas`).subscribe({
      next: (res) => {
        this.citas = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  setFiltro(val: string) {
    this.filtro = val;
  }

  get citasFiltradas() {
    return this.citas.filter(c => {
      if (this.filtro === 'activas') return this.ACTIVOS.includes(c.estado);
      if (this.filtro === 'historial') return this.HISTORIAL.includes(c.estado);
      return true;
    });
  }

  handleCancelar(id: number) {
    if (!window.confirm('¿Seguro que quieres cancelar esta cita?')) return;
    this.http.put(`${environment.apiUrl}/cliente/citas/${id}/cancelar`, {}).subscribe({
      next: () => {
        alert('Cita cancelada correctamente');
        this.fetchCitas();
      },
      error: () => alert('No se pudo cancelar la cita')
    });
  }

  getIconForEstado(estado: string) {
      if(estado === 'PENDIENTE' || estado === 'EN_CURSO') return this.Clock;
      if(estado === 'CONFIRMADA' || estado === 'FINALIZADA') return this.CheckCircle2;
      if(estado === 'CANCELADA') return this.Ban;
      return this.Clock;
  }
}
