import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LogOut, LayoutDashboard, CarFront, CalendarPlus, Users, Wrench, CalendarDays, History, CalendarClock, User, Menu, X, MapPin, MessageSquare, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  authService = inject(AuthService);
  user$ = this.authService.currentUser$;
  
  menuOpen = false;

  readonly LogOut = LogOut;
  readonly LayoutDashboard = LayoutDashboard;
  readonly CarFront = CarFront;
  readonly CalendarPlus = CalendarPlus;
  readonly Users = Users;
  readonly Wrench = Wrench;
  readonly CalendarDays = CalendarDays;
  readonly History = History;
  readonly CalendarClock = CalendarClock;
  readonly User = User;
  readonly Menu = Menu;
  readonly X = X;
  readonly MapPin = MapPin;
  readonly MessageSquare = MessageSquare;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    this.authService.logout();
  }
}
