import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CalendarDays, ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-calendario-citas',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, LucideAngularModule],
  templateUrl: './calendario-citas.component.html'
})
export class CalendarioCitasComponent implements OnInit {
  private http = inject(HttpClient);

  citas: any[] = [];
  loading = true;
  
  hoy = new Date();
  mesActual = this.hoy.getMonth();
  anioActual = this.hoy.getFullYear();
  diaSeleccionado: number | null = null;

  MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  DAYS_ES = ['L','M','X','J','V','S','D'];

  ESTADO_COLORS: any = {
    PENDIENTE:  '#fcd34d',
    CONFIRMADA: '#93c5fd',
    EN_CURSO:   '#d8b4fe',
    FINALIZADA: '#6ee7b7',
    CANCELADA:  '#fca5a5',
  };
  
  estadosKeys = Object.keys(this.ESTADO_COLORS);

  readonly CalendarDays = CalendarDays;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/admin/citas`).subscribe({
      next: (res) => {
        this.citas = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando calendario:', err);
        this.loading = false;
      }
    });
  }

  irMesAnterior() {
    if (this.mesActual === 0) { this.mesActual = 11; this.anioActual--; }
    else this.mesActual--;
    this.diaSeleccionado = null;
  }

  irMesSiguiente() {
    if (this.mesActual === 11) { this.mesActual = 0; this.anioActual++; }
    else this.mesActual++;
    this.diaSeleccionado = null;
  }

  get gridData() {
    const primerDia = new Date(this.anioActual, this.mesActual, 1);
    const ultimoDia = new Date(this.anioActual, this.mesActual + 1, 0);
    const offsetInicio = (primerDia.getDay() + 6) % 7;
    const diasEnMes = ultimoDia.getDate();
    const celdas = offsetInicio + diasEnMes;
    const totalCeldas = Math.ceil(celdas / 7) * 7;

    const citasPorDia: any = {};
    this.citas.forEach(c => {
      const d = new Date(c.fechaHora);
      if (d.getMonth() === this.mesActual && d.getFullYear() === this.anioActual) {
        const key = d.getDate();
        if (!citasPorDia[key]) citasPorDia[key] = [];
        citasPorDia[key].push(c);
      }
    });

    const celdasArray = Array.from({ length: totalCeldas }).map((_, idx) => {
      const diaNum = idx - offsetInicio + 1;
      const esDiaValido = diaNum >= 1 && diaNum <= diasEnMes;
      const esHoy = esDiaValido && diaNum === this.hoy.getDate() && this.mesActual === this.hoy.getMonth() && this.anioActual === this.hoy.getFullYear();
      const citasDia = esDiaValido ? (citasPorDia[diaNum] || []) : [];
      return { idx, diaNum, esDiaValido, esHoy, citas: citasDia };
    });

    return { celdasArray, citasPorDia };
  }

  get citasDelDia() {
    const { citasPorDia } = this.gridData;
    return this.diaSeleccionado ? (citasPorDia[this.diaSeleccionado] || []) : [];
  }

  seleccionarDia(diaNum: number, esDiaValido: boolean) {
    if (!esDiaValido) return;
    this.diaSeleccionado = this.diaSeleccionado === diaNum ? null : diaNum;
  }
}
