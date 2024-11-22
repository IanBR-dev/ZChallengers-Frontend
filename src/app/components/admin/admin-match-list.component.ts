import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmWinnerModalComponent } from './confirm-winner-modal.component';
import { AdminMatchStatusComponent } from './admin-match-status.component';
import { Match, Team } from '../../models/types';
import { MatchesService } from './services/matches.service';
@Component({
  selector: 'app-admin-match-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminMatchStatusComponent,
    ConfirmWinnerModalComponent,
  ],
  template: `
    <div class="p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Search and Filters -->
        <div class="mb-8 flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="filterMatches()"
              placeholder="Search by team name, player name, or match ID..."
              class="w-full bg-black/30 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-gold focus:outline-none"
            />
          </div>
          <div class="flex gap-4">
            <select
              [(ngModel)]="statusFilter"
              (ngModelChange)="filterMatches()"
              class="bg-black/30 border border-gold/30 rounded-lg px-4 py-2 text-white focus:border-gold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="VOTING">Voting</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <!-- Stats Summary -->
        <div class="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="gold-border rounded-lg p-4 bg-black/50">
            <div class="text-sm text-gray-400">Total Matches</div>
            <div class="text-2xl text-gold">{{ matches.length }}</div>
          </div>
          <div class="gold-border rounded-lg p-4 bg-black/50">
            <div class="text-sm text-gray-400">In Progress</div>
            <div class="text-2xl text-yellow-500">
              {{ matchCountByStatus['IN_PROGRESS'] || 0 }}
            </div>
          </div>
          <div class="gold-border rounded-lg p-4 bg-black/50">
            <div class="text-sm text-gray-400">Voting</div>
            <div class="text-2xl text-blue-500">
              {{ matchCountByStatus['VOTING'] || 0 }}
            </div>
          </div>
          <div class="gold-border rounded-lg p-4 bg-black/50">
            <div class="text-sm text-gray-400">Completed</div>
            <div class="text-2xl text-green-500">
              {{ matchCountByStatus['COMPLETED'] || 0 }}
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="text-center py-8">
          <div
            class="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent mx-auto"
          ></div>
          <p class="mt-4 text-gray-400">Loading matches...</p>
        </div>

        <!-- Empty State -->
        <div
          *ngIf="!isLoading && filteredMatches.length === 0"
          class="text-center py-8"
        >
          <span class="material-symbols-outlined text-4xl text-gray-400"
            >search_off</span
          >
          <p class="mt-2 text-gray-400">No matches found</p>
          <p class="text-sm text-gray-500">Try adjusting your filters</p>
        </div>

        <!-- Matches Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let match of filteredMatches; trackBy: trackByMatchId"
            class="gold-border rounded-lg p-4 bg-black/50 hover:bg-black/70 transition-all duration-300 cursor-pointer"
            (click)="selectMatch(match)"
          >
            <div class="flex justify-between items-center mb-4">
              <span class="text-sm text-gray-400">Match #{{ match.id }}</span>
              <span [class]="'status-' + match.status.toLocaleLowerCase()">
                {{ match.status }}
              </span>
            </div>

            <div class="space-y-4">
              <!-- Team 1 -->
              <div class="flex items-center gap-2" *ngIf="match.team1Snapshot">
                <div class="w-8 h-8 flex-shrink-0">
                  <img
                    *ngIf="match.team1Snapshot.players[0].avatar"
                    [src]="match.team1Snapshot.players[0].avatar"
                    class="w-full h-full rounded-full object-cover"
                    alt="Team 1 Avatar"
                  />
                </div>
                <div class="flex-1">
                  <div class="text-white font-medium">
                    {{ match.team1Snapshot.name }}
                  </div>
                  <div class="text-sm text-gray-400">
                    {{ match.team1Snapshot.players.length || 0 }} players
                  </div>
                </div>
              </div>

              <!-- VS Divider -->
              <div class="text-center text-gold font-bold">VS</div>

              <!-- Team 2 -->
              <div class="flex items-center gap-2" *ngIf="match.team2Snapshot">
                <div class="w-8 h-8 flex-shrink-0">
                  <img
                    *ngIf="match.team2Snapshot.players[0].avatar"
                    [src]="match.team2Snapshot.players[0].avatar"
                    class="w-full h-full rounded-full object-cover"
                    alt="Team 2 Avatar"
                  />
                </div>
                <div class="flex-1">
                  <div class="text-white font-medium">
                    {{ match.team2Snapshot.name }}
                  </div>
                  <div class="text-sm text-gray-400">
                    {{ match.team2Snapshot.players.length || 0 }} players
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Match View -->
    <div *ngIf="selectedMatch" class="fixed inset-0 bg-black/95 z-40">
      <button
        (click)="closeMatch()"
        class="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        <span class="material-symbols-outlined">close</span>
      </button>

      <app-admin-match-status
        [matchId]="selectedMatch.id"
        [team1]="selectedMatch.team1Snapshot"
        [team2]="selectedMatch.team2Snapshot"
        (declareWinner)="openConfirmModal($event)"
      ></app-admin-match-status>
    </div>

    <!-- Confirmation Modal -->
    <app-confirm-winner-modal
      *ngIf="showConfirmModal"
      [match]="selectedMatch!"
      [selectedTeam]="selectedWinnerTeam!"
      (confirm)="confirmWinner($event)"
      (cancel)="cancelConfirmation()"
    ></app-confirm-winner-modal>
  `,
  styles: [
    `
      .gold-border {
        border: 1px solid rgba(255, 215, 0, 0.3);
      }

      .status-pending {
        @apply text-yellow-500 text-sm font-medium;
      }

      .status-in_progress {
        @apply text-blue-500 text-sm font-medium;
      }

      .status-voting {
        @apply text-purple-500 text-sm font-medium;
      }

      .status-completed {
        @apply text-green-500 text-sm font-medium;
      }
    `,
  ],
})
export class AdminMatchListComponent implements OnInit, OnDestroy {
  matches: Match[] = [];
  filteredMatches: Match[] = [];
  selectedMatch: Match | null = null;
  selectedWinnerTeam: Team | null | undefined = null;
  showConfirmModal = false;
  searchQuery = '';
  statusFilter = 'all';
  sortBy = 'newest';
  isLoading = true;
  matchCountByStatus: Record<string, number> = {};
  private destroy$ = new Subject<void>();

