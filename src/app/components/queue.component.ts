import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueService } from '../services/queue.service';
import { Team } from '../models/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gold-border rounded-lg p-6 bg-black/50">
      <div class="text-center mb-6">
        <h2 class="text-2xl gold-gradient mb-2">Find Teammate</h2>
        <p class="text-gray-400">
          Join the queue to find a teammate and form a team
        </p>
      </div>

      <ng-container *ngIf="!inQueue">
        <button class="queue-button w-full" (click)="startQueue()">
          Start Queue
        </button>
      </ng-container>

      <ng-container *ngIf="inQueue">
        <div class="queue-timer mb-4">
          {{ queueTime }}
        </div>
        <div class="flex justify-center items-center gap-4 mb-6">
          <div class="animate-pulse">
            <span class="material-symbols-outlined text-4xl text-gold">
              person_search
            </span>
          </div>
          <div class="text-lg">Searching for teammate...</div>
        </div>
        <button
          class="queue-button w-full bg-red-500 hover:bg-red-600"
          (click)="cancelQueue()"
        >
          Cancel Queue
        </button>
      </ng-container>
    </div>
  `,
})
export class QueueComponent implements OnInit {
  inQueue = false;
  queueTime = '00:00';
  private queueStartTime: number = 0;
  private timerInterval: any;
  @Output() teamFounded = new EventEmitter<Team>();
  private teamFoundSubscription: Subscription[] = [];

  constructor(private queueService: QueueService) {}

  ngOnInit(): void {
    this.teamFoundSubscription.push(
      this.queueService.teamFound().subscribe((team) => {
        if (team) {
          this.teamFounded.emit(team);
        }
      })
    );
  }

  startQueue() {
    this.inQueue = true;
    this.queueStartTime = Date.now();
    this.updateTimer();
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    this.queueService.joinQueue().subscribe((success) => {
      if (success) {
      } else {
      }
    });
  }

  cancelQueue() {
    this.inQueue = false;
    clearInterval(this.timerInterval);
    this.queueService.leaveQueue().subscribe((success) => {
      if (success) {
        this.inQueue = false;
        clearInterval(this.timerInterval);
      } else {
      }
    });
  }

  private updateTimer() {
    const elapsed = Math.floor((Date.now() - this.queueStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    this.queueTime = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.teamFoundSubscription.forEach((sub) => sub.unsubscribe());
  }
}
