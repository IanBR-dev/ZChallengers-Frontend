import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <label class="block text-sm font-medium text-gray-400 mb-2">
        {{ label }}
      </label>
      <input
        [type]="type"
        [ngModel]="value"
        (ngModelChange)="valueChange.emit($event)"
        [name]="name"
        required
        [class]="inputClass"
        [class.border-red-500]="hasError"
        [placeholder]="placeholder"
        [attr.autocomplete]="autocomplete"
      />
    </div>
  `,
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

  inputClass = `w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white 
                placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-1 
                focus:ring-gold/50 transition-all duration-200`;
}
