import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invite-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="onClick.emit()"
      class="gold-button flex items-center gap-2 px-4 py-2 hover:scale-105 active:scale-95 
                   transition-transform"
    >
      <span class="material-symbols-outlined">group_add</span>
      <span>Invite Players</span>
    </button>
  `,
  styles: [
    `
      .gold-button {
        background: linear-gradient(to right, #ffd700, #b8860b);
        color: black;
        font-weight: 500;
        border-radius: 0.5rem;
      }
    `,
  ],
})
export class InviteButtonComponent {
  @Output() onClick = new EventEmitter<void>();
}
