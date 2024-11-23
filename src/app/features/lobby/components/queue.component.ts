import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';
import { Team } from '../../../models/types';
import { QueueService } from '../../../services/queue.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="queue-container mt-4">
      <!-- Queue Timer -->
      <div *ngIf="inQueue" class="queue-timer">
        <div class="timer-ring">
          <svg>
            <circle cx="40" cy="40" r="35"></circle>
            <circle cx="40" cy="40" r="35"></circle>
          </svg>
          <div class="timer-content">
            <span class="timer-number">{{ queueTime }}</span>
            <span class="timer-label">in queue</span>
          </div>
        </div>
      </div>

      <!-- Queue Status -->
      <div *ngIf="inQueue" class="queue-status">
        <div class="status-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <p style="color: var(--text-secondary)">
          {{ statusMessage }}
        </p>
      </div>

      <!-- Queue Button -->
      <button
        (click)="toggleQueue()"
        [disabled]="isLoading || teamFound"
        class="queue-button"
        [class.in-queue]="inQueue"
      >
        <div class="button-content" [class.loading]="isLoading">
          <span class="button-text">
            {{ getButtonText() }}
          </span>
          <div class="spinner-container" *ngIf="isLoading">
            <app-loading-spinner></app-loading-spinner>
          </div>
        </div>
        <div class="button-background"></div>
      </button>

      <!-- Players Found Indicator -->
      <div *ngIf="inQueue" class="players-found">
        <div class="player-slots">
          <div
            class="player-slot"
            [class.filled]="playersFound === 1"
            [class.success]="teamFound"
          >
            <span class="material-symbols-outlined text-xs">
              {{ playersFound === 1 ? 'person' : 'people' }}
            </span>
          </div>
        </div>
        <p style="color: var(--text-secondary)">
          {{ playersFound }}/1 players found
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .queue-container {
        @apply flex flex-col items-center gap-6;
      }

      /* Timer Styles */
      .queue-timer {
        @apply relative;
      }

      .timer-ring {
        @apply relative w-20 h-20;
      }

      .timer-ring svg {
        @apply w-full h-full -rotate-90;
      }

      .timer-ring circle {
        @apply w-full h-full fill-none stroke-2;
        cx: 40;
        cy: 40;
        r: 35;
        stroke-linecap: round;
      }

      .timer-ring circle:nth-child(1) {
        stroke: var(--border-light);
      }

      .timer-ring circle:nth-child(2) {
        stroke: var(--primary);
        stroke-dasharray: 220;
        stroke-dashoffset: 220;
        animation: timer 60s linear infinite;
      }

      .timer-content {
        @apply absolute inset-0 flex flex-col items-center justify-center;
      }

      .timer-number {
        @apply text-lg font-bold;
        color: var(--primary);
      }

      .timer-label {
        @apply text-xs;
        color: var(--text-secondary);
      }

      /* Status Dots */
      .queue-status {
        @apply flex flex-col items-center gap-2;
      }

      .status-dots {
        @apply flex gap-2;
      }

      .dot {
        @apply w-2 h-2 rounded-full;
        background: var(--primary);
        animation: dot-pulse 1.4s infinite;
      }

      .dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      .dot:nth-child(3) {
        animation-delay: 0.4s;
      }

      /* Queue Button */
      .queue-button {
        @apply w-full py-4 text-xl font-bold rounded-lg relative overflow-hidden;
        background: var(--primary);
        color: var(--text-primary);
        transition: all 0.3s ease;
      }

      .queue-button:hover:not(:disabled) {
        filter: brightness(1.1);
        transform: translateY(-2px);
      }

      .queue-button:active:not(:disabled) {
        transform: translateY(0);
      }

      .queue-button:disabled {
        @apply opacity-50 cursor-not-allowed;
      }

      .queue-button.in-queue {
        background: var(--error);
      }

      /* Button Content */
      .button-content {
        @apply relative z-10 flex items-center justify-center;
        transition: transform 0.3s ease;
      }

      .button-content.loading {
        transform: translateY(-100%);
      }

      .spinner-container {
        @apply absolute inset-0 flex items-center justify-center;
        transform: translateY(100%);
      }

      /* Players Found */
      .player-slots {
        @apply flex justify-center gap-3 mb-2;
      }

      .player-slot {
        @apply w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300;
        background: var(--bg-dark);
        border: 1px solid var(--border-light);
        color: var(--text-muted);
      }

      .player-slot.filled {
        background: var(--primary-light);
        border-color: var(--primary);
        color: var(--primary);
        animation: slot-filled 0.5s ease-out;
      }

      .player-slot.success {
        background: var(--success);
        border-color: var(--success);
        color: var(--text-primary);
        animation: success-pulse 1s infinite;
      }

      /* Animations */
      @keyframes timer {
        to {
          stroke-dashoffset: 0;
        }
      }

      @keyframes dot-pulse {
        0%,
        100% {
          transform: scale(0.8);
          opacity: 0.5;
        }
        50% {
          transform: scale(1.2);
          opacity: 1;
        }
      }

      @keyframes slot-filled {
        0% {
          transform: scale(0.8);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes success-pulse {
        0%,
        100% {
          transform: scale(1);
          filter: brightness(1);
        }
        50% {
          transform: scale(1.05);
          filter: brightness(1.2);
        }
      }
    `,
  ],
})
export class QueueComponent implements OnInit, OnDestroy {
  @Output() teamFounded = new EventEmitter<Team>();

  isLoading = false;
  inQueue = false;
  teamFound = false;
  playersFound = 0;
  queueTime = '00:00';
  private queueTimer: any;
  private foundTeam: Team | null = null;

  private subscriptions = {
    teamFound: new Subscription(),
  };

  get statusMessage(): string {
    if (this.teamFound) return 'Team found! Preparing match...';
    return 'Searching for team members...';
  }

  getButtonText(): string {
    if (this.teamFound) return 'Team Found!';
    return this.inQueue ? 'Leave Queue' : 'Find Team';
  }

  constructor(private gameService: QueueService) {}

  ngOnInit(): void {
    this.unsubscribe('teamFound');
    this.subscriptions.teamFound = this.gameService
      .teamFound()
      .subscribe((team) => {
        if (team) {
          this.foundTeam = team;
          this.handleTeamFound();
        }
      });
  }

  private handleTeamFound() {
    this.playersFound = 1;
    this.teamFound = true;

    // Esperar 2 segundos antes de emitir el equipo encontrado
    setTimeout(() => {
      if (this.foundTeam) {
        this.teamFounded.emit(this.foundTeam);
        this.resetQueue();
      }
    }, 2000);
  }

  toggleQueue() {
    if (this.inQueue) {
      this.leaveQueue();
    } else {
      this.joinQueue();
    }
  }

  private joinQueue() {
    this.isLoading = true;
    this.gameService.joinQueue().subscribe({
      next: (inQueue) => {
        this.inQueue = inQueue;
        if (inQueue) {
          this.startQueueTimer();
        }
      },
      error: (err) => {
        console.error('Error joining queue:', err);
        this.resetQueue();
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private leaveQueue() {
    this.isLoading = true;
    this.gameService.leaveQueue().subscribe({
      next: () => {
        this.resetQueue();
      },
      error: (err) => {
        console.error('Error leaving queue:', err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private startQueueTimer() {
    let seconds = 0;
    this.queueTimer = setInterval(() => {
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      this.queueTime = `${minutes
        .toString()
        .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  private resetQueue() {
    this.inQueue = false;
    this.teamFound = false;
    this.playersFound = 0;
    this.queueTime = '00:00';
    this.foundTeam = null;
    if (this.queueTimer) clearInterval(this.queueTimer);
  }

  ngOnDestroy(): void {
    this.resetQueue();
    this.unsubscribeAll();
  }

  private unsubscribeAll() {
    Object.values(this.subscriptions).forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }

  private unsubscribe(key: keyof typeof this.subscriptions) {
    if (this.subscriptions[key]) {
      this.subscriptions[key].unsubscribe();
      this.subscriptions[key] = new Subscription();
    }
  }
}
