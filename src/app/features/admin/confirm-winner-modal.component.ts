import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match, Team } from '../../models/types';

@Component({
  selector: 'app-confirm-winner-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    >
      <div class="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4 gold-gradient">Confirm Winner</h3>

        <p class="text-gray-300 mb-6">
          Are you sure you want to declare
          <span class="text-gold font-bold">{{ selectedTeam.name }}</span> as
          the winner of match #{{ match.id }}?
        </p>

        <div class="gold-border rounded-lg p-4 bg-black/50 mb-6">
          <div class="text-sm text-gray-400 mb-2">Selected Team:</div>
          <div class="flex items-center gap-3">
            <img
              [src]="selectedTeam.players[0].avatar"
              class="w-10 h-10 rounded-full"
            />
            <div>
              <div class="font-medium text-white">{{ selectedTeam.name }}</div>
              <div class="text-sm text-gray-400">
                {{ selectedTeam.players.length }} players
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button
            (click)="cancel.emit()"
            class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            (click)="
              confirm.emit({ matchId: match.id, winnerId: selectedTeam.id })
            "
            class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
          >
            Confirm Winner
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmWinnerModalComponent {
  @Input() match!: Match;
  @Input() selectedTeam!: Team;
  @Output() confirm = new EventEmitter<{ matchId: string; winnerId: string }>();
  @Output() cancel = new EventEmitter<void>();
}
