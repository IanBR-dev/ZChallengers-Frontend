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
    <div
      class="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div class="max-w-lg w-full mx-4 relative">
        <!-- Animación de partículas doradas -->
        <div class="absolute inset-0 overflow-hidden">
          <div
            *ngFor="let i of [1, 2, 3, 4, 5]"
            class="particle absolute w-2 h-2 bg-gold rounded-full"
            [style.animation-delay]="i * 0.2 + 's'"
          ></div>
        </div>

        <!-- Contenido principal -->
        <div
          class="bg-black/80 border border-gold/30 rounded-lg p-6 text-center animate-scale-in"
        >
          <div class="relative">
            <!-- Círculo animado -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="w-32 h-32 rounded-full border-4 border-gold/30 animate-pulse"
              ></div>
              <div
                class="absolute w-36 h-36 rounded-full border-2 border-gold/20 animate-spin-slow"
              ></div>
            </div>

            <!-- Icono central -->
            <div class="relative z-10 mb-6 transform animate-bounce-in">
              <span
                class="material-symbols-outlined text-6xl mb-4"
                [class.text-gold]="
                  currentTeam && currentTeam.id !== opposingTeam.id
                "
                [class.text-red-500]="
                  !currentTeam || currentTeam.id === opposingTeam.id
                "
              >
                {{ getIcon() }}
              </span>
              <h2
                class="text-2xl font-bold mb-2"
                [class.gold-gradient]="currentTeam"
                [class.text-red-500]="!currentTeam"
              >
                {{ getTitle() }}
              </h2>
              <p
                class="text-gray-700 font-medium"
                *ngIf="currentTeam && currentTeam.id !== opposingTeam.id"
              >
                {{ getStatusText() }}
              </p>
            </div>
          </div>

          <!-- Players Grid -->
          <div class="mt-8 space-y-4 animate-slide-up" *ngIf="!showingResults">
            <div class="grid grid-cols-2 gap-4">
              <div
                *ngFor="let player of opposingTeam.players"
                class="relative bg-black/30 p-4 rounded-lg border transition-all duration-300"
                [class.border-selected]="
                  canVote && selectedPlayer?.id === player.id
                "
                [class.border-unselected]="
                  canVote && selectedPlayer?.id !== player.id
                "
                [class.border-inactive]="!canVote"
                [class.hover-border]="canVote && !hasVoted"
                [class.cursor-pointer]="canVote && !hasVoted"
                [class.transform]="canVote && selectedPlayer?.id === player.id"
                [class.hover:scale-105]="canVote && !hasVoted"
                (click)="canVote && !hasVoted ? selectPlayer(player) : null"
              >
                <!-- Overlay de selección -->
                <div
                  *ngIf="canVote && selectedPlayer?.id === player.id"
                  class="absolute inset-0 bg-gold/10 rounded-lg animate-pulse-slow"
                ></div>

                <div class="relative z-10">
                  <div class="relative mb-3">
                    <img
                      [src]="player.avatar"
                      [alt]="player.username"
                      class="w-16 h-16 rounded-full mx-auto object-cover"
                    />

                    <!-- Indicador de votos -->
                    <div
                      *ngIf="getVoteCount(player) > 0"
                      class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gold/20 
                                flex items-center justify-center text-sm text-gold animate-bounce-in"
                    >
                      {{ getVoteCount(player) }}
                    </div>
                  </div>

                  <div class="font-medium">{{ player.username }}</div>
                  <div class="text-sm text-gold">{{ player.rank }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Resultado Final -->
          <div *ngIf="showingResults" class="mt-8 space-y-6 animate-slide-up">
            <div
              class="relative"
              *ngIf="currentTeam && currentTeam.id !== opposingTeam.id"
            >
              <img
                [src]="mostVotedPlayer?.avatar"
                class="w-24 h-24 rounded-full mx-auto border-4 border-gold animate-winner-glow"
              />
              <div class="absolute -top-4 -right-4 transform rotate-12">
                <span
                  class="material-symbols-outlined text-4xl text-gold animate-bounce"
                >
                  military_tech
                </span>
              </div>
            </div>

            <div>
              <h3
                class="text-2xl font-bold gold-gradient mb-2"
                *ngIf="currentTeam && currentTeam.id !== opposingTeam.id"
              >
                {{ mostVotedPlayer?.username }}
              </h3>
              <p class="text-gold text-lg mb-1">
                {{ isComplete ? getBodyText() : 'Most Valuable Player!' }}
              </p>
              <p class="text-gray-400">
                {{
                  isComplete
                    ? getFooterText()
                    : 'Received ' + getVoteCount(getWinningPlayer()) + ' votes'
                }}
              </p>
            </div>

            <button
              *ngIf="isComplete"
              (click)="onVotingComplete.emit()"
              class="mt-4 gold-button px-8 py-2 text-lg animate-fade-in hover:scale-105 
                     active:scale-95 transition-all duration-200"
            >
              Continue
            </button>
          </div>

          <!-- Botón de Votación -->
          <button
            *ngIf="canVote && !hasVoted"
            (click)="submitVote()"
            class="mt-8 gold-button px-8 py-2 text-lg animate-fade-in"
            [class.opacity-50]="!selectedPlayer"
            [disabled]="!selectedPlayer"
          >
            Cast Your Vote
          </button>

          <!-- Estado de Espera -->
          <div *ngIf="hasVoted && !showingResults" class="mt-8 animate-pulse">
            <span class="material-symbols-outlined text-2xl text-gold"
              >pending</span
            >
            <p class="text-gray-400 mt-2">Waiting for other votes...</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .gold-gradient {
        background: linear-gradient(to right, #ffd700, #b8860b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .gold-button {
        background: linear-gradient(to right, #ffd700, #b8860b);
        color: black;
        font-weight: 500;
        border-radius: 0.5rem;
      }

      .gold-button:hover:not(:disabled) {
        transform: scale(1.02);
        filter: brightness(1.1);
      }

      .gold-button:active:not(:disabled) {
        transform: scale(0.98);
      }

      .border-selected {
        border-color: var(--color-gold);
      }

      .border-unselected {
        border-color: rgba(255, 215, 0, 0.1);
      }

      .border-inactive {
        border-color: rgba(255, 215, 0, 0.3);
      }

      .hover-border:hover {
        border-color: rgba(255, 215, 0, 0.5);
      }

      @keyframes winner-glow {
        0%,
        100% {
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }
        50% {
          box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
        }
      }

      .animate-winner-glow {
        animation: winner-glow 2s ease-in-out infinite;
      }

      @keyframes pulse-slow {
        0%,
        100% {
          opacity: 0.1;
        }
        50% {
          opacity: 0.3;
        }
      }

      .animate-pulse-slow {
        animation: pulse-slow 2s ease-in-out infinite;
      }

      @keyframes scale-in {
        0% {
          transform: scale(0.8);
          opacity: 0;
        }
        100% {
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
        0% {
          transform: translateY(20px);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes fade-in {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
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

      .animate-fade-in {
        animation: fade-in 0.5s ease-out;
        animation-fill-mode: forwards;
        opacity: 0;
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

      :host {
        --color-gold: #ffd700;
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
