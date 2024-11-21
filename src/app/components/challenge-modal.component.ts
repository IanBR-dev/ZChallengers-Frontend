import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../models/types';

@Component({
  selector: 'app-challenge-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div class="max-w-lg w-full mx-4 relative">
        <!-- Animación de partículas doradas -->
        <div class="absolute inset-0 overflow-hidden">
          <div
            *ngFor="let i of [1, 2, 3, 4, 5]"
            class="particle absolute w-2 h-2 bg-gold rounded-full"
            [style.animation-delay]="i * 0.2 + 's'"
          ></div>
        </div>

        <!-- Contenido principal -->
        <div
          class="bg-black/80 border border-gold/30 rounded-lg p-6 text-center animate-scale-in"
        >
          <div class="relative">
            <!-- Círculo animado -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="w-32 h-32 rounded-full border-4 border-gold/30 animate-pulse"
              ></div>
              <div
                class="absolute w-36 h-36 rounded-full border-2 border-gold/20 animate-spin-slow"
              ></div>
            </div>

            <!-- Icono central -->
            <div class="relative z-10 mb-6 transform animate-bounce-in">
              <span class="material-symbols-outlined text-6xl text-gold mb-4"
                >swords</span
              >
              <h2 class="text-2xl font-bold gold-gradient mb-2">
                Challenge Team
              </h2>
              <p class="text-gray-400">Ready for an epic battle?</p>
            </div>
          </div>

          <!-- Team Info -->
          <div class="mt-8 space-y-4 animate-slide-up">
            <h3 class="text-xl gold-gradient">{{ team.name }}</h3>
            <div class="grid gap-2">
              <div
                *ngFor="let player of team.players"
                class="bg-black/30 p-3 rounded-lg border border-gold/10 flex items-center gap-3"
              >
                <img
                  [src]="player.avatar"
                  [alt]="player.username"
                  class="w-8 h-8 rounded-full object-cover"
                />
                <div class="flex-1 text-left">
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ player.username }}</span>
                    <span
                      *ngIf="player.id === team.captain?.id"
                      class="text-gold text-xs"
                      >Captain</span
                    >
                  </div>
                  <span class="text-xs text-gray-400">{{ player.rank }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Botones -->
          <div
            class="mt-8 flex gap-4 animate-fade-in"
            [style.animation-delay]="'1s'"
          >
            <button
              (click)="cancel.emit()"
              class="flex-1 px-6 py-2 border border-gold/30 rounded-lg text-gold hover:bg-gold/10 
                           transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              (click)="confirm.emit(team)"
              class="flex-1 gold-button px-6 py-2 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Challenge
            </button>
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
        border-radius: 0.5rem;
      }

      /* Animaciones */
      @keyframes scale-in {
        0% {
          transform: scale(0.8);
          opacity: 0;
        }
        100% {
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

      @keyframes slide-up {
        0% {
          transform: translateY(20px);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes fade-in {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
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

      .animate-scale-in {
        animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .animate-bounce-in {
        animation: bounce-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .animate-slide-up {
        animation: slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        animation-delay: 0.3s;
        opacity: 0;
        animation-fill-mode: forwards;
      }

      .animate-fade-in {
        animation: fade-in 0.5s ease-out;
        animation-fill-mode: forwards;
        opacity: 0;
      }

      .animate-spin-slow {
        animation: spin 8s linear infinite;
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
    `,
  ],
})
export class ChallengeModalComponent {
  @Input() team!: Team;
  @Output() confirm = new EventEmitter<Team>();
  @Output() cancel = new EventEmitter<void>();
}
