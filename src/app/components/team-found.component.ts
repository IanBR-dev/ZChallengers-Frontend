import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../models/types';

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
            <div class="player-card" *ngFor="let player of team.players">
              <img
                [src]="player.avatar"
                class="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <div class="text-xl font-bold">{{ player.username }}</div>
              <div class="text-gold">{{ player.rank }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TeamFoundComponent {
  @Input() team!: Team;
  @Output() closeModal = new EventEmitter<void>();

  ngOnInit() {
    this.showNotification();
    setTimeout(() => {
      this.closeModal.emit();
    }, 10000);
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
