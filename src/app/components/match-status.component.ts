import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../models/types';

@Component({
  selector: 'app-match-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pt-24 px-4 pb-4">
      <div class="max-w-5xl mx-auto">
        <div class="gold-border rounded-lg p-6 bg-black/50 mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl gold-gradient">MATCH IN PROGRESS</h2>
            <div class="text-2xl text-gold font-bold">{{ matchTime }}</div>
          </div>

          <div class="grid grid-cols-2 gap-8">
            <!-- Team 1 -->
            <div class="gold-border rounded-lg p-4 bg-black/50">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl gold-gradient">{{ team1.name }}</h3>
              </div>
              <div class="space-y-2">
                <div
                  *ngFor="let player of team1.players"
                  class="flex items-center gap-2"
                >
                  <img [src]="player.avatar" class="w-6 h-6 rounded-full" />
                  <span class="text-white">{{ player.username }}</span>
                  <span class="text-sm text-gray-400">{{ player.rank }}</span>
                  <span
                    *ngIf="player.id === team1.captain.id"
                    class="text-gold text-sm"
                    >(Captain)</span
                  >
                </div>
              </div>
            </div>

            <!-- Team 2 -->
            <div class="gold-border rounded-lg p-4 bg-black/50">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl gold-gradient">{{ team2.name }}</h3>
              </div>
              <div class="space-y-2">
                <div
                  *ngFor="let player of team2.players"
                  class="flex items-center gap-2"
                >
                  <img [src]="player.avatar" class="w-6 h-6 rounded-full" />
                  <span class="text-white">{{ player.username }}</span>
                  <span class="text-sm text-gray-400">{{ player.rank }}</span>
                  <span
                    *ngIf="player.id === team2.captain.id"
                    class="text-gold text-sm"
                    >(Captain)</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="text-center text-gray-400 animate-pulse mt-6">
            Match in progress...
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .gold-gradient {
        background: linear-gradient(to right, #ffd700, #ffa500);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .gold-border {
        border: 1px solid rgba(255, 215, 0, 0.3);
      }

      :host {
        display: block;
        width: 100%;
      }

      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `,
  ],
})
export class MatchStatusComponent {
  @Input() team1!: Team;
  @Input() team2!: Team;
  @Output() matchComplete = new EventEmitter<Team>();

  matchTime = '00:00';
  private matchInterval: any;
  private matchStartTime: number = 0;

  ngOnInit() {
    this.startMatch();
  }

  ngOnDestroy() {
    this.clearInterval();
  }

  private startMatch() {
    this.matchStartTime = Date.now();
    this.matchInterval = setInterval(() => this.updateMatchTime(), 1000);
  }

  private updateMatchTime() {
    const elapsed = Math.floor((Date.now() - this.matchStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    this.matchTime = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  private clearInterval() {
    if (this.matchInterval) {
      clearInterval(this.matchInterval);
    }
  }
}
