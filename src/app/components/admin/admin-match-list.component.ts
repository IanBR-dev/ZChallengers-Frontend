import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmWinnerModalComponent } from './confirm-winner-modal.component';
import { AdminMatchStatusComponent } from './admin-match-status.component';
import { Match, Team } from '../../models/types';
import { MatchesService } from '../../services/matches.service';

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
        <div class="mb-8 flex gap-4 items-center">
          <div class="flex-1">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="filterMatches()"
              placeholder="Search by team name, player name, or match ID..."
              class="w-full bg-black/30 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-gold focus:outline-none"
            />
          </div>
          <select
            [(ngModel)]="statusFilter"
            (ngModelChange)="filterMatches()"
            class="bg-black/30 border border-gold/30 rounded-lg px-4 py-2 text-white focus:border-gold focus:outline-none"
          >
            <option value="all">All Matches</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <!-- Matches Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let match of filteredMatches"
            class="gold-border rounded-lg p-4 bg-black/50 hover:bg-black/70 transition-all duration-300 cursor-pointer"
            (click)="selectMatch(match)"
          >
            <div class="flex justify-between items-center mb-4">
              <span class="text-sm text-gray-400">Match #{{ match.id }}</span>
              <span [class]="getStatusClass(match.status)">
                {{ match.status }}
              </span>
            </div>

            <div class="space-y-4">
              <!-- Team 1 -->
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 flex-shrink-0">
                  <img
                    [src]="match.team1.players[0].avatar"
                    class="w-full h-full rounded-full"
                  />
                </div>
                <div class="flex-1">
                  <div class="text-white font-medium">
                    {{ match.team1.name }}
                  </div>
                  <div class="text-sm text-gray-400">
                    {{ match.team1.players.length }} players
                  </div>
                </div>
              </div>

              <!-- VS Divider -->
              <div class="text-center text-gold font-bold">VS</div>

              <!-- Team 2 -->
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 flex-shrink-0">
                  <img
                    [src]="match.team2.players[0].avatar"
                    class="w-full h-full rounded-full"
                  />
                </div>
                <div class="flex-1">
                  <div class="text-white font-medium">
                    {{ match.team2.name }}
                  </div>
                  <div class="text-sm text-gray-400">
                    {{ match.team2.players.length }} players
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 text-sm text-gray-400">
              <!-- Started: {{ match.startTime | date : 'medium' }} -->
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
        [team1]="selectedMatch.team1"
        [team2]="selectedMatch.team2"
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

      .status-completed {
        @apply text-green-500 text-sm font-medium;
      }
    `,
  ],
})
export class AdminMatchListComponent implements OnInit {
  matches: Match[] = [];
  filteredMatches: Match[] = [];
  selectedMatch: Match | null = null;
  selectedWinnerTeam: Team | null = null;
  showConfirmModal = false;
  searchQuery = '';
  statusFilter = 'all';

  constructor(private matchesService: MatchesService) {
    this.loadMatches();
  }

  ngOnInit() {}

  private loadMatches() {
    // Simulated data - replace with actual service call
    this.matchesService.getMatches().subscribe((matches) => {
      this.matches = matches;
      this.filterMatches();
    });
  }

  filterMatches() {
    this.filteredMatches = this.matches.filter((match) => {
      const matchesSearch =
        !this.searchQuery ||
        match.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        match.team1.name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        match.team2.name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        match.team1.players.some((p) =>
          p.username.toLowerCase().includes(this.searchQuery.toLowerCase())
        ) ||
        match.team2.players.some((p) =>
          p.username.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

      const matchesStatus =
        this.statusFilter === 'all' || match.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  selectMatch(match: Match) {
    this.selectedMatch = match;
  }

  closeMatch() {
    this.selectedMatch = null;
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  openConfirmModal(event: { matchId: string; winnerId: string }) {
    if (!this.selectedMatch) return;

    this.selectedWinnerTeam =
      this.selectedMatch.team1.id === event.winnerId
        ? this.selectedMatch.team1
        : this.selectedMatch.team2;
    this.showConfirmModal = true;
  }

  confirmWinner(event: { matchId: string; winnerId: string }) {
    // Aquí implementarías la lógica para actualizar el ganador
    this.matchesService.updateMatch(event).subscribe((match) => {
      this.showConfirmModal = false;
      this.selectedMatch = null;
      this.selectedWinnerTeam = null;
      this.matchesService;
      this.loadMatches(); // Recargar la lista de matches
    });
  }

  cancelConfirmation() {
    this.showConfirmModal = false;
    this.selectedWinnerTeam = null;
  }
}
