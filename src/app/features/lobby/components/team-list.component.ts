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
    <div class="mb-8">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <h2 class="text-xl md:text-2xl gold-gradient">
          Available Teams ({{ filteredTeams.length }}/{{ teams.length }})
        </h2>
        <div class="relative flex-1 md:max-w-md">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch($event)"
            placeholder="Search teams or players..."
            class="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-gold focus:outline-none text-sm"
          />
          <span
            class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            search
          </span>
        </div>
      </div>

      <div
        *ngIf="filteredTeams.length > 0; else noTeams"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <app-team-card
          *ngFor="
            let team of filteredTeams;
            trackBy: trackByTeamId;
            let i = index
          "
          [team]="team"
          [showChallengeButton]="isTeamCaptain"
          (onChallenge)="onChallengeTeam.emit($event)"
        >
        </app-team-card>
      </div>

      <ng-template #noTeams>
        <div class="text-center py-8 text-gray-400">
          <p class="mb-2">No teams available at the moment</p>
          <p class="text-sm">Check back later or wait for new teams to join</p>
        </div>
      </ng-template>
    </div>
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
    if (!previous) {
      return true;
    }

    if (current.length !== previous.length) {
      return true;
    }

    const hasChanges = current.some((team, index) => {
      const prevTeam = previous[index];
      if (!prevTeam) {
        return true;
      }

      if (team.id !== prevTeam.id) {
        return true;
      }

      if (team.players.length !== prevTeam.players.length) {
        return true;
      }

      const playerChanges = team.players.some((player, playerIndex) => {
        const prevPlayer = prevTeam.players[playerIndex];
        const changed = player.id !== prevPlayer?.id;
        return changed;
      });
      return playerChanges;
    });
    return hasChanges;
  }

  private updateFilteredTeams() {
    this.filteredTeams = this.searchQuery.trim()
      ? this.filterTeams(this.searchQuery)
      : [...this.teams];
  }

  private filterTeams(query: string): Team[] {
    const searchTerm = query.toLowerCase();
    const filtered = this.teams.filter(
      (team) =>
        team.name.toLowerCase().includes(searchTerm) ||
        team.players.some((player) =>
          player.username.toLowerCase().includes(searchTerm)
        )
    );
    return filtered;
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.updateFilteredTeams();
  }

  trackByTeamId(index: number, team: Team): string {
    return team.id;
  }
}
