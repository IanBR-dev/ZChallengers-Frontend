import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Team } from '../../../models/types';
import { TeamCardComponent } from './team-card.component';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TeamCardComponent],
  template: `
    <div class="space-y-6">
      <!-- Header Section -->
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div class="flex items-center gap-2">
          <h2 class="text-2xl font-bold" style="color: var(--primary)">
            Available Teams
          </h2>
          <span
            class="text-sm px-2 py-0.5 rounded-full"
            style="background: var(--primary-light); color: var(--primary)"
          >
            {{ filteredTeams.length }}/{{ teams.length }}
          </span>
        </div>

        <!-- Search Bar -->
        <div class="relative flex-1 md:max-w-md">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch($event)"
            placeholder="Search teams or players..."
            class="search-input"
          />
          <span
            class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2"
          >
            {{ searchQuery ? 'close' : 'search' }}
          </span>
        </div>
      </div>

      <!-- Teams Grid -->
      <div
        *ngIf="filteredTeams.length > 0; else noTeams"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in"
      >
        <app-team-card
          *ngFor="let team of filteredTeams; trackBy: trackByTeamId; index as i"
          [team]="team"
          [showChallengeButton]="isTeamCaptain"
          (onChallenge)="onChallengeTeam.emit($event)"
          class="animate-slide-up"
          [style.animation-delay]="'calc(0.1s * ' + i + ')'"
        >
        </app-team-card>
      </div>

      <!-- Empty State -->
      <ng-template #noTeams>
        <div class="empty-state">
          <span
            class="material-symbols-outlined text-lg"
            style="color: var(--text-primary)"
          >
            group_off
          </span>
          <p class="text-lg" style="color: var(--text-primary)">
            No teams available at the moment
          </p>
          <p class="text-sm" style="color: var(--text-secondary)">
            Check back later or wait for new teams to join
          </p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .search-input {
        @apply w-full px-4 py-3 rounded-lg pr-10 transition-all duration-200;
        background: var(--bg-dark);
        border: 1px solid var(--border-light);
        color: var(--text-primary);
      }

      .search-input:focus {
        outline: none;
        border-color: var(--primary);
      }

      .search-input::placeholder {
        color: var(--text-muted);
      }

      .empty-state {
        @apply text-center py-12 rounded-lg;
        background: var(--bg-dark);
        border: 1px solid var(--border-light);
      }

      .empty-state i {
        color: var(--text-muted);
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-slide-up {
        animation: slideUp 0.5s ease-out forwards;
        opacity: 0;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
      }
    `,
  ],
})
export class TeamListComponent implements OnInit, OnChanges {
  @Input() teams: Team[] = [];
  @Input() isTeamCaptain = false;
  @Output() onChallengeTeam = new EventEmitter<Team>();

  searchQuery = '';
  filteredTeams: Team[] = [];

  ngOnInit() {
    this.updateFilteredTeams();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['teams']) {
      const currentTeams = changes['teams'].currentValue as Team[];
      const previousTeams = changes['teams'].previousValue as Team[];

      if (this.hasTeamsChanged(currentTeams, previousTeams)) {
        this.updateFilteredTeams();
      }
    }
  }

  private hasTeamsChanged(current: Team[], previous: Team[]): boolean {
    if (!previous) return true;
    if (current.length !== previous.length) return true;

    return current.some((team, index) => {
      const prevTeam = previous[index];
      if (!prevTeam || team.id !== prevTeam.id) return true;
      if (team.players.length !== prevTeam.players.length) return true;

      return team.players.some((player, playerIndex) => {
        const prevPlayer = prevTeam.players[playerIndex];
        return player.id !== prevPlayer?.id;
      });
    });
  }

  private updateFilteredTeams() {
    this.filteredTeams = this.searchQuery.trim()
      ? this.filterTeams(this.searchQuery)
      : [...this.teams];
  }

  private filterTeams(query: string): Team[] {
    const searchTerm = query.toLowerCase();
    return this.teams.filter(
      (team) =>
        team.name.toLowerCase().includes(searchTerm) ||
        team.players.some((player) =>
          player.username.toLowerCase().includes(searchTerm)
        )
    );
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.updateFilteredTeams();
  }

  trackByTeamId(index: number, team: Team): string {
    return team.id;
  }
}
