import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      *ngIf="show"
    >
      <div class="relative">
        <!-- Outer ring -->
        <div
          class="w-16 h-16 border-4 border-gold/20 rounded-full animate-spin-slow"
        ></div>

        <!-- Inner ring -->
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-t-gold border-r-gold/50 border-b-gold/30 border-l-gold/10 rounded-full animate-spin"
        ></div>

        <!-- Center dot -->
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gold rounded-full"
        ></div>

        <!-- Loading text -->
        <div
          class="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gold text-sm"
        >
          {{ message || 'Loading...' }}
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .animate-spin-slow {
        animation: spin 3s linear infinite;
      }
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoaderComponent {
  @Input() show = false;
  @Input() message?: string;
}
