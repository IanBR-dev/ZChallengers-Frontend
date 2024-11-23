import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../../models/types';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="player-card-container group"
      [class.is-current]="currentPlayer?.id === player.id"
    >
      <div class="flex items-center gap-3">
        <!-- Avatar -->
        <div class="relative">
          <div class="avatar-container rounded-full">
            <img
              [src]="player.avatar"
              [alt]="player.username"
              class="w-10 h-10 object-cover"
            />
          </div>
          <div
            *ngIf="isCaptain"
            class="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full 
                   flex items-center justify-center"
            title="Team Captain"
          >
            <span class="material-symbols-outlined text-xs text-black">
              military_tech
            </span>
          </div>
        </div>

        <!-- Player Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="player-name">{{ player.username }}</span>
            <span *ngIf="isCaptain" class="captain-badge"> Captain </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="rank-badge">
              {{ player.rank }}
            </span>
            <!--             <span class="stats-text">
              Win Rate: {{ player.stats?.winRate || '0' }}%
            </span> -->
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .player-card-container {
        @apply p-4 rounded-lg transition-all duration-300;
        background: var(--bg-dark);
        border: 1px solid var(--border-light);
      }

      .player-card-container:hover {
        border-color: var(--primary);
        transform: translateY(-1px);
      }

      .player-card-container.is-current {
        background: var(--primary-light);
        border-color: var(--primary);
      }

      .avatar-container {
        @apply relative overflow-hidden transition-transform duration-300;
        box-shadow: 0 0 0 2px var(--border-light);
      }

      .group:hover .avatar-container {
        box-shadow: 0 0 0 2px var(--primary);
      }

      .player-name {
        @apply text-sm font-medium truncate;
        color: var(--text-primary);
      }

      .captain-badge {
        @apply text-xs px-2 py-0.5 rounded-full;
        background: var(--primary-light);
        color: var(--primary);
      }

      .rank-badge {
        @apply text-xs px-2 py-0.5 rounded-full;
        background: var(--bg-glass);
        color: var(--text-secondary);
      }

      .stats-text {
        @apply text-xs;
        color: var(--text-muted);
      }
    `,
  ],
})
export class PlayerCardComponent {
  @Input() player!: Player;
  @Input() isCaptain = false;
  @Input() currentPlayer?: Player;
}
