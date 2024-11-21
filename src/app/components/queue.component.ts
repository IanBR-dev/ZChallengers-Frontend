import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner.component';
import { Team } from '../models/types';
import { QueueService } from '../services/queue.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="flex flex-col items-center gap-4 mt-4">
      <button
        (click)="toggleQueue()"
        [disabled]="isLoading"
        class="gold-button relative px-8 py-3 text-lg w-full md:w-auto
               transform transition-all duration-200 
               hover:scale-[1.02] active:scale-[0.98]
               disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span [class.opacity-0]="isLoading">
          {{ inQueue ? 'Leave Queue' : 'Find Team' }}
        </span>
        <app-loading-spinner *ngIf="isLoading"></app-loading-spinner>
      </button>

      <p *ngIf="inQueue" class="text-gray-400 text-sm animate-pulse">
        Searching for team members...
      </p>
    </div>
  `,
  styles: [
    `
      .gold-button {
        background: linear-gradient(to right, #ffd700, #b8860b);
        color: black;
        font-weight: 500;
        border-radius: 0.5rem;
      }
    `,
  ],
})
export class QueueComponent implements OnInit, OnDestroy {
  @Output() teamFounded = new EventEmitter<Team>();

  isLoading = false;
  inQueue = false;

  private subscriptions = {
    teamFound: new Subscription(),
  };

  constructor(private gameService: QueueService) {}

  toggleQueue() {
    if (this.inQueue) {
      this.leaveQueue();
    } else {
      this.joinQueue();
    }
  }

  ngOnInit(): void {
    this.unsubscribe('teamFound');
    this.subscriptions.teamFound = this.gameService
      .teamFound()
      .subscribe((team) => {
        if (team) {
          this.teamFounded.emit(team);
          this.inQueue = false;
        }
      });
  }

  private joinQueue() {
    this.isLoading = true;
    this.gameService.joinQueue().subscribe({
      next: (inQueue) => {
        this.inQueue = inQueue;
      },
      error: (err) => {
        console.error('Error joining queue:', err);
        this.inQueue = false;
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
        this.inQueue = false;
      },
      error: (err) => {
        console.error('Error leaving queue:', err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
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
