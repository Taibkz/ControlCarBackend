import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="page-header" style="margin-bottom: 2rem;">
      <h1 style="font-size: 2rem; margin-bottom: 0.25rem;">{{ title }}</h1>
      <p style="color: var(--text-muted); font-size: 0.95rem;">{{ subtitle }}</p>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
}
