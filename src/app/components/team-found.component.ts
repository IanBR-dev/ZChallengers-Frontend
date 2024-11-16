import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueMatch } from '../models/types';

@Component({
  selector: 'app-team-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 bg-black/95 flex items-center justify-center z-50 animate-fadeIn"
    >
      <div class="max-w-2xl w-full mx-4">
        <div class="text-center">
          <div class="text-6xl gold-gradient font-bold mb-8 animate-pulse">
            TEAMMATE FOUND!
          </div>

          <div class="grid grid-cols-2 gap-8 mb-8">
            <div class="player-card">
              <img
                [src]="match.player1.avatar"
                class="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <div class="text-xl font-bold">{{ match.player1.username }}</div>
              <div class="text-gold">{{ match.player1.rank }}</div>
            </div>
            <div class="player-card">
              <img
                [src]="match.player2.avatar"
                class="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <div class="text-xl font-bold">{{ match.player2.username }}</div>
              <div class="text-gold">{{ match.player2.rank }}</div>
            </div>
          </div>

          <div class="flex justify-center gap-8">
            <button class="gold-button text-xl px-12" (click)="accept.emit()">
              Accept
            </button>
            <button class="gold-button text-xl px-12" (click)="decline.emit()">
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TeamFoundComponent {
  @Input() match!: QueueMatch;
  @Output() accept = new EventEmitter<void>();
  @Output() decline = new EventEmitter<void>();

  ngOnInit() {
    this.showNotification();
  }

  private showNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Teammate Found!', {
        body: 'A teammate has been found! Click to accept or decline.',
        icon: '/favicon.ico',
        requireInteraction: true,
      });
    }
  }
}
