import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invitation } from '../../../models/types';
import { NotificationsComponent } from './notifications.component';

@Component({
  selector: 'app-lobby-header',
  standalone: true,
  imports: [CommonModule, NotificationsComponent],
  template: `
    <header
      class="fixed top-0 left-0 right-0 bg-black/95 z-40 px-4 md:px-8 py-4 border-b border-gold/20"
    >
      <div class="flex justify-between items-center max-w-7xl mx-auto">
        <h1 class="text-2xl md:text-4xl gold-gradient font-bold">Game Lobby</h1>
        <div class="flex items-center gap-4">
          <app-notifications
            [invitations]="invitations"
            (onAccept)="onAcceptInvitation.emit($event)"
            (onDecline)="onDeclineInvitation.emit($event)"
          >
          </app-notifications>

          <div class="relative">
            <span
              class="material-symbols-outlined text-2xl md:text-3xl cursor-pointer hover:text-gold transition-colors"
              [class.text-gold]="settingsOpen"
              (click)="toggleSettings()"
            >
              settings
            </span>

            <div
              *ngIf="settingsOpen"
              class="absolute right-0 mt-2 w-48 bg-black/95 border border-gold/20 rounded-lg shadow-xl"
            >
              <div class="py-2">
                <button
                  class="w-full px-4 py-3 text-left hover:bg-gold/10 transition-colors text-sm"
                  (click)="onProfileClick.emit()"
                >
                  Profile
                </button>
                <button
                  class="w-full px-4 py-3 text-left hover:bg-gold/10 transition-colors text-sm"
                  (click)="onLogout.emit()"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .gold-gradient {
        background: linear-gradient(to right, #ffd700, #b8860b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    `,
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
}
