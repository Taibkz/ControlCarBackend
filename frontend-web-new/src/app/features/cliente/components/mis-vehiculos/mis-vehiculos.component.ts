import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { Car, Plus, Trash2, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-mis-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, LucideAngularModule],
  templateUrl: './mis-vehiculos.component.html'
})
export class MisVehiculosComponent implements OnInit {
  private http = inject(HttpClient);

  vehiculos: any[] = [];
  loading = true;
  showForm = false;
  nuevoVehiculo = { matricula: '', marca: '', modelo: '', anio: '' };

  readonly Car = Car;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;

  ngOnInit() {
    this.fetchVehiculos();
  }

  fetchVehiculos() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/cliente/vehiculos`).subscribe({
      next: (res) => {
        this.vehiculos = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  handleCreate() {
    this.http.post<any>(`${environment.apiUrl}/cliente/vehiculos`, this.nuevoVehiculo).subscribe({
      next: () => {
        this.nuevoVehiculo = { matricula: '', marca: '', modelo: '', anio: '' };
        this.showForm = false;
        this.fetchVehiculos();
      },
      error: (err) => {
        const msj = err.error || "Error al guardar el vehículo";
        alert(msj);
      }
    });
  }

  eliminarAviso() {
    alert('Para eliminar, contacte con administración (por las citas asociadas)');
  }
}
