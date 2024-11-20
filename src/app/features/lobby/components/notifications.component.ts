import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invitation } from '../../../models/types';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <span
        class="material-symbols-outlined text-2xl md:text-3xl cursor-pointer hover:text-gold transition-colors"
        [class.text-gold]="invitations.length > 0"
        (click)="toggleDropdown()"
      >
        notifications
      </span>
      <span
        *ngIf="invitations.length > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse"
      >
        {{ invitations.length }}
      </span>

      <div
        *ngIf="isOpen && invitations.length > 0"
        class="absolute right-0 mt-2 w-72 bg-black/95 border border-gold/20 rounded-lg shadow-xl z-50 animate-fadeIn"
      >
        <div class="p-4 space-y-4">
          <div
            *ngFor="let invitation of invitations"
            class="border-b border-gold/10 last:border-0 pb-3 last:pb-0"
          >
            <p class="text-sm text-gray-300 mb-2">
              Invitation from
              <span class="text-gold">{{ invitation.from.username }}</span>
            </p>
            <div class="flex gap-2">
              <button
                class="gold-button text-xs py-1 px-3 hover:scale-105 active:scale-95 transition-transform"
                (click)="acceptInvitation(invitation.id)"
              >
                Accept
              </button>
              <button
                class="text-xs text-gray-400 hover:text-white transition-colors"
                (click)="declineInvitation(invitation.id)"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
      }

      .gold-button {
        background: linear-gradient(to right, #ffd700, #b8860b);
        color: black;
        font-weight: 500;
        border-radius: 0.375rem;
      }
    `,
  ],
})
export class NotificationsComponent {
  @Input() invitations: Invitation[] = [];
  @Output() onAccept = new EventEmitter<string>();
  @Output() onDecline = new EventEmitter<string>();

  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  acceptInvitation(id: string) {
    this.onAccept.emit(id);
    this.isOpen = false;
  }

  declineInvitation(id: string) {
    this.onDecline.emit(id);
    this.isOpen = false;
  }
}
