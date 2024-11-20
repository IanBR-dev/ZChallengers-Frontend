import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Invitation, Player } from '../models/types';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Sidebar Toggle Bar -->
    <div
      (click)="toggle.emit()"
      class="fixed right-[320px] top-[72px] h-[calc(100vh-72px)] w-6 bg-gold/20 hover:bg-gold/30 cursor-pointer transition-all duration-300 flex items-center justify-center"
      [style.right]="isExpanded ? '320px' : '80px'"
    >
      <div class="flex items-center justify-center w-full">
        <span
          class="material-symbols-outlined transform transition-transform duration-300"
          [class.rotate-180]="isExpanded"
        >
          chevron_left
        </span>
      </div>
    </div>

    <!-- Overlay for click-outside -->
    <div
      *ngIf="isExpanded"
      class="fixed inset-0 top-[72px] bg-black/50 transition-opacity duration-300"
      (click)="onOverlayClick($event)"
    ></div>

    <aside
      [class]="'sidebar ' + (isExpanded ? 'expanded' : 'collapsed')"
      (click)="$event.stopPropagation()"
    >
      <div class="pt-[72px] h-full">
        <div class="p-4 h-full flex flex-col">
          <ng-container *ngIf="!isExpanded">
            <div class="flex flex-col items-center">
              <button
                class="gold-button w-10 h-10 p-0 flex items-center justify-center relative"
                [class.animate-bounce]="invitations.length > 0"
                (click)="toggle.emit()"
              >
                <span class="material-symbols-outlined">mail</span>
                <div
                  *ngIf="invitations.length > 0"
                  class="absolute -top-1 -right-1 bg-accent rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse"
                >
                  {{ invitations.length }}
                </div>
              </button>
            </div>
          </ng-container>

          <ng-container *ngIf="isExpanded">
            <!-- Invitations Section -->
            <div
              class="mb-4 flex flex-col min-h-0"
              [class.animate-fadeIn]="isExpanded"
            >
              <h3
                class="text-xl gold-gradient font-bold mb-4 flex items-center gap-2 shrink-0"
              >
                <span class="material-symbols-outlined">mail</span>
                Invitations
                <span
                  *ngIf="invitations.length > 0"
                  class="bg-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
                >
                  {{ invitations.length }}
                </span>
              </h3>
              <div
                class="space-y-4 overflow-y-auto custom-scrollbar max-h-[30vh] pr-2"
              >
                <div
                  *ngFor="let invitation of invitations"
                  class="player-card animate-slideIn"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <img
                      [src]="invitation.from.avatar"
                      class="w-8 h-8 rounded-full"
                    />
                    <span class="font-semibold">{{
                      invitation.from.username
                    }}</span>
                  </div>
                  <div class="flex gap-2">
                    <button
                      class="gold-button text-sm flex-1"
                      (click)="acceptInvitation.emit(invitation.id)"
                    >
                      Accept
                    </button>
                    <button
                      class="gold-button text-sm flex-1"
                      (click)="declineInvitation.emit(invitation.id)"
                    >
                      Decline
                    </button>
                  </div>
                </div>
                <div
                  *ngIf="invitations.length === 0"
                  class="text-gray-400 text-center"
                >
                  No pending invitations
                </div>
              </div>
            </div>

            <!-- Available Players Section -->
            <div
              class="flex-1 flex flex-col min-h-0"
              [class.animate-fadeIn]="isExpanded"
            >
              <h3
                class="text-xl gold-gradient font-bold mb-4 flex items-center gap-2 shrink-0"
              >
                <span class="material-symbols-outlined">group</span>
                Available Players
              </h3>

              <!-- Search Bar -->
              <div class="relative mb-4 shrink-0">
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  placeholder="Search players..."
                  class="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-gold focus:outline-none"
                />
                <span
                  class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  search
                </span>
              </div>

              <div
                class="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2"
              >
                <div
                  *ngFor="let player of filteredPlayers"
                  class="player-card animate-slideIn"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <img [src]="player.avatar" class="w-8 h-8 rounded-full" />
                      <div>
                        <div class="font-semibold">{{ player.username }}</div>
                        <div class="text-sm text-gray-400">
                          {{ player.rank }}
                        </div>
                      </div>
                    </div>
                    <button
                      class="gold-button text-sm"
                      (click)="invitePlayer.emit(player.id)"
                    >
                      Invite
                    </button>
                  </div>
                </div>
                <div
                  *ngIf="filteredPlayers.length === 0"
                  class="text-gray-400 text-center"
                >
                  No players found
                </div>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  @Input() isExpanded = false;
  @Input() invitations: Invitation[]  = [];
  @Input() availablePlayers: Player[] = [];

  @Output() toggle = new EventEmitter<void>();
  @Output() acceptInvitation = new EventEmitter<string>();
  @Output() declineInvitation = new EventEmitter<string>();
  @Output() invitePlayer = new EventEmitter<string>();

  searchQuery = '';

  onOverlayClick(event: MouseEvent) {
    if (this.isExpanded) {
      this.toggle.emit();
    }
  }

  get filteredPlayers(): Player[] {
    if (!this.searchQuery.trim()) {
      return this.availablePlayers;
    }

    const query = this.searchQuery.toLowerCase();
    return this.availablePlayers.filter(
      (player) =>
        player.username.toLowerCase().includes(query) ||
        player.rank?.toLowerCase().includes(query)
    );
  }
}
