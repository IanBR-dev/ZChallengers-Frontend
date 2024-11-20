import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <form
      (ngSubmit)="onSubmit.emit()"
      class="space-y-6 gold-border bg-black/50 p-8 rounded-lg backdrop-blur-sm 
             transform transition-all duration-300 hover:shadow-gold/20 hover:shadow-lg"
      [class.animate-shake]="error"
    >
      <ng-content></ng-content>

      <div
        *ngIf="error"
        class="text-red-500 text-sm animate-fadeIn bg-red-500/10 p-3 rounded-lg border border-red-500/20"
      >
        {{ error }}
      </div>

      <button
        type="submit"
        class="gold-button w-full relative h-10 transform transition-all duration-200 
               hover:scale-[1.02] active:scale-[0.98]"
        [disabled]="isLoading"
      >
        <span [class.opacity-0]="isLoading">{{ submitText }}</span>
        <app-loading-spinner *ngIf="isLoading"></app-loading-spinner>
      </button>

      <div class="text-center text-gray-400">
        <span>{{ toggleText }} </span>
        <button
          type="button"
          (click)="onToggle.emit()"
          class="text-gold hover:text-dark-gold transition-colors"
        >
          {{ toggleButtonText }}
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      @keyframes shake {
        0%,
        100% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(-5px);
        }
        75% {
          transform: translateX(5px);
        }
      }
      .animate-shake {
        animation: shake 0.5s ease-in-out;
      }
    `,
  ],
})
export class AuthFormComponent {
  @Input() error = '';
  @Input() isLoading = false;
  @Input() submitText = '';
  @Input() toggleText = '';
  @Input() toggleButtonText = '';
  @Output() onToggle = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<void>();
}
