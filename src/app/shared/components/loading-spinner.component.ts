import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="absolute inset-0 flex items-center justify-center">
      <div
        class="animate-spin rounded-full h-6 w-6 border-2 border-black border-t-transparent"
      ></div>
    </div>
  `,
})
export class LoadingSpinnerComponent {}
