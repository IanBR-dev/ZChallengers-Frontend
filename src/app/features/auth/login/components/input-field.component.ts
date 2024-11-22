import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="input-container"
      [class.focused]="isFocused"
      [class.has-value]="value"
    >
      <input
        [type]="type"
        [ngModel]="value"
        (ngModelChange)="valueChange.emit($event)"
        [name]="name"
        required
        [class.error]="hasError"
        [attr.autocomplete]="autocomplete"
        (focus)="isFocused = true"
        (blur)="isFocused = false"
        class="modern-input"
      />
      <label class="floating-label">{{ label }}</label>
      <div class="input-border"></div>
    </div>
  `,
  styles: [
    `
      .input-container {
        @apply relative mb-6;
      }

      .modern-input {
        @apply w-full py-4 px-4 rounded-sm;
        @apply border-0 outline-none;
        @apply transition-all duration-200;
        background: var(--bg-dark);
        color: var(--text-primary);
      }

      .floating-label {
        @apply absolute left-4 pointer-events-none;
        @apply transition-all duration-200 ease-out;
        color: var(--text-secondary);
        top: 50%;
        transform: translateY(-50%);
      }

      .input-border {
        @apply absolute bottom-0 left-0 w-full h-[2px];
        background: var(--border-input);
        @apply transition-all duration-200;
      }

      .input-border::after {
        content: '';
        @apply absolute bottom-0 left-0 w-full h-full;
        background: var(--primary);
        @apply scale-x-0;
        @apply transition-transform duration-200 ease-out;
        transform-origin: center;
      }

      /* Focus states */
      .input-container.focused .floating-label,
      .input-container.has-value .floating-label {
        @apply text-xs -translate-y-6;
        color: var(--primary);
      }

      .input-container.focused .input-border::after {
        @apply scale-x-100;
      }

      /* Error state */
      .modern-input.error {
        border-color: var(--error);
      }

      .modern-input.error + .floating-label {
        color: var(--error);
      }

      /* Hover state */
      .input-container:hover .input-border {
        background: var(--border-hover);
      }
    `,
  ],
})
export class InputFieldComponent {
  @Input() label = '';
  @Input() type = 'text';
  @Input() value = '';
  @Input() name = '';
  @Input() hasError = false;
  @Input() placeholder = '';
  @Input() autocomplete = 'off';
  @Output() valueChange = new EventEmitter<string>();

  isFocused = false;
}
