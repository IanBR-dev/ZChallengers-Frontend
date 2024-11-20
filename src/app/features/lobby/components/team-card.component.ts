import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../../../models/types';
import { PlayerCardComponent } from './player-card.component';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [CommonModule, PlayerCardComponent],
  template: `
    <div
      class="gold-border rounded-lg p-4 bg-black/50 hover:bg-black/60 transition-colors"
    >
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg gold-gradient">{{ team.name }}</h3>
        <button
          *ngIf="showChallengeButton"
          class="gold-button text-sm px-3 py-1"
          (click)="onChallenge.emit(team)"
        >
          Challenge
        </button>
      </div>
      <div class="space-y-2">
        <app-player-card
          *ngFor="let player of team.players"
          [player]="player"
          [isCaptain]="player.id === team.captain.id"
        >
        </app-player-card>
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

      :host {
        display: block;
      }

      .gold-border {
        position: relative;
        overflow: hidden;
      }

      .gold-border::before {
        content: '';
        position: absolute;
        inset: 0;
        border: 1px solid transparent;
        background: linear-gradient(to right, #ffd700, #b8860b) border-box;
        -webkit-mask: linear-gradient(#fff 0 0) padding-box,
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: destination-out;
        mask-composite: exclude;
      }

      .gold-button {
        background: linear-gradient(to right, #ffd700, #b8860b);
        color: black;
        font-weight: 500;
        border-radius: 0.5rem;
        transition: all 200ms;
      }

      .gold-button:hover {
        transform: scale(1.02);
        filter: brightness(1.1);
      }

      .gold-button:active {
        transform: scale(0.98);
      }
    `,
  ],
})
export class TeamCardComponent {
  @Input() team!: Team;
  @Input() showChallengeButton = false;
  @Output() onChallenge = new EventEmitter<Team>();
}
