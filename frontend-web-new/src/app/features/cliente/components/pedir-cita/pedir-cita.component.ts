import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CalendarPlus, CheckCircle2, Clock, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-pedir-cita',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, LucideAngularModule],
  templateUrl: './pedir-cita.component.html'
})
export class PedirCitaComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  vehiculos: any[] = [];
  servicios: any[] = [];
  loading = true;
  
  selectedVehiculo = '';
  selectedServicio = '';
  
  fechaSeleccionada = '';
  horasDisponibles: string[] = [];
  horaSeleccionada = '';
  cargandoHoras = false;
  
  success = false;
  error = '';

  readonly CalendarPlus = CalendarPlus;
  readonly CheckCircle2 = CheckCircle2;
  readonly Clock = Clock;
  
  minDate = new Date().toISOString().split('T')[0];

  ngOnInit() {
    forkJoin({
      vehiculos: this.http.get<any[]>(`${environment.apiUrl}/cliente/vehiculos`),
      servicios: this.http.get<any[]>(`${environment.apiUrl}/cliente/servicios`)
    }).subscribe({
      next: (res) => {
        this.vehiculos = res.vehiculos;
        this.servicios = res.servicios;
        this.loading = false;
      },
      error: () => {
        this.error = "Error al cargar los datos del formulario.";
        this.loading = false;
      }
    });
  }

  onFechaChange() {
    this.horaSeleccionada = '';
    this.horasDisponibles = [];
    
    if (this.fechaSeleccionada) {
      this.cargandoHoras = true;
      this.http.get<string[]>(`${environment.apiUrl}/cliente/citas/disponibilidad?fecha=${this.fechaSeleccionada}`).subscribe({
        next: (res) => {
          this.horasDisponibles = res;
          this.cargandoHoras = false;
        },
        error: () => {
          this.error = "No se pudieron cargar las horas disponibles para ese día.";
          this.cargandoHoras = false;
        }
      });
    }
  }

  handleSubmit() {
    this.error = '';
    
    if (!this.selectedVehiculo || !this.selectedServicio || !this.fechaSeleccionada || !this.horaSeleccionada) {
      this.error = 'Por favor, completa todos los campos.';
      return;
    }

    const formParams = new URLSearchParams();
    formParams.append('vehiculoId', this.selectedVehiculo);
    formParams.append('servicioId', this.selectedServicio);
    const fechaHoraISO = `${this.fechaSeleccionada}T${this.horaSeleccionada}:00`;
    formParams.append('fechaHora', fechaHoraISO);

    this.http.post(`${environment.apiUrl}/cliente/citas`, formParams.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/cliente/panel']);
        }, 2500);
      },
      error: (err) => {
        this.error = err.error || "Ocurrió un error al agendar la cita.";
      }
    });
  }
}
