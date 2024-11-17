import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team, Player, Vote } from '../models/types';

@Component({
  selector: 'app-vote-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 bg-black/95 flex items-center justify-center z-50 animate-fadeIn"
    >
      <div class="max-w-2xl w-full mx-4 text-center">
        <div class="text-6xl gold-gradient font-bold mb-8">VICTORY!</div>

        <div class="text-xl mb-4">
          Choose a player from the opposing team to recruit
        </div>

        <div
          *ngIf="selectedPlayer"
          class="mb-8 text-lg text-gold animate-fadeIn"
        >
          Selected: {{ selectedPlayer.username }}
        </div>

        <div class="grid grid-cols-2 gap-8 mb-8">
          <div
            *ngFor="let player of opposingTeam.players"
            class="player-card cursor-pointer transition-all duration-300"
            [class.selected-player]="selectedPlayer?.id === player.id"
            [class.opacity-50]="hasVoted && selectedPlayer?.id !== player.id"
            (click)="selectPlayer(player)"
          >
            <div class="relative">
              <img
                [src]="player.avatar"
                class="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <div
                *ngIf="selectedPlayer?.id === player.id"
                class="absolute -top-2 -right-2 bg-gold/20 rounded-full p-2 animate-fadeIn"
              >
                <span class="material-symbols-outlined text-gold">
                  check_circle
                </span>
              </div>
            </div>
            <div class="text-xl font-bold">{{ player.username }}</div>
            <div class="text-gold">{{ player.rank }}</div>

            <div
              *ngIf="getVotesForPlayer(player)"
              class="mt-4 text-sm text-gray-400"
            >
              Votes: {{ getVotesForPlayer(player) }}
            </div>
          </div>
        </div>

        <button
          *ngIf="!hasVoted"
          class="gold-button text-xl px-12"
          [disabled]="!selectedPlayer"
          [class.opacity-50]="!selectedPlayer"
          (click)="vote()"
        >
          Vote
        </button>

        <div *ngIf="hasVoted" class="text-xl text-gray-400 animate-pulse">
          Waiting for other team members to vote...
        </div>

        <div *ngIf="isVotingComplete" class="mt-8 animate-fadeIn">
          <div class="text-2xl gold-gradient font-bold mb-4">
            {{ winningPlayer?.username }} has joined your team!
          </div>
          <div class="text-lg text-gray-400 mb-4">
            Team Size: {{ currentTeam.players.length }} →
            {{ currentTeam.players.length + 1 }}
          </div>
          <button class="gold-button text-xl px-12" (click)="continue.emit()">
            Continue
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .selected-player {
        border: 2px solid var(--gold);
        transform: translateY(-4px);
        box-shadow: 0 4px 20px rgba(255, 215, 0, 0.2);
      }
    `,
  ],
})
export class VoteModalComponent {
  @Input() opposingTeam!: Team;
  @Input() currentTeam!: Team;
  @Input() votes: Vote[] = [];
  @Output() voteSubmitted = new EventEmitter<Player>();
  @Output() continue = new EventEmitter<void>();

  selectedPlayer: Player | null = null;
  hasVoted = false;
  isVotingComplete = false;
  winningPlayer: Player | null = null;

  selectPlayer(player: Player) {
    if (!this.hasVoted) {
      this.selectedPlayer = player;
    }
  }

  vote() {
    if (this.selectedPlayer) {
      this.hasVoted = true;
      this.voteSubmitted.emit(this.selectedPlayer);

      // Simulate other team members voting
      setTimeout(() => {
        // Generate random votes from other team members
        const otherPlayers = this.currentTeam.players.filter(
          (p) => p.id !== this.currentTeam.captain.id
        );

        otherPlayers.forEach((player) => {
          const randomPlayer =
            this.opposingTeam.players[
              Math.floor(Math.random() * this.opposingTeam.players.length)
            ];

   /*        this.votes = [
            ...this.votes,
            {
              fromPlayer: player,
              forPlayer: randomPlayer,
            },
          ]; */
        });

        this.isVotingComplete = true;
        this.calculateWinner();
      }, 2000); // Show voting progress for 2 seconds
    }
  }

  getVotesForPlayer(player: Player): number {
    return this.votes.filter((v) => v.forPlayer.id === player.id).length;
  }

  private calculateWinner() {
    const voteCounts = new Map<string, number>();
    const playerMap = new Map<string, Player>();
    let maxVotes = 0;
    const topVotedPlayers: Player[] = [];

    // Count votes and track max votes
    this.votes.forEach((vote) => {
      const playerId = vote.forPlayer.id;
      playerMap.set(playerId, vote.forPlayer);
      const count = (voteCounts.get(playerId) || 0) + 1;
      voteCounts.set(playerId, count);

      if (count > maxVotes) {
        maxVotes = count;
        topVotedPlayers.length = 0;
        topVotedPlayers.push(vote.forPlayer);
      } else if (count === maxVotes) {
        topVotedPlayers.push(vote.forPlayer);
      }
    });

    // If there's a tie, randomly select one of the top voted players
    const winnerIndex = Math.floor(Math.random() * topVotedPlayers.length);
    this.winningPlayer = topVotedPlayers[winnerIndex];
  }
}
