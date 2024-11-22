import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../../models/types';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-black/30 p-3 rounded-lg border border-gold/10">
      <div class="flex items-center gap-2">
        <img
          [src]="player.avatar"
          [alt]="player.username"
          class="w-8 h-8 rounded-full object-cover"
        />
        <div class="flex-1">
          <span
            class="block text-sm font-medium"
            [class]="
              currentPlayer && currentPlayer.id === player.id ? 'text-gold' : ''
            "
            >{{ player.username }}</span
          >
          <span class="text-xs text-gray-400">{{ player.rank }}</span>
        </div>
        <span *ngIf="isCaptain" class="text-gold text-xs">Captain</span>
      </div>
    </div>
  `,
})
export class PlayerCardComponent {
  @Input() player!: Player;
  @Input() isCaptain = false;
  @Input() currentPlayer!: Player;
}
