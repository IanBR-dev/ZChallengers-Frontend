import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player, Team, Vote } from '../../../../models/types';

@Component({
  selector: 'app-vote-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[70] flex items-center justify-center">
      <!-- Backdrop with blur -->
      <div class="absolute inset-0" style="background: var(--bg-overlay)"></div>

      <!-- Modal Container -->
      <div class="max-w-lg w-full mx-4 relative">
        <!-- Particle Effects -->
        <div class="absolute inset-0 overflow-hidden">
          <div
            *ngFor="let i of [1, 2, 3, 4, 5]"
            class="particle absolute w-2 h-2 rounded-full"
            [style.background]="'var(--primary)'"
            [style.animation-delay]="i * 0.2 + 's'"
          ></div>
        </div>

        <!-- Main Content -->
        <div class="glass rounded-lg p-8 text-center animate-scale-in">
          <!-- Animated Circles -->
          <div class="relative mb-8">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="circle-outer"></div>
              <div class="circle-inner"></div>
            </div>

            <!-- Icon and Title -->
            <div class="relative z-10 transform animate-bounce-in">
              <i
                [class]="'fas fa-' + getIcon() + ' text-6xl mb-4'"
                [style.color]="'var(--primary)'"
              ></i>
              <h2 class="text-2xl font-bold mb-2" style="color: var(--primary)">
                {{ getTitle() }}
              </h2>
              <p style="color: var(--text-secondary)">
                {{ getStatusText() }}
              </p>
            </div>
          </div>

          <!-- Players Grid -->
          <div class="mt-8 space-y-4 animate-slide-up" *ngIf="!showingResults">
            <div class="grid grid-cols-2 gap-4">
              <div
                *ngFor="let player of opposingTeam.players"
                class="player-card"
                [class.selectable]="canVote && !hasVoted"
                [class.selected]="selectedPlayer?.id === player.id"
                (click)="canVote && !hasVoted ? selectPlayer(player) : null"
              >
                <!-- Player Content -->
                <div class="relative">
                  <!-- Avatar -->
                  <div class="relative mb-3">
                    <img
                      [src]="player.avatar"
                      [alt]="player.username"
                      class="w-16 h-16 rounded-lg mx-auto object-cover"
                    />
                    <!-- Vote Count Badge -->
                    <div *ngIf="getVoteCount(player) > 0" class="vote-badge">
                      {{ getVoteCount(player) }}
                    </div>
                  </div>

                  <!-- Player Info -->
                  <div class="player-info">
                    <div class="player-name">{{ player.username }}</div>
                    <div class="player-rank">{{ player.rank }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Results View -->
          <div *ngIf="showingResults" class="mt-8 space-y-6 animate-slide-up">
            <!-- Winner Avatar -->
            <div class="relative" *ngIf="mostVotedPlayer">
              <div class="winner-avatar">
                <img
                  [src]="mostVotedPlayer.avatar"
                  [alt]="mostVotedPlayer.username"
                  class="w-24 h-24 rounded-lg mx-auto object-cover"
                />
                <div class="winner-crown">
                  <span class="material-symbols-outlined text-xs">
                    military_tech
                  </span>
                </div>
              </div>
            </div>

            <!-- Winner Info -->
            <div class="winner-info">
              <h3 class="text-2xl font-bold mb-2" style="color: var(--primary)">
                {{ mostVotedPlayer?.username }}
              </h3>
              <p style="color: var(--text-primary)">
                {{ getBodyText() }}
              </p>
              <p style="color: var(--text-secondary)">
                {{ getFooterText() }}
              </p>
            </div>

            <!-- Continue Button -->
            <button
              *ngIf="isComplete"
              (click)="onVotingComplete.emit()"
              class="continue-button"
            >
              Continue
            </button>
          </div>

          <!-- Vote Button -->
          <button
            *ngIf="canVote && !hasVoted"
            (click)="submitVote()"
            class="vote-button"
            [class.disabled]="!selectedPlayer"
            [disabled]="!selectedPlayer"
          >
            Cast Your Vote
          </button>

          <!-- Waiting State -->
          <div *ngIf="hasVoted && !showingResults" class="waiting-state">
            <span class="material-symbols-outlined">sync</span>
            <p style="color: var(--text-secondary)">
              Waiting for other votes...
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .circle-outer {
        @apply w-36 h-36 rounded-full absolute;
        border: 2px solid var(--primary);
        opacity: 0.3;
        animation: spin 8s linear infinite;
      }

      .circle-inner {
        @apply w-32 h-32 rounded-full absolute;
        border: 4px solid var(--primary);
        opacity: 0.2;
        animation: pulse 2s ease-in-out infinite;
      }

      .player-card {
        @apply p-4 rounded-lg transition-all duration-200;
        background: var(--bg-dark);
        border: 1px solid var(--border-light);
      }

      .player-card.selectable {
        @apply cursor-pointer;
      }

      .player-card.selectable:hover {
        border-color: var(--primary);
        transform: translateY(-1px);
      }

      .player-card.selected {
        background: var(--primary-light);
        border-color: var(--primary);
      }

      .vote-badge {
        @apply absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-sm;
        background: var(--primary);
        color: var(--text-primary);
        animation: bounce 1s infinite;
      }

      .player-name {
        @apply font-medium;
        color: var(--text-primary);
      }

      .player-rank {
        @apply text-sm;
        color: var(--text-secondary);
      }

      .winner-avatar {
        @apply relative inline-block;
      }

      .winner-avatar img {
        border: 4px solid var(--primary);
        animation: winner-glow 2s infinite;
      }

      .winner-crown {
        @apply absolute -top-4 -right-4 text-2xl transform rotate-12;
        color: var(--primary);
        animation: bounce 2s infinite;
      }

      .vote-button,
      .continue-button {
        @apply px-8 py-3 rounded-lg font-medium transition-all duration-200;
        background: var(--primary);
        color: var(--text-primary);
      }

      .vote-button:hover:not(.disabled),
      .continue-button:hover {
        filter: brightness(1.1);
        transform: translateY(-1px);
      }

      .vote-button.disabled {
        @apply opacity-50 cursor-not-allowed;
      }

      .waiting-state {
        @apply mt-8 space-y-2;
        color: var(--primary);
      }

      .particle {
        --tx: 0px;
        --ty: 0px;
        animation: particle-float 2s ease-out infinite;
        opacity: 0;
      }

      .particle:nth-child(1) {
        --tx: 100px;
        --ty: -100px;
      }
      .particle:nth-child(2) {
        --tx: -80px;
        --ty: -120px;
      }
      .particle:nth-child(3) {
        --tx: 120px;
        --ty: 80px;
      }
      .particle:nth-child(4) {
        --tx: -100px;
        --ty: 90px;
      }
      .particle:nth-child(5) {
        --tx: 90px;
        --ty: 110px;
      }

      @keyframes winner-glow {
        0%,
        100% {
          box-shadow: 0 0 20px var(--primary-light);
        }
        50% {
          box-shadow: 0 0 40px var(--primary);
        }
      }

      @keyframes particle-float {
        0% {
          transform: translate(0, 0) rotate(0deg);
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
        100% {
          transform: translate(var(--tx), var(--ty)) rotate(360deg);
          opacity: 0;
        }
      }

      .animate-scale-in {
        animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .animate-bounce-in {
        animation: bounce-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .animate-slide-up {
        animation: slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        animation-delay: 0.3s;
        opacity: 0;
        animation-fill-mode: forwards;
      }

      @keyframes scale-in {
        from {
          transform: scale(0.8);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes bounce-in {
        0% {
          transform: scale(0.3);
          opacity: 0;
        }
        50% {
          transform: scale(1.1);
        }
        70% {
          transform: scale(0.9);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes slide-up {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class VoteModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() opposingTeam!: Team;
  @Input() currentTeam!: Team;
  @Input() canVote = false;
  @Input() submittedVotes: Vote[] = [];
  @Input() isComplete = false;
  @Input() winnerTeamId?: string;
  @Input() mostVotedPlayer!: Player | null | undefined;
  @Input() currentPlayer!: Player;
  @Output() onVoteSubmit = new EventEmitter<string>();
  @Output() onVotingComplete = new EventEmitter<void>();

  selectedPlayer: Player | null = null;
  hasVoted = false;
  showingResults = false;
  private resultsTimer: any;

  myTeam!: Team;

  ngOnInit() {
    this.checkVotingStatus();
    this.myTeam = { ...this.currentTeam };
  }

  ngOnDestroy() {
    if (this.resultsTimer) {
      clearTimeout(this.resultsTimer);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['submittedVotes'] || changes['isComplete']) {
      this.checkVotingStatus();
    }
  }

  selectPlayer(player: Player) {
    if (!this.hasVoted && this.canVote) {
      this.selectedPlayer = player;
    }
  }

  submitVote() {
    if (this.selectedPlayer && this.canVote && !this.hasVoted) {
      this.hasVoted = true;
      this.onVoteSubmit.emit(this.selectedPlayer.id);
    }
  }

  private checkVotingStatus() {
    const expectedVotes = this.currentTeam.players.length;
    const actualVotes = this.submittedVotes.length;

    // Si ya estamos mostrando resultados, no hacer nada
    if (this.showingResults) {
      return;
    }

    // Mostrar resultados si tenemos todos los votos o el match está completo
    if (actualVotes >= expectedVotes || this.isComplete) {
      this.showingResults = true;

      // Si el match está completo, no cerrar automáticamente
      if (!this.isComplete) {
        this.resultsTimer = setTimeout(() => {
          this.onVotingComplete.emit();
        }, 3000);
      }
    }
  }

  getVoteCount(player: Player | null): number {
    if (!player) return 0;
    return this.submittedVotes.filter((v) => v.forPlayer.id === player.id)
      .length;
  }

  getWinningPlayer(): Player | null {
    if (!this.submittedVotes.length) return null;

    const voteCounts = new Map<string, number>();
    let maxVotes = 0;
    let winningPlayerId = '';

    // Contar votos
    this.submittedVotes.forEach((vote) => {
      const playerId = vote.forPlayer.id;
      const currentCount = (voteCounts.get(playerId) || 0) + 1;
      voteCounts.set(playerId, currentCount);

      if (currentCount > maxVotes) {
        maxVotes = currentCount;
        winningPlayerId = playerId;
      }
    });

    return (
      this.opposingTeam.players.find((p) => p.id === winningPlayerId) || null
    );
  }

  getIcon(): string {
    if (this.showingResults) {
      if (this.isComplete) {
        if (this.currentTeam.status === 'eliminated') return 'warning';
        if (this.mostVotedPlayer?.id === this.currentPlayer?.id)
          return 'military_tech';
        return this.currentTeam.id === this.winnerTeamId
          ? 'military_tech'
          : 'person_remove';
      }
      return this.canVote ? 'military_tech' : 'pending';
    }
    if (this.canVote) return this.hasVoted ? 'how_to_vote' : 'pending';
    return 'pending';
  }

  getTitle(): string {
    if (this.showingResults) {
      if (this.isComplete) {
        if (this.currentTeam.status === 'eliminated') return 'TEAM ELIMINATED!';
        if (this.mostVotedPlayer?.id === this.currentPlayer?.id)
          return 'YOU WERE CHOSEN!';
        return this.currentTeam.id === this.winnerTeamId
          ? 'NEW RECRUIT ACQUIRED!'
          : 'PLAYER TRANSFERRED!';
      }
      return this.canVote ? 'VOTING COMPLETE!' : 'VOTES IN PROGRESS';
    }
    if (this.canVote)
      return this.hasVoted ? 'VOTE SUBMITTED!' : 'CHOOSE YOUR MVP!';
    return 'VOTES IN PROGRESS';
  }

  getStatusText(): string {
    if (this.showingResults) {
      if (this.isComplete) {
        if (this.currentTeam.status === 'eliminated') {
          return 'Your team has been disbanded. Time to regroup!';
        }
        if (this.mostVotedPlayer?.id === this.currentPlayer?.id) {
          return 'The arena awaits your arrival!';
        }
        return this.currentTeam.id === this.winnerTeamId
          ? 'A new warrior joins your ranks!'
          : 'Your teammate has been transferred';
      }
      return this.canVote
        ? 'The votes are in!'
        : 'Waiting for final results...';
    }
    if (this.canVote) {
      return this.hasVoted
        ? 'Waiting for other votes...'
        : 'Select the most valuable player';
    }
    return 'The winning team is casting their votes...';
  }

  getBodyText(): string {
    if (this.isComplete) {
      if (this.currentTeam.status === 'eliminated') {
        return 'Your team has been disbanded';
      }
      if (this.mostVotedPlayer?.id === this.currentPlayer?.id) {
        return 'Prepare for glory!';
      }
      return this.currentTeam.id === this.winnerTeamId
        ? 'Has joined your ranks!'
        : 'Has been transferred';
    }
    return 'Most Valuable Player!';
  }

  getFooterText(): string {
    const oldSize =
      this.currentTeam.id === this.winnerTeamId
        ? this.currentTeam.players.length - 1
        : this.currentTeam.players.length + 1;
    const newSize = this.currentTeam.players.length;

    return `Team Size: ${oldSize} → ${newSize}`;
  }
}
