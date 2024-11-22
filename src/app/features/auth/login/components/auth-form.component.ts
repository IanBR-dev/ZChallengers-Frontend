import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <form (ngSubmit)="handleSubmit()" class="space-y-6" #authForm="ngForm">
      <!-- Form Fields -->
      <div class="space-y-6">
        <ng-content></ng-content>
      </div>

      <!-- Error Message Area -->
      <div class="h-[50px] flex items-center justify-center">
        <div
          *ngIf="error"
          class="text-sm p-3 rounded border animate-fade-in w-full"
          [style.color]="'var(--error)'"
          [style.background]="'var(--error-light)'"
          [style.border-color]="'var(--error)'"
        >
          {{ error }}
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="submit-button"
        [class.disabled]="!isValid || isLoading"
        [disabled]="!isValid || isLoading"
      >
        <div class="button-content" [class.loading]="isLoading">
          <span class="button-text">{{ submitText }}</span>
          <div class="spinner-container" *ngIf="isLoading">
            <app-loading-spinner></app-loading-spinner>
          </div>
        </div>
        <div class="button-background"></div>
      </button>
    </form>
  `,
  styles: [
    `
      .submit-button {
        @apply w-full h-12 rounded font-bold relative overflow-hidden;
        background: transparent;
        border: 2px solid var(--primary);
        color: var(--text-primary);
        transition: all 0.3s ease;
      }

      .button-content {
        @apply relative z-10 flex items-center justify-center h-full;
        transition: all 0.3s ease;
      }

      .button-background {
        @apply absolute inset-0 z-0;
        background: var(--primary);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s ease;
      }

      .submit-button:not(.disabled):hover .button-background {
        transform: scaleX(1);
      }

      .submit-button:not(.disabled):hover {
        color: var(--text-primary);
      }

      .submit-button.disabled {
        @apply opacity-50 cursor-not-allowed;
        border-color: var(--text-muted);
        color: var(--text-muted);
      }

      .button-content.loading {
        transform: translateY(-100%);
      }

      .spinner-container {
        @apply absolute inset-0 flex items-center justify-center;
        transform: translateY(100%);
      }

      .loading .spinner-container {
        transform: translateY(0);
      }

      .loading .button-text {
        transform: translateY(-100%);
      }
    `,
  ],
})
export class AuthFormComponent {
  @Input() error = '';
  @Input() isLoading = false;
  @Input() submitText = '';
  @Input() isValid = false;
  @Output() onSubmit = new EventEmitter<void>();

  handleSubmit() {
    if (this.isValid && !this.isLoading) {
      this.onSubmit.emit();
    }
  }
}
