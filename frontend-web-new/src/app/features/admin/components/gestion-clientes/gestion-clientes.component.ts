import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { Users, Car, Trash2, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-gestion-clientes',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, LucideAngularModule],
  templateUrl: './gestion-clientes.component.html'
})
export class GestionClientesComponent implements OnInit {
  private http = inject(HttpClient);

  clientes: any[] = [];
  vehiculos: any[] = [];
  loading = true;

  readonly Users = Users;
  readonly Car = Car;
  readonly Trash2 = Trash2;

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    forkJoin({
      clientes: this.http.get<any[]>(`${environment.apiUrl}/admin/clientes`),
      vehiculos: this.http.get<any[]>(`${environment.apiUrl}/admin/vehiculos`)
    }).subscribe({
      next: (res) => {
        this.clientes = res.clientes;
        this.vehiculos = res.vehiculos;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getCochesCliente(clienteId: number) {
    return this.vehiculos.filter(v => v.propietario?.id === clienteId);
  }

  handleEliminarCliente(id: number) {
    if(window.confirm('¿Seguro? Se eliminarán también sus vehículos y citas asociadas.')) {
      this.http.delete(`${environment.apiUrl}/admin/clientes/${id}`).subscribe({
        next: () => this.fetchData(),
        error: () => alert("Error suprimiendo cliente")
      });
    }
  }
}
