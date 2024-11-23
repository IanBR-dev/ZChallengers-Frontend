import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player, Invitation } from '../../../models/types';

@Component({
  selector: 'app-available-players-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div
        class="absolute inset-0"
        style="background: var(--bg-overlay)"
        (click)="onClose.emit()"
      ></div>

      <!-- Modal -->
      <div class="glass w-full max-w-4xl relative animate-slide-up">
        <!-- Header -->
        <div class="p-6 flex flex-col">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold" style="color: var(--primary)">
              <span class="material-symbols-outlined">group_add</span>
              Available Players
            </h2>
            <button class="modal-close-button" (click)="onClose.emit()">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Search -->
          <div class="relative">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Search players by name or rank..."
              class="search-input"
            />
            <span
              class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2"
              style="color: var(--text-muted)"
            >
              {{ searchQuery ? 'close' : 'search' }}
            </span>
          </div>
        </div>

        <!-- Players Grid -->
        <div class="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              *ngFor="let player of filteredPlayers"
              class="player-card group"
            >
              <!-- Player Info -->
              <div class="flex items-center gap-4">
                <!-- Avatar with Status -->
                <div class="relative">
                  <img
                    [src]="player.avatar"
                    [alt]="player.username"
                    class="w-12 h-12 rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <!--                 <div
                    class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2"
                    [style.background]="
                      player.status === 'online'
                        ? 'var(--success)'
                        : player.status === 'in-game'
                        ? 'var(--warning)'
                        : 'var(--error)'
                    "
                    [style.border-color]="'var(--bg-dark)'"
                  ></div> -->
                </div>

                <!-- Player Details -->
                <div class="flex-1 min-w-0">
                  <h3
                    class="font-medium truncate"
                    style="color: var(--text-primary)"
                  >
                    {{ player.username }}
                  </h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="rank-badge">
                      {{ player.rank }}
                    </span>
                    <!--    <span class="stats-text">
                      Win Rate: {{ player.stats?.winRate || '0' }}%
                    </span> -->
                  </div>
                </div>

                <!-- Invite Button States -->
                <ng-container *ngIf="getInviteState(player.id) as state">
                  <button
                    *ngIf="state.type === 'invite'"
                    class="invite-button"
                    (click)="handleInvite(player.id)"
                  >
                    Invite
                  </button>

                  <div *ngIf="state.type === 'pending'" class="pending-state">
                    <span class="material-symbols-outlined">sync</span>
                    <span>{{ state.timeLeft }}s</span>
                  </div>
                </ng-container>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="filteredPlayers.length === 0" class="empty-state">
            <span
              class="material-symbols-outlined text-lg"
              style="color: var(--text-muted)"
            >
              person_search
            </span>
            <p class="text-lg" style="color: var(--text-primary)">
              No players found
            </p>
            <p class="text-sm" style="color: var(--text-secondary)">
              Try adjusting your search criteria
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-close-button {
        @apply w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200;
        background: var(--bg-dark);
        color: var(--text-secondary);
        border: 1px solid var(--border-light);
      }

      .modal-close-button:hover {
        color: var(--primary);
        border-color: var(--primary);
        transform: rotate(90deg);
      }

      .search-input {
        @apply w-full px-4 py-3 rounded-lg pr-10;
        background: var(--bg-dark);
        border: 1px solid var(--border-light);
        color: var(--text-primary);
        transition: all 0.2s ease;
      }

      .search-input:focus {
        outline: none;
        border-color: var(--primary);
      }

      .search-input::placeholder {
        color: var(--text-muted);
      }

      .player-card {
        @apply p-4 rounded-lg transition-all duration-200;
        background: var(--bg-dark);
        border: 1px solid var(--border-light);
      }

      .player-card:hover {
        border-color: var(--primary);
        transform: translateY(-1px);
      }

      .rank-badge {
        @apply text-xs px-2 py-0.5 rounded-full;
        background: var(--primary-light);
        color: var(--primary);
      }

      .stats-text {
        @apply text-xs;
        color: var(--text-muted);
      }

      .invite-button {
        @apply px-4 py-1.5 rounded text-sm font-medium transition-all duration-200;
        background: var(--primary);
        color: var(--text-primary);
      }

      .invite-button:hover {
        filter: brightness(1.1);
        transform: translateY(-1px);
      }

      .pending-state {
        @apply flex items-center gap-2 text-sm;
        color: var(--text-muted);
      }

      .empty-state {
        @apply text-center py-12;
      }

      .animate-slide-up {
        animation: slideUp 0.3s ease-out;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
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

  getInviteState(playerId: string) {
    const isPending = this.pendingInvites.some(
      (invite) => invite.to.id === playerId
    );
    if (isPending) {
      return { type: 'pending', timeLeft: 15 };
    }
    return { type: 'invite' };
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
