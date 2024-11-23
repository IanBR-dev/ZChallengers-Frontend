import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invite-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="onClick.emit()" class="invite-button">
      <span class="material-symbols-outlined">group_add</span>
      <span>Invite Players</span>
    </button>
  `,
  styles: [
    `
      .invite-button {
        @apply flex items-center gap-2 px-6 py-3 rounded-lg font-medium 
             transition-all duration-200 relative overflow-hidden;
        background: var(--primary);
        color: var(--text-primary);
      }

      .invite-button:hover {
        filter: brightness(1.1);
        transform: translateY(-1px);
      }

      .invite-button:active {
        transform: translateY(0);
      }
    `,
  ],
})
export class InviteButtonComponent {
  @Output() onClick = new EventEmitter<void>();
}