  constructor(private matchesService: MatchesService) {}

  ngOnInit() {
    this.matchesService
      .initializeMatchesStream()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (matches) => {
          this.matches = matches;
          this.updateMatchCountByStatus();
          this.filterMatches();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading matches:', error);
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateMatchCountByStatus() {
    this.matchCountByStatus = this.matches.reduce((acc, match) => {
      acc[match.status] = (acc[match.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  filterMatches() {
    this.filteredMatches = this.matches.filter((match) => {
      const searchTerms = [
        match.id,
        match.team1Snapshot?.name,
        match.team2Snapshot?.name,
        ...(match.team1Snapshot?.players?.map((p) => p.username) || []),
        ...(match.team2Snapshot?.players?.map((p) => p.username) || []),
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !this.searchQuery ||
        searchTerms.includes(this.searchQuery.toLowerCase());

      const matchesStatus =
        this.statusFilter === 'all' || match.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  trackByMatchId(index: number, match: Match): string {
    return match.id;
  }

  selectMatch(match: Match) {
    this.selectedMatch = match;
  }

  closeMatch() {
    this.selectedMatch = null;
  }

  openConfirmModal(event: { matchId: string; winnerId: string }) {
    if (!this.selectedMatch) return;

    const isTeam1Winner =
      this.selectedMatch.team1Snapshot?.id === event.winnerId;
    this.selectedWinnerTeam = isTeam1Winner
      ? this.selectedMatch.team1Snapshot
      : this.selectedMatch.team2Snapshot;
    this.showConfirmModal = true;
  }

  confirmWinner(event: { matchId: string; winnerId: string }) {
    this.matchesService.updateMatch(event).subscribe({
      next: () => {
        this.showConfirmModal = false;
        this.selectedMatch = null;
        this.selectedWinnerTeam = null;
      },
      error: (error) => {
        console.error('Error updating match:', error);
      },
    });
  }

  cancelConfirmation() {
    this.showConfirmModal = false;
    this.selectedWinnerTeam = null;
  }
}
