import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invitation } from '../../../models/types';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <!-- Notification Button -->
      <button
        class="notification-button"
        [class.has-notifications]="invitations.length > 0"
        (click)="toggleDropdown()"
        aria-label="Notifications"
      >
        <span class="material-symbols-outlined">notifications</span>
        <!-- Notification Badge -->
        <span *ngIf="invitations.length > 0" class="notification-badge">
          {{ invitations.length }}
        </span>
      </button>

      <!-- Dropdown Menu -->
      <div
        *ngIf="isOpen && invitations.length > 0"
        class="notifications-dropdown"
        @fadeInOut
      >
        <div class="p-4 space-y-4">
          <!-- Notification Items -->
          <div
            *ngFor="let invitation of invitations"
            class="notification-item"
            @slideIn
          >
            <div class="flex items-start gap-3">
              <!-- Avatar -->
              <div class="w-10 h-10 rounded-lg overflow-hidden">
                <img
                  [src]="invitation.from.avatar"
                  [alt]="invitation.from.username"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Content -->
              <div class="flex-1">
                <p class="text-sm" style="color: var(--text-primary)">
                  <span class="font-medium">{{
                    invitation.from.username
                  }}</span>
                  <span style="color: var(--text-secondary)">
                    invites you to join their team</span
                  >
                </p>

                <!-- Actions -->
                <div class="flex gap-2 mt-2">
                  <button
                    class="action-button accept"
                    (click)="acceptInvitation(invitation.id)"
                  >
                    Accept
                  </button>
                  <button
                    class="action-button decline"
                    (click)="declineInvitation(invitation.id)"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .notification-button {
        @apply w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200;
        background: var(--bg-dark);
        color: var(--text-secondary);
        border: 1px solid var(--border-light);
      }

      .notification-button:hover {
        color: var(--primary);
        border-color: var(--primary);
        transform: translateY(-1px);
      }

      .notification-button.has-notifications {
        background: var(--primary-light);
        color: var(--primary);
        border-color: var(--primary);
        animation: pulse 2s infinite;
      }

      .notification-badge {
        @apply absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center;
        background: var(--primary);
        color: var(--text-primary);
      }

      .notifications-dropdown {
        @apply absolute right-0 mt-2 w-80 rounded-lg overflow-hidden shadow-lg;
        background: var(--bg-glass);
        backdrop-filter: blur(16px);
        border: 1px solid var(--border-light);
        transform-origin: top right;
      }

      .notification-item {
        @apply p-3 rounded-lg transition-all duration-200;
        background: var(--bg-dark);
        border: 1px solid var(--border-light);
      }

      .notification-item:hover {
        border-color: var(--primary);
        transform: translateY(-1px);
      }

      .action-button {
        @apply px-4 py-1.5 rounded text-sm font-medium transition-all duration-200;
      }

      .action-button.accept {
        background: var(--primary);
        color: var(--text-primary);
      }

      .action-button.accept:hover {
        filter: brightness(1.1);
        transform: translateY(-1px);
      }

      .action-button.decline {
        background: var(--error-light);
        color: var(--error);
      }

      .action-button.decline:hover {
        background: var(--error);
        color: var(--text-primary);
        transform: translateY(-1px);
      }
    `,
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95) translateY(-10px)' }),
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'scale(0.95) translateY(-10px)' })
        ),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
  ],
})
export class NotificationsComponent implements OnChanges {
  @Input() invitations: Invitation[] = [];
  @Output() onAccept = new EventEmitter<string>();
  @Output() onDecline = new EventEmitter<string>();

  isOpen = false;
  private previousLength = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['invitations'] && !changes['invitations'].firstChange) {
      const currentLength = this.invitations.length;
      // Solo abrimos si hay nuevas notificaciones
      if (currentLength > this.previousLength) {
        this.isOpen = true;
        // Cerramos automáticamente después de 5 segundos
        setTimeout(() => {
          this.isOpen = false;
        }, 5000);
      }
      this.previousLength = currentLength;
    }
  }

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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.notification-button') &&
      !target.closest('.notifications-dropdown')
    ) {
      this.isOpen = false;
    }
  }
}
