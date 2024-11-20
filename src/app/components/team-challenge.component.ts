import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../models/types';

@Component({
  selector: 'app-team-challenge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 bg-black/95 flex items-center justify-center z-50 animate-fadeIn"
    >
      <div class="max-w-2xl w-full mx-4 text-center">
        <div class="text-6xl gold-gradient font-bold mb-8">
          {{ isChallenger ? 'CHALLENGING TEAM!' : 'TEAM CHALLENGE!' }}
        </div>

        <div class="mb-8">
          <div class="text-2xl mb-6">
            {{
              isChallenger
                ? 'You are challenging:'
                : challengingTeam?.name + ' has challenged you!'
            }}
          </div>

          <div class="grid grid-cols-2 gap-8">
            <div
              *ngFor="let player of displayTeam?.players"
              class="player-card"
            >
              <div class="relative">
                <img
                  [src]="player.avatar"
                  class="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <div
                  *ngIf="player.id === displayTeam?.captain?.id"
                  class="absolute -top-2 -right-2 bg-gold/20 rounded-full p-2"
                  title="Team Captain"
                >
                  <span class="material-symbols-outlined text-gold">
                    military_tech
                  </span>
                </div>
              </div>
              <div class="text-xl font-bold">{{ player.username }}</div>
              <div class="text-gold">{{ player.rank }}</div>
              <div
                *ngIf="player.id === displayTeam?.captain?.id"
                class="text-sm text-gray-400 mt-1"
              >
                Team Captain
              </div>
            </div>
          </div>
        </div>

        <div class="text-xl text-gray-400 mb-8">
          {{
            isChallenger
              ? 'Waiting for response...'
              : 'Do you accept the challenge?'
          }}
        </div>

        <!--         <div *ngIf="!isChallenger" class="flex justify-center gap-4">
          <button
            (click)="onAccept()"
            class="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-bold"
          >
            Accept Challenge
          </button>
          <button
            (click)="onDecline()"
            class="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-bold"
          >
            Decline
          </button>
        </div> -->

        <div *ngIf="isChallenger" class="countdown text-2xl text-gray-400">
          Challenge request sent...
        </div>
      </div>
    </div>
  `,
})
export class TeamChallengeComponent {
  @Input() challengingTeam!: Team | null;
  @Input() challengedTeam!: Team | null;
  @Input() isChallenger: boolean = false;
  @Output() closeChallengeModal = new EventEmitter<void>();

  get displayTeam(): Team | null {
    return this.isChallenger ? this.challengedTeam : this.challengingTeam;
  }

  ngOnInit() {
    this.showNotification();
    setTimeout(() => {
      this.closeChallengeModal.emit();
    }, 10000);
  }

  private showNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(
        this.isChallenger ? 'Challenge Sent!' : 'Team Challenge!',
        {
          body: this.isChallenger
            ? `You have challenged ${this.challengedTeam?.name}!`
            : `${this.challengingTeam?.name} has challenged your team!`,
          icon: '/favicon.ico',
          requireInteraction: true,
        }
      );
    }
  }
}
