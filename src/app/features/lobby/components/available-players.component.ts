import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player, Invitation } from '../../../models/types';

@Component({
  selector: 'app-available-players-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-black/90 border border-gold/30 rounded-lg w-full max-w-2xl transform transition-all"
      >
        <!-- Header -->
        <div
          class="border-b border-gold/20 p-4 flex justify-between items-center"
        >
          <h2 class="text-xl gold-gradient font-bold flex items-center gap-2">
            <span class="material-symbols-outlined">group_add</span>
            Available Players
          </h2>
          <button
            class="text-gray-400 hover:text-white transition-colors"
            (click)="onClose.emit()"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Search -->
        <div class="p-4 border-b border-gold/20">
          <div class="relative">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Search players by name or rank..."
              class="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white 
                          placeholder-gray-400 focus:border-gold focus:outline-none pr-10"
            />
            <span
              class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              search
            </span>
          </div>
        </div>

        <!-- Players List -->
        <div class="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              *ngFor="let player of filteredPlayers"
              class="bg-black/40 border border-gold/10 rounded-lg p-3 hover:border-gold/30 
                        transition-colors animate-fadeIn"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 flex-1">
                  <div class="relative">
                    <img
                      [src]="player.avatar"
                      [alt]="player.username"
                      class="w-10 h-10 rounded-full object-cover"
                    />
                    <div
                      class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full 
                                border-2 border-black"
                    ></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium truncate">{{ player.username }}</h3>
                    <p class="text-sm text-gray-400">{{ player.rank }}</p>
                  </div>
                </div>

                <!-- Invite Button with States -->
                <ng-container *ngIf="getInviteState(player.id) as state">
                  <button
                    *ngIf="state.type === 'invite'"
                    class="gold-button text-sm px-3 py-1 transition-all hover:scale-105 active:scale-95"
                    (click)="handleInvite(player.id)"
                  >
                    Invite
                  </button>

                  <div
                    *ngIf="state.type === 'pending'"
                    class="text-sm text-gray-400 flex items-center gap-1"
                  >
                    <span
                      class="material-symbols-outlined text-base animate-spin"
                      >sync</span
                    >
                    <span>{{ state.timeLeft }}s</span>
                  </div>
                </ng-container>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            *ngIf="filteredPlayers.length === 0"
            class="text-center py-8 text-gray-400"
          >
            <span class="material-symbols-outlined text-4xl mb-2"
              >person_search</span
            >
            <p class="mb-1">No players found</p>
            <p class="text-sm">Try adjusting your search criteria</p>
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
        border-radius: 0.375rem;
      }

      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 215, 0, 0.3) transparent;
      }

      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }

      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(255, 215, 0, 0.3);
        border-radius: 3px;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fadeIn {
        animation: fadeIn 0.2s ease-out forwards;
      }
    `,
  ],
})
export class AvailablePlayersModalComponent {
  @Input() players: Player[] = [];
  @Input() pendingInvites: Invitation[] = [];
  @Output() onInvite = new EventEmitter<string>();
  @Output() onClose = new EventEmitter<void>();

  searchQuery = '';
  private inviteCooldowns = new Map<string, number>();
  private inviteTimers = new Map<string, any>();

  ngOnInit() {
    this.updateInviteCooldowns();
  }

  ngOnChanges() {
    this.updateInviteCooldowns();
  }

  ngOnDestroy() {
    // Limpiar todos los timers al destruir el componente
    this.inviteTimers.forEach((timer) => clearInterval(timer));
    this.inviteTimers.clear();
  }

  private updateInviteCooldowns() {
    this.pendingInvites.forEach((invite) => {
      const expiresAt = new Date(invite.expiresAt).getTime();
      const now = Date.now();
      if (expiresAt > now) {
        this.inviteCooldowns.set(invite.to.id, expiresAt);
        this.startCooldownTimer(invite.to.id, expiresAt);
      }
    });
  }

  private startCooldownTimer(playerId: string, expiresAt: number) {
    // Limpiar timer existente si hay uno
    if (this.inviteTimers.has(playerId)) {
      clearInterval(this.inviteTimers.get(playerId));
    }

    const timer = setInterval(() => {
      const now = Date.now();
      if (now >= expiresAt) {
        this.inviteCooldowns.delete(playerId);
        clearInterval(timer);
        this.inviteTimers.delete(playerId);
      }
    }, 1000);

    this.inviteTimers.set(playerId, timer);
  }

  handleInvite(playerId: string) {
    // Establecer inmediatamente el cooldown por 30 segundos
    const expiresAt = Date.now() + 15000; // 30 segundos
    this.inviteCooldowns.set(playerId, expiresAt);
    this.startCooldownTimer(playerId, expiresAt);

    // Emitir el evento de invitación
    this.onInvite.emit(playerId);
  }

  getInviteState(playerId: string): {
    type: 'invite' | 'pending';
    timeLeft?: string;
  } {
    const cooldownTime = this.inviteCooldowns.get(playerId);
    if (!cooldownTime) {
      return { type: 'invite' };
    }

    const timeLeft = Math.ceil((cooldownTime - Date.now()) / 1000);
    if (timeLeft <= 0) {
      this.inviteCooldowns.delete(playerId);
      return { type: 'invite' };
    }

    return {
      type: 'pending',
      timeLeft: timeLeft.toString(),
    };
  }

  get filteredPlayers(): Player[] {
    if (!this.searchQuery.trim()) {
      return this.players;
    }

    const query = this.searchQuery.toLowerCase();
    return this.players.filter(
      (player) =>
        player.username.toLowerCase().includes(query) ||
        player.rank?.toLowerCase().includes(query)
    );
  }
}
