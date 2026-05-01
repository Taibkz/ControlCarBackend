import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { BottomNav } from './shared/components/bottom-nav/bottom-nav';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, BottomNav],
  template: `
    <div class="app-container">
      <app-navbar *ngIf="(user$ | async)"></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-bottom-nav *ngIf="(user$ | async)"></app-bottom-nav>
    </div>
  `
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  user$ = this.authService.currentUser$;

  ngOnInit() {
  }
}
