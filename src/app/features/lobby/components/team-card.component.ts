import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../../../models/types';
import { PlayerCardComponent } from './player-card.component';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [CommonModule, PlayerCardComponent],
  template: `
    <div class="team-card group">
      <!-- Header -->
      <div class="flex justify-between items-start mb-4">
        <div class="space-y-1">
          <h3 class="text-lg font-bold" style="color: var(--primary)">
            {{ team.name }}
          </h3>
          <div class="flex items-center gap-2">
            <span class="team-stat">
              <span class="material-symbols-outlined text-xs mr-1">
                {{ team.players.length === 1 ? 'person' : 'people' }}
              </span>
              {{ team.players.length }}/5
            </span>
            <!--             <span class="team-stat">
              <i class="fas fa-trophy text-xs mr-1"></i>
              {{ team.stats?.winRate || '0' }}% WR
            </span> -->
          </div>
        </div>

        <!-- Challenge Button -->
        <button
          *ngIf="showChallengeButton"
          class="challenge-button"
          (click)="onChallenge.emit(team)"
        >
          <span class="material-symbols-outlined">swords</span>
          Challenge
        </button>
      </div>

      <!-- Players List -->
      <div class="space-y-2">
        <app-player-card
          *ngFor="let player of team.players"
          [player]="player"
          [isCaptain]="player.id === team.captain.id"
          class="animate-slide-up"
        >
        </app-player-card>
      </div>
    </div>
  `,
  styles: [
    `
      .team-card {
        @apply relative p-6 rounded-lg transition-all duration-200;
        background: var(--bg-dark);
        border: 1px solid var(--border-light);
      }

      .team-card:hover {
        border-color: var(--primary);
        transform: translateY(-2px);
      }

      .team-stat {
        @apply text-xs px-2 py-0.5 rounded-full;
        background: var(--primary-light);
        color: var(--primary);
      }

      .challenge-button {
        @apply px-4 py-1.5 rounded text-sm font-medium 
             transition-all duration-200 relative overflow-hidden;
        background: var(--primary);
        color: var(--text-primary);
      }

      .challenge-button:hover {
        filter: brightness(1.1);
        transform: translateY(-1px);
      }

      .challenge-button:active {
        transform: translateY(0);
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-slide-up {
        animation: slideUp 0.3s ease-out forwards;
      }
    `,
  ],
})
export class TeamCardComponent {
  @Input() team!: Team;
  @Input() showChallengeButton = false;
  @Output() onChallenge = new EventEmitter<Team>();
}
