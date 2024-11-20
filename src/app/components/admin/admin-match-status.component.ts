import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../../models/types';

@Component({
  selector: 'app-admin-match-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pt-24 px-4 pb-4">
      <div class="max-w-5xl mx-auto">
        <div class="gold-border rounded-lg p-6 bg-black/50 mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl gold-gradient">ADMIN - MATCH #{{ matchId }}</h2>
            <div class="text-2xl text-gold font-bold">{{ matchTime }}</div>
          </div>

          <div class="grid grid-cols-2 gap-8">
            <!-- Team 1 -->
            <div
              class="gold-border rounded-lg p-4 bg-black/50 cursor-pointer transition-all duration-300 hover:bg-black/70"
              [class.ring-2]="selectedWinner?.id === team1.id"
              [class.ring-gold]="selectedWinner?.id === team1.id"
              (click)="selectWinner(team1)"
            >
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
            <div
              class="gold-border rounded-lg p-4 bg-black/50 cursor-pointer transition-all duration-300 hover:bg-black/70"
              [class.ring-2]="selectedWinner?.id === team2.id"
              [class.ring-gold]="selectedWinner?.id === team2.id"
              (click)="selectWinner(team2)"
            >
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

          <div class="flex flex-col items-center gap-4 mt-6">
            <div class="text-center text-gray-400">
              {{
                selectedWinner
                  ? 'Selected Winner: ' + selectedWinner.name
                  : 'Select a winning team'
              }}
            </div>

            <button
              *ngIf="selectedWinner"
              (click)="confirmWinner()"
              class="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-bold transition-colors duration-300"
            >
              Confirm Winner
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminMatchStatusComponent {
  @Input() matchId!: string;
  @Input() team1!: Team;
  @Input() team2!: Team;
  @Output() declareWinner = new EventEmitter<{
    matchId: string;
    winnerId: string;
  }>();

  matchTime = '00:00';
  selectedWinner: Team | null = null;
  private matchInterval: any;
  private matchStartTime: number = 0;

  ngOnInit() {
    this.startMatchTimer();
  }

  ngOnDestroy() {
    this.clearInterval();
  }

  selectWinner(team: Team) {
    this.selectedWinner = team;
  }

  confirmWinner() {
    if (this.selectedWinner) {
      this.declareWinner.emit({
        matchId: this.matchId,
        winnerId: this.selectedWinner.id,
      });
    }
  }

  private startMatchTimer() {
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
