import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { LocationSectionComponent } from '../../../../shared/components/location-section/location-section.component';
import { ContactSectionComponent } from '../../../../shared/components/contact-section/contact-section.component';
import { AuthService } from '../../../../core/services/auth.service';
import { CalendarClock, Car, ArrowRight, MapPin, MessageSquare, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-cliente-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, LocationSectionComponent, ContactSectionComponent, LucideAngularModule],
  templateUrl: './cliente-panel.component.html'
})
export class ClientePanelComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  user = this.authService.getCurrentUserValue();
  citas: any[] = [];
  vehiculos: any[] = [];
  loading = true;

  readonly CalendarClock = CalendarClock;
  readonly Car = Car;
  readonly ArrowRight = ArrowRight;
  readonly MapPin = MapPin;
  readonly MessageSquare = MessageSquare;

  ngOnInit() {
    forkJoin({
      citas: this.http.get<any[]>(`${environment.apiUrl}/cliente/citas`),
      vehiculos: this.http.get<any[]>(`${environment.apiUrl}/cliente/vehiculos`)
    }).subscribe({
      next: (res) => {
        this.citas = res.citas;
        this.vehiculos = res.vehiculos;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  get proximasCitas() {
    return this.citas.filter(c => c.estado === 'PENDIENTE' || c.estado === 'EN_CURSO');
  }
}
