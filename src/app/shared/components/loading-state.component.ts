import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-8 space-y-4">
      <div
        class="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent"
      ></div>
      <p class="text-gold/80 text-sm" *ngIf="message">{{ message }}</p>
    </div>
  `,
})
export class LoadingStateComponent {
  @Input() message = '';
}
