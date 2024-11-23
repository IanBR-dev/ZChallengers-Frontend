import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../../../models/types';

@Component({
  selector: 'app-match-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pt-24 px-4 pb-4">
      <div class="max-w-5xl mx-auto">
        <div class="glass rounded-lg p-8">
          <!-- Header -->
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-bold" style="color: var(--primary)">
              MATCH IN PROGRESS
            </h2>
            <div class="match-timer">{{ matchTime }}</div>
          </div>

          <!-- Teams Container -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Team 1 -->
            <div class="team-panel">
              <div class="team-header">
                <h3 class="text-xl font-bold" style="color: var(--primary)">
                  {{ team1.name }}
                </h3>
                <div class="team-stats">
                  <!--   <span class="stat">
                    <i class="fas fa-trophy"></i>
                    {{ team1.stats?.winRate || '0' }}% WR
                  </span> -->
                  <!--   <span class="stat">
                    <i class="fas fa-bolt"></i>
                    {{ team1.stats?.avgScore || '0' }} Score
                  </span> -->
                </div>
              </div>

              <div class="players-grid">
                <div
                  *ngFor="let player of team1.players"
                  class="player-card"
                  [class.captain]="player.id === team1.captain.id"
                >
                  <div class="player-avatar">
                    <img [src]="player.avatar" [alt]="player.username" />
                    <div
                      *ngIf="player.id === team1.captain?.id"
                      class="captain-badge"
                    >
                      <span class="material-symbols-outlined text-xs">
                        military_tech
                      </span>
                    </div>
                  </div>
                  <div class="player-info">
                    <span class="player-name">{{ player.username }}</span>
                    <span class="player-rank">{{ player.rank }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Team 2 -->
            <div class="team-panel">
              <div class="team-header">
                <h3 class="text-xl font-bold" style="color: var(--primary)">
                  {{ team2.name }}
                </h3>
                <div class="team-stats">
                  <!--   <span class="stat">
                    <i class="fas fa-trophy"></i>
                    {{ team2.stats?.winRate || '0' }}% WR
                  </span> -->
                  <!--      <span class="stat">
                    <i class="fas fa-bolt"></i>
                    {{ team2.stats?.avgScore || '0' }} Score
                  </span> -->
                </div>
              </div>

              <div class="players-grid">
                <div
                  *ngFor="let player of team2.players"
                  class="player-card"
                  [class.captain]="player.id === team2.captain.id"
                >
                  <div class="player-avatar">
                    <img [src]="player.avatar" [alt]="player.username" />
                    <div
                      *ngIf="player.id === team2.captain?.id"
                      class="captain-badge"
                    >
                      <span class="material-symbols-outlined text-xs">
                        military_tech
                      </span>
                    </div>
                  </div>
                  <div class="player-info">
                    <span class="player-name">{{ player.username }}</span>
                    <span class="player-rank">{{ player.rank }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Match Status -->
          <div class="match-status">
            <div class="status-indicator">
              <span class="material-symbols-outlined">sync</span>
              <span>Match in progress...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      .match-timer {
        @apply text-2xl font-bold px-4 py-2 rounded-lg;
        background: var(--primary-light);
        color: var(--primary);
      }

      .team-panel {
        @apply p-6 rounded-lg space-y-6;
        background: var(--bg-dark);
        border: 1px solid var(--border-light);
      }

      .team-header {
        @apply space-y-3;
      }

      .team-stats {
        @apply flex gap-4;
      }

      .stat {
        @apply text-sm px-3 py-1 rounded-full flex items-center gap-2;
        background: var(--primary-light);
        color: var(--primary);
      }

      .players-grid {
        @apply space-y-3;
      }

      .player-card {
        @apply p-4 rounded-lg flex items-center gap-3 transition-all duration-200;
        background: var(--bg-dark);
        border: 1px solid var(--border-light);
      }

      .player-card:hover {
        border-color: var(--primary);
        transform: translateY(-1px);
      }

      .player-avatar {
        @apply relative;
      }

      .player-avatar img {
        @apply w-10 h-10 rounded-lg object-cover;
      }

      .captain-badge {
        @apply absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center;
        background: var(--primary);
        color: var(--bg-dark);
        font-size: 10px;
      }

      .player-info {
        @apply flex-1;
      }

      .player-name {
        @apply font-medium;
        color: var(--text-primary);
      }

      .player-rank {
        @apply text-sm block;
        color: var(--text-secondary);
      }

      .match-status {
        @apply mt-8 flex justify-center;
      }

      .status-indicator {
        @apply flex items-center gap-3 px-6 py-3 rounded-lg text-lg;
        background: var(--primary-light);
        color: var(--primary);
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
      }
    `,
  ],
})
export class MatchStatusComponent {
  @Input() team1!: Team;
  @Input() team2!: Team;
  matchTime = '00:00';

  ngOnInit() {
    this.startTimer();
  }

  private startTimer() {
    let seconds = 0;
    setInterval(() => {
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      this.matchTime = `${minutes
        .toString()
        .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, 1000);
  }
}
