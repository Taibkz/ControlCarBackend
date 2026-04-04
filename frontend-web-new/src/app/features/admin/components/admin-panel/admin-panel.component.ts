import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { LocationSectionComponent } from '../../../../shared/components/location-section/location-section.component';
import { Users, CalendarClock, Activity, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, LocationSectionComponent, LucideAngularModule],
  templateUrl: './admin-panel.component.html'
})
export class AdminPanelComponent implements OnInit {
  private http = inject(HttpClient);

  data = { totalCitas: 0, totalClientes: 0, citas: [] as any[] };
  loading = true;

  readonly Users = Users;
  readonly CalendarClock = CalendarClock;
  readonly Activity = Activity;

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/admin/panel`).subscribe({
      next: (res) => {
        if (res) {
          this.data = {
            totalCitas: res.totalCitas || 0,
            totalClientes: res.totalClientes || 0,
            citas: res.citas || []
          };
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando panel:', err);
        this.loading = false;
      }
    });
  }

  get citasRecientes() {
    return this.data.citas.slice(0, 5);
  }
}
