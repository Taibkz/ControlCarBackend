import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, MapPin, Navigation } from 'lucide-angular';

@Component({
  selector: 'app-location-section',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './location-section.component.html',
  styleUrl: './location-section.component.css'
})
export class LocationSectionComponent {
  readonly MapPin = MapPin;
  readonly Navigation = Navigation;
}
