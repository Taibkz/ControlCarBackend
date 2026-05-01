import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, CarFront, CalendarPlus, CalendarClock, User, CalendarDays, History, Users, Wrench } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-bottom-nav',
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.css',
})
export class BottomNav {
  authService = inject(AuthService);
  user$ = this.authService.currentUser$;

  // Icons
  LayoutDashboard = LayoutDashboard;
  CarFront = CarFront;
  CalendarPlus = CalendarPlus;
  CalendarClock = CalendarClock;
  UserIcon = User;
  CalendarDays = CalendarDays;
  HistoryIcon = History;
  UsersIcon = Users;
  Wrench = Wrench;
}
