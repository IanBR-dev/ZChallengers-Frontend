import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../models/types';

@Component({
  selector: 'app-challenge-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    >
      <div
        class="bg-black/95 border border-gold p-8 rounded-lg max-w-md w-full animate-fadeIn"
      >
        <h2 class="text-2xl gold-gradient font-bold mb-6">Challenge Team</h2>

        <div class="mb-6">
          <h3 class="text-xl mb-2">{{ team.name }}</h3>
          <div class="space-y-2">
            <div
              *ngFor="let player of team.players"
              class="flex items-center gap-2"
            >
              <img [src]="player.avatar" class="w-8 h-8 rounded-full" />
              <span>{{ player.username }}</span>
              <span class="text-sm text-gray-400">{{ player.rank }}</span>
            </div>
          </div>
        </div>

        <p class="text-gray-300 mb-6">
          Are you sure you want to challenge this team to a match?
        </p>

        <div class="flex gap-4">
          <button class="gold-button flex-1" (click)="confirm.emit(team)">
            Challenge
          </button>
          <button class="gold-button flex-1" (click)="cancel.emit()">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ChallengeModalComponent {
  @Input() team!: Team;
  @Output() confirm = new EventEmitter<Team>();
  @Output() cancel = new EventEmitter<void>();
}
