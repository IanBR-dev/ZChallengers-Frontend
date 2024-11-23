import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invitation } from '../../../models/types';
import { NotificationsComponent } from './notifications.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-lobby-header',
  standalone: true,
  imports: [CommonModule, NotificationsComponent],
  template: `
    <header class="fixed top-0 left-0 right-0 z-50">
      <!-- Glass Background -->
      <div class="absolute inset-0 glass"></div>

      <!-- Content -->
      <div class="relative px-4 md:px-8 py-4">
        <div class="flex justify-between items-center max-w-7xl mx-auto">
          <!-- Logo and Title -->
          <h1
            class="text-2xl md:text-4xl font-bold"
            style="color: var(--primary)"
          >
            DREISAFIO
          </h1>

          <!-- Right Side Actions -->
          <div class="flex items-center gap-4">
            <app-notifications
              [invitations]="invitations"
              (onAccept)="onAcceptInvitation.emit($event)"
              (onDecline)="onDeclineInvitation.emit($event)"
            >
            </app-notifications>

            <!-- Settings Menu -->
            <div class="relative">
              <button
                class="settings-button"
                [class.active]="settingsOpen"
                (click)="toggleSettings()"
                aria-label="Settings"
              >
                <span class="material-symbols-outlined text-xl">
                  settings
                </span>
              </button>

              <!-- Dropdown Menu -->
              <div *ngIf="settingsOpen" class="settings-dropdown" @fadeInOut>
                <div class="py-1">
                  <button class="menu-item" (click)="onProfileClick.emit()">
                    <span class="material-symbols-outlined text-xl">
                      account_circle
                    </span>
                    Profile
                  </button>
                  <button
                    class="menu-item text-error"
                    (click)="onLogout.emit()"
                  >
                    <span class="material-symbols-outlined text-xl">
                      logout
                    </span>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .glass {
        @apply backdrop-blur-md;
        background: var(--bg-glass);
        border-bottom: 1px solid var(--border-light);
      }

      .settings-button {
        @apply w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200;
        background: var(--bg-dark);
        color: var(--text-secondary);
        border: 1px solid var(--border-light);
      }

      .settings-button:hover {
        color: var(--primary);
        border-color: var(--primary);
        transform: translateY(-1px);
      }

      .settings-button.active {
        background: var(--primary-light);
        color: var(--primary);
        border-color: var(--primary);
      }

      .settings-dropdown {
        @apply absolute right-0 mt-2 w-48 rounded-lg overflow-hidden shadow-lg;
        background: var(--bg-glass);
        backdrop-filter: blur(16px);
        border: 1px solid var(--border-light);
        transform-origin: top right;
        animation: dropdownEnter 0.2s ease-out;
      }

      .menu-item {
        @apply w-full px-4 py-3 text-left text-sm flex items-center transition-all duration-200;
        color: var(--text-primary);
      }

      .menu-item:hover {
        background: var(--primary-light);
        color: var(--primary);
      }

      .menu-item.text-error {
        color: var(--text-primary);
      }

      .menu-item.text-error:hover {
        background: var(--error-light);
        color: var(--error);
      }

      @keyframes dropdownEnter {
        from {
          opacity: 0;
          transform: scale(0.95) translateY(-10px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
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
  ],
})
export class LobbyHeaderComponent {
  @Input() invitations: Invitation[] = [];
  @Output() onAcceptInvitation = new EventEmitter<string>();
  @Output() onDeclineInvitation = new EventEmitter<string>();
  @Output() onProfileClick = new EventEmitter<void>();
  @Output() onLogout = new EventEmitter<void>();

  settingsOpen = false;

  toggleSettings() {
    this.settingsOpen = !this.settingsOpen;
  }

  // Close settings when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.settings-button') &&
      !target.closest('.settings-dropdown')
    ) {
      this.settingsOpen = false;
    }
  }
}
