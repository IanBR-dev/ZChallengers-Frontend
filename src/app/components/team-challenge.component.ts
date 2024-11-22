import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../models/types';

@Component({
  selector: 'app-team-challenge',
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
                {{ isChallenger ? 'BATTLE INITIATED!' : 'PREPARE FOR BATTLE!' }}
              </h2>
              <p class="text-gray-400">
                {{
                  isChallenger
                    ? 'Your team challenges:'
                    : challengingTeam?.name + ' has initiated combat!'
                }}
              </p>
            </div>
          </div>

          <!-- Team Info -->
          <div class="mt-8 space-y-4 animate-slide-up">
            <div class="grid grid-cols-2 gap-4">
              <div
                *ngFor="let player of displayTeam?.players"
                class="bg-black/30 p-3 rounded-lg border border-gold/10"
              >
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <img
                      [src]="player.avatar"
                      [alt]="player.username"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                    <div
                      *ngIf="player.id === displayTeam?.captain?.id"
                      class="absolute -top-1 -right-1 bg-gold/20 rounded-full p-1.5"
                      title="Team Captain"
                    >
                      <span class="material-symbols-outlined text-gold text-sm">
                        military_tech
                      </span>
                    </div>
                  </div>
                  <div class="flex-1 text-left">
                    <div class="font-medium truncate">
                      {{ player.username }}
                    </div>
                    <div class="text-sm text-gold">{{ player.rank }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Estado -->
          <div class="mt-8 space-y-4">
            <p class="text-xl text-gold animate-pulse">
              {{ isChallenger ? 'Battle commencing...' : 'Prepare your team!' }}
            </p>
            <div class="text-2xl text-gray-400 animate-fade-in">
              {{
                isChallenger
                  ? 'The battle will begin shortly...'
                  : 'Combat imminent!'
              }}
            </div>
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
export class TeamChallengeComponent implements OnInit {
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
 /*    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(
        this.isChallenger ? 'Battle Initiated!' : 'Prepare for Battle!',
        {
          body: this.isChallenger
            ? `Your team challenges ${this.challengedTeam?.name} to combat!`
            : `${this.challengingTeam?.name} has initiated combat with your team!`,
          icon: '/favicon.ico',
          requireInteraction: true,
        }
      );
    } */
  }
}
