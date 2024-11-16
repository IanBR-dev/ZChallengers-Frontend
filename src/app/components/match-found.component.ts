import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../models/types';

@Component({
  selector: 'app-match-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 bg-black/95 flex items-center justify-center z-50 animate-fadeIn"
    >
      <div class="max-w-2xl w-full mx-4 text-center">
        <div class="text-6xl gold-gradient font-bold mb-8 animate-pulse">
          {{ matchStarted ? 'MATCH IN PROGRESS' : 'TEAM CHALLENGE!' }}
        </div>

        <div class="mb-8">
          <div *ngIf="!matchStarted" class="text-2xl mb-6">
            {{ challengingTeam.name }} has challenged you!
          </div>

          <div class="grid grid-cols-2 gap-8">
            <div
              *ngFor="let player of challengingTeam.players"
              class="player-card"
            >
              <div class="relative">
                <img
                  [src]="player.avatar"
                  class="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <div
                  *ngIf="player.id === challengingTeam.captain.id"
                  class="absolute -top-2 -right-2 bg-gold/20 rounded-full p-2"
                  title="Team Captain"
                >
                  <span class="material-symbols-outlined text-gold">
                    military_tech
                  </span>
                </div>
              </div>
              <div class="text-xl font-bold">{{ player.username }}</div>
              <div class="text-gold">{{ player.rank }}</div>
              <div
                *ngIf="player.id === challengingTeam.captain.id"
                class="text-sm text-gray-400 mt-1"
              >
                Team Captain
              </div>
            </div>
          </div>
        </div>

        <div class="text-xl text-gray-400 mb-8 animate-pulse">
          {{
            matchStarted ? 'Match in progress...' : 'Get ready for the match!'
          }}
        </div>

        <div class="countdown text-4xl gold-gradient font-bold">
          {{ matchStarted ? matchTime : 'Starting in ' + countdown }}
        </div>
      </div>
    </div>
  `,
})
export class MatchFoundComponent {
  @Input() challengingTeam!: Team;
  @Output() matchComplete = new EventEmitter<Team>();

  countdown = 10;
  matchStarted = false;
  matchTime = '00:00';
  private countdownInterval: any;
  private matchInterval: any;
  private matchStartTime: number = 0;

  ngOnInit() {
    this.showNotification();
    this.startCountdown();
  }

  ngOnDestroy() {
    this.clearIntervals();
  }

  private showNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Team Challenge!', {
        body: `${this.challengingTeam.name} has challenged your team!`,
        icon: '/favicon.ico',
        requireInteraction: true,
      });
    }
  }

  private startCountdown() {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.startMatch();
      }
    }, 1000);
  }

  private startMatch() {
    this.matchStarted = true;
    this.matchStartTime = Date.now();

    // Simulate a match duration between 30-60 seconds
    const matchDuration = Math.floor(Math.random() * 1000) + 1000;

    this.matchInterval = setInterval(() => this.updateMatchTime(), 1000);

    setTimeout(() => {
      this.clearIntervals();
      this.matchComplete.emit(this.challengingTeam);
    }, matchDuration);
  }

  private updateMatchTime() {
    const elapsed = Math.floor((Date.now() - this.matchStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    this.matchTime = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  private clearIntervals() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.matchInterval) {
      clearInterval(this.matchInterval);
    }
  }
}
