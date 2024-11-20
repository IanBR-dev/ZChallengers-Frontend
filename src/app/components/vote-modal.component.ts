import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
        <div class="text-6xl gold-gradient font-bold mb-8">
          {{ canVote ? 'VICTORY!' : 'DEFEAT!' }}
        </div>

        <div class="text-xl mb-4">
          {{
            canVote
              ? 'Choose a player from the opposing team to recruit'
              : 'Opposing team is voting'
          }}
        </div>

        <div
          *ngIf="selectedPlayer && canVote"
          class="mb-8 text-lg text-gold animate-fadeIn"
        >
          Selected: {{ selectedPlayer.username }}
        </div>

        <div class="grid grid-cols-2 gap-8 mb-8">
          <div
            *ngFor="let player of opposingTeam.players"
            class="player-card transition-all duration-300"
            [class.selected-player]="
              canVote && selectedPlayer?.id === player.id
            "
            [class.opacity-50]="
              canVote && hasVoted && selectedPlayer?.id !== player.id
            "
            (click)="canVote ? selectPlayer(player) : null"
          >
            <div class="relative">
              <img
                [src]="player.avatar"
                class="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <div
                *ngIf="canVote && selectedPlayer?.id === player.id"
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
          *ngIf="canVote && !hasVoted"
          class="gold-button text-xl px-12"
          [disabled]="!selectedPlayer"
          [class.opacity-50]="!selectedPlayer"
          (click)="vote()"
        >
          Vote
        </button>

        <div *ngIf="!canVote" class="text-xl text-gray-400">
          Waiting for opposing team to finish voting...
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
export class VoteModalComponent implements OnInit {
  @Input() opposingTeam!: Team;
  @Input() currentTeam!: Team;
  @Input() votes: Vote[] | null | undefined = null;
  @Input() canVote = false;
  @Output() voteSubmitted = new EventEmitter<Player>();
  @Output() continue = new EventEmitter<void>();

  selectedPlayer: Player | null = null;
  hasVoted = false;
  isVotingComplete = false;
  winningPlayer: Player | null = null;

  @Input() myVote: Vote | undefined = undefined;

  ngOnInit(): void {
    if (this.votes && this.votes?.length > 0) {
      this.myVote ? (this.hasVoted = true) : (this.hasVoted = false);
      this.opposingTeam.players.forEach((player) => {
        if (player.id === this.myVote?.forPlayer.id) {
          this.selectedPlayer = player;
        }
      });
    }
  }

  selectPlayer(player: Player) {
    if (!this.hasVoted && this.canVote) {
      this.selectedPlayer = player;
    }
  }

  vote() {
    if (this.selectedPlayer && this.canVote) {
      this.hasVoted = true;
      this.voteSubmitted.emit(this.selectedPlayer);
    }
  }

  getVotesForPlayer(player: Player): number | undefined {
    return this.votes?.filter((v) => v.forPlayer.id === player.id).length;
  }

  /*   private calculateWinner() {
    const voteCounts = new Map<string, number>();
    const playerMap = new Map<string, Player>();
    let maxVotes = 0;
    const topVotedPlayers: Player[] = [];

    this.votes.forEach((vote) => {
      const playerId = vote.forPlayer.id || '';
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

    const winnerIndex = Math.floor(Math.random() * topVotedPlayers.length);
    this.winningPlayer = topVotedPlayers[winnerIndex];
  } */
}
