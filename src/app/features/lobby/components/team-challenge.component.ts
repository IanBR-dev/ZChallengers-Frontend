import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../../../models/types';

@Component({
  selector: 'app-team-challenge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[70] flex items-center justify-center">
      <!-- Backdrop with blur -->
      <div class="absolute inset-0" style="background: var(--bg-overlay)"></div>

      <!-- Modal Container -->
      <div class="max-w-lg w-full mx-4 relative">
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
              <i
                class="fas fa-swords text-6xl mb-4"
                style="color: var(--primary)"
              ></i>
              <h2 class="text-2xl font-bold mb-2" style="color: var(--primary)">
                {{ isChallenger ? 'BATTLE INITIATED!' : 'PREPARE FOR BATTLE!' }}
              </h2>
              <p style="color: var(--text-secondary)">
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
                class="player-card"
              >
                <div class="flex items-center gap-3">
                  <!-- Avatar -->
                  <div class="relative">
                    <img
                      [src]="player.avatar"
                      [alt]="player.username"
                      class="w-12 h-12 rounded-lg object-cover"
                    />
                    <div
                      *ngIf="player.id === displayTeam?.captain?.id"
                      class="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style="background: var(--primary)"
                      title="Team Captain"
                    >
                      <i class="fas fa-crown text-[10px] text-black"></i>
                    </div>
                  </div>

                  <!-- Player Info -->
                  <div class="flex-1 text-left">
                    <div class="font-medium" style="color: var(--text-primary)">
                      {{ player.username }}
                    </div>
                    <div class="rank-badge">{{ player.rank }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Battle Status -->
          <div class="mt-8 space-y-4">
            <div class="battle-timer">
              <svg class="timer-circle">
                <circle cx="30" cy="30" r="28"></circle>
                <circle
                  cx="30"
                  cy="30"
                  r="28"
                  [style.stroke-dashoffset]="timerOffset"
                ></circle>
              </svg>
              <span class="timer-number">{{ timeLeft }}</span>
            </div>
            <p style="color: var(--text-secondary)">
              {{ isChallenger ? 'Battle commencing...' : 'Prepare your team!' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
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

      .player-card {
        @apply p-4 rounded-lg transition-all duration-200;
        background: var(--bg-dark);
        border: 1px solid var(--border-light);
      }

      .rank-badge {
        @apply text-sm px-2 py-0.5 rounded-full inline-flex;
        background: var(--primary-light);
        color: var(--primary);
      }

      .battle-timer {
        @apply relative inline-flex items-center justify-center mb-4;
        width: 60px;
        height: 60px;
      }

      .timer-circle {
        @apply absolute;
        width: 60px;
        height: 60px;
        transform: rotate(-90deg);
      }

      .timer-circle circle {
        @apply stroke-2 fill-none;
        stroke: var(--primary);
        stroke-linecap: round;
        stroke-width: 3;
        stroke-dasharray: 176;
        transition: stroke-dashoffset 1s linear;
      }

      .timer-circle circle:first-child {
        stroke: var(--border-light);
      }

      .timer-number {
        @apply text-xl font-bold;
        color: var(--primary);
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

      @keyframes slide-up {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class TeamChallengeComponent implements OnInit {
  @Input() challengingTeam!: Team | null;
  @Input() challengedTeam!: Team | null;
  @Input() isChallenger: boolean = false;
  @Output() closeChallengeModal = new EventEmitter<void>();

  timeLeft = 10;
  timerOffset = 0;
  private readonly TIMER_MAX = 176; // SVG circle circumference

  get displayTeam(): Team | null {
    return this.isChallenger ? this.challengedTeam : this.challengingTeam;
  }

  ngOnInit() {
    this.startTimer();
    this.showNotification();
  }

  private startTimer() {
    const interval = setInterval(() => {
      this.timeLeft--;
      // Calculate timer circle offset
      this.timerOffset = this.TIMER_MAX * (1 - this.timeLeft / 10);

      if (this.timeLeft <= 0) {
        clearInterval(interval);
        this.closeChallengeModal.emit();
      }
    }, 1000);
  }

  private showNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = this.isChallenger
        ? 'Battle Initiated!'
        : 'Prepare for Battle!';
      const body = this.isChallenger
        ? `Your team challenges ${this.challengedTeam?.name} to combat!`
        : `${this.challengingTeam?.name} has initiated combat with your team!`;

      new Notification(title, {
        body,
        icon: '/assets/images/battle-icon.png',
        badge: '/assets/images/badge-icon.png',
        // vibrate: [200, 100, 200],
        requireInteraction: false,
        silent: false,
      });
    }
  }

  // Helper methods for team stats
  /*   getTeamStats(team: Team | null) {
    return {
      winRate: team?.stats?.winRate || 0,
      avgScore: team?.stats?.avgScore || 0,
      totalMatches: team?.stats?.totalMatches || 0,
    };
  } */

  // Animation helper methods
  getAnimationDelay(index: number): string {
    return `${index * 0.1}s`;
  }

  // Team comparison methods
  /*   compareTeams() {
    // const team1Stats = this.getTeamStats(this.challengingTeam);
    // const team2Stats = this.getTeamStats(this.challengedTeam);

    return {
      winRateDiff: team1Stats.winRate - team2Stats.winRate,
      avgScoreDiff: team1Stats.avgScore - team2Stats.avgScore,
      experienceDiff: team1Stats.totalMatches - team2Stats.totalMatches,
    };
  } */

  // VS Animation state
  getVSScale(): number {
    const timeProgress = (10 - this.timeLeft) / 10;
    return 1 + Math.sin(timeProgress * Math.PI) * 0.2;
  }

  // Team name display with ellipsis if too long
  formatTeamName(name: string | undefined): string {
    if (!name) return '';
    return name.length > 20 ? `${name.substring(0, 17)}...` : name;
  }

  // Player role badge color
  getRoleBadgeColor(role: string): string {
    const colors = {
      captain: 'var(--primary)',
      support: 'var(--success)',
      attacker: 'var(--error)',
      defender: 'var(--warning)',
    };
    return colors[role as keyof typeof colors] || 'var(--text-secondary)';
  }
}
