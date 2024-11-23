import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../../../models/types';

@Component({
  selector: 'app-challenge-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0" style="background: var(--bg-overlay)"></div>

      <!-- Modal Container -->
      <div class="max-w-lg w-full relative">
        <!-- Particle Effects -->
        <div class="absolute inset-0 overflow-hidden">
          <div
            *ngFor="let i of [1, 2, 3, 4, 5]"
            class="particle absolute w-2 h-2 rounded-full"
            [style.background]="'var(--primary)'"
            [style.animation-delay]="i * 0.2 + 's'"
          ></div>
        </div>

        <!-- Main Content -->
        <div class="glass rounded-lg p-8 text-center animate-scale-in">
          <!-- Animated Circles -->
          <div class="relative mb-8">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="circle-outer"></div>
              <div class="circle-inner"></div>
            </div>

            <!-- Icon and Title -->
            <div class="relative z-10 transform animate-bounce-in">
              <span
                class="material-symbols-outlined text-6xl mb-4"
                style="color: var(--primary)"
              >
                swords
              </span>
              <h2 class="text-2xl font-bold mb-2" style="color: var(--primary)">
                Challenge Team
              </h2>
              <p style="color: var(--text-secondary)">
                Ready for an epic battle?
              </p>
            </div>
          </div>

          <!-- Team Info -->
          <div class="mt-8 space-y-4 animate-slide-up">
            <h3 class="text-xl" style="color: var(--primary)">
              {{ team.name }}
            </h3>

            <!-- Team Players -->
            <div class="space-y-2">
              <div
                *ngFor="let player of team.players"
                class="player-card group"
              >
                <div class="flex items-center gap-3">
                  <!-- Avatar -->
                  <div class="relative">
                    <img
                      [src]="player.avatar"
                      [alt]="player.username"
                      class="w-10 h-10 rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div
                      *ngIf="player.id === team.captain?.id"
                      class="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                      style="background: var(--primary)"
                    >
                      <span
                        class="material-symbols-outlined text-[10px] text-black"
                      >
                        military_tech
                      </span>
                    </div>
                  </div>

                  <!-- Player Info -->
                  <div class="flex-1 text-left">
                    <div class="flex items-center gap-2">
                      <span style="color: var(--text-primary)">{{
                        player.username
                      }}</span>
                      <span
                        *ngIf="player.id === team.captain?.id"
                        class="captain-badge"
                      >
                        Captain
                      </span>
                    </div>
                    <span class="rank-badge">{{ player.rank }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div
            class="mt-8 flex gap-4 animate-fade-in"
            [style.animation-delay]="'1s'"
          >
            <button (click)="cancel.emit()" class="cancel-button">
              Cancel
            </button>
            <button (click)="confirm.emit(team)" class="confirm-button">
              Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .player-card {
        @apply p-4 rounded-lg transition-all duration-200;
        background: var(--bg-dark);
        border: 1px solid var(--border-light);
      }

      .player-card:hover {
        border-color: var(--primary);
        transform: translateY(-1px);
      }

      .captain-badge {
        @apply text-xs px-2 py-0.5 rounded-full;
        background: var(--primary-light);
        color: var(--primary);
      }

      .rank-badge {
        @apply text-xs;
        color: var(--text-secondary);
      }

      .circle-outer {
        @apply w-36 h-36 rounded-full absolute;
        border: 2px solid var(--primary);
        opacity: 0.3;
        animation: spin 8s linear infinite;
      }

      .circle-inner {
        @apply w-32 h-32 rounded-full absolute;
        border: 4px solid var(--primary);
        opacity: 0.2;
        animation: pulse 2s ease-in-out infinite;
      }

      .cancel-button {
        @apply flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200;
        background: var(--error-light);
        color: var(--error);
        border: 1px solid var(--error);
      }

      .cancel-button:hover {
        background: var(--error);
        color: var(--text-primary);
        transform: translateY(-1px);
      }

      .confirm-button {
        @apply flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200;
        background: var(--primary);
        color: var(--text-primary);
      }

      .confirm-button:hover {
        filter: brightness(1.1);
        transform: translateY(-1px);
      }

      .particle {
        --tx: 0px;
        --ty: 0px;
        animation: particle-float 2s ease-out infinite;
        opacity: 0;
      }

      .particle:nth-child(1) {
        --tx: 100px;
        --ty: -100px;
      }
      .particle:nth-child(2) {
        --tx: -80px;
        --ty: -120px;
      }
      .particle:nth-child(3) {
        --tx: 120px;
        --ty: 80px;
      }
      .particle:nth-child(4) {
        --tx: -100px;
        --ty: 90px;
      }
      .particle:nth-child(5) {
        --tx: 90px;
        --ty: 110px;
      }

      @keyframes particle-float {
        0% {
          transform: translate(0, 0) rotate(0deg);
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
        100% {
          transform: translate(var(--tx), var(--ty)) rotate(360deg);
          opacity: 0;
        }
      }

      @keyframes scale-in {
        from {
          transform: scale(0.8);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes bounce-in {
        0% {
          transform: scale(0.3);
          opacity: 0;
        }
        50% {
          transform: scale(1.1);
        }
        70% {
          transform: scale(0.9);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      .animate-scale-in {
        animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .animate-bounce-in {
        animation: bounce-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .animate-slide-up {
        animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        animation-delay: 0.3s;
        opacity: 0;
        animation-fill-mode: forwards;
      }

      .animate-fade-in {
        animation: fadeIn 0.5s ease-out;
        animation-fill-mode: forwards;
        opacity: 0;
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

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
  ],
})
export class ChallengeModalComponent {
  @Input() team!: Team;
  @Output() confirm = new EventEmitter<Team>();
  @Output() cancel = new EventEmitter<void>();
}
