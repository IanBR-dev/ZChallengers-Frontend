import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../services/game.service';
import { QueueService } from '../services/queue.service';
import { Player, Team, QueueMatch, Invitation, Vote } from '../models/types';
import { SidebarComponent } from './sidebar.component';
import { ChallengeModalComponent } from './challenge-modal.component';
import { QueueComponent } from './queue.component';
import { MatchFoundComponent } from './match-found.component';
import { Subscription } from 'rxjs';
import { TeamFoundComponent } from './team-found.component';
import { VoteModalComponent } from './vote-modal.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    ChallengeModalComponent,
    QueueComponent,
    MatchFoundComponent,
    TeamFoundComponent,
    VoteModalComponent,
  ],
  template: `
    <div class="min-h-screen bg-black">
      <!-- Team Found Modal (for queue matches) -->
      <app-team-found
        *ngIf="queueMatch"
        [match]="queueMatch"
        (accept)="acceptQueueMatch()"
        (decline)="declineQueueMatch()"
      >
      </app-team-found>

      <!-- Match Found Modal (for team challenges) -->
      <app-match-found
        *ngIf="challengingTeam"
        [challengingTeam]="challengingTeam"
        (matchComplete)="onMatchComplete($event)"
      >
      </app-match-found>

      <app-vote-modal
        *ngIf="showVoting"
        [opposingTeam]="lastOpposingTeam!"
        [currentTeam]="currentTeam!"
        [votes]="currentVotes"
        (voteSubmitted)="onVoteSubmitted($event)"
        (continue)="onVotingComplete()"
      >
      </app-vote-modal>
      <!-- Header -->
      <header
        class="fixed top-0 left-0 right-0 bg-black/95 z-50 px-8 py-4 border-b border-gold/20"
      >
        <div class="flex justify-between items-center">
          <h1 class="text-4xl gold-gradient font-bold">Game Lobby</h1>
          <div class="relative">
            <span
              class="material-symbols-outlined text-3xl settings-icon"
              [class.active]="settingsOpen"
              (click)="toggleSettings()"
            >
              settings
            </span>

            <div *ngIf="settingsOpen" class="settings-dropdown">
              <button
                class="w-full px-4 py-3 text-left hover:bg-gold/10 transition-colors"
                (click)="openProfile()"
              >
                Profile
              </button>
              <button
                class="w-full px-4 py-3 text-left hover:bg-gold/10 transition-colors"
                (click)="logout()"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="pt-24 px-4 pb-4">
        <div class="max-w-5xl mx-auto">
          <!-- Current Team Info -->
          <div class="gold-border rounded-lg p-6 bg-black/50 mb-8">
            <h2 class="text-2xl gold-gradient mb-4">
              {{ currentTeam ? 'Your Team' : 'Solo Player' }}
            </h2>

            <ng-container *ngIf="currentTeam">
              <div class="mb-4">
                <h3 class="text-xl mb-2">{{ currentTeam.name }}</h3>
                <div
                  *ngFor="let player of currentTeam.players"
                  class="player-card mb-2"
                >
                  <div class="flex items-center gap-2">
                    <img [src]="player.avatar" class="w-8 h-8 rounded-full" />
                    <span>{{ player.username }}</span>
                    <span class="text-sm text-gray-400">{{ player.rank }}</span>
                    <span
                      *ngIf="player.id === currentTeam.captain.id"
                      class="text-gold text-sm"
                      >(Captain)</span
                    >
                  </div>
                </div>
              </div>
              <button class="gold-button" (click)="leaveTeam()">
                Leave Team
              </button>
            </ng-container>

            <ng-container *ngIf="!currentTeam">
              <div class="player-card mb-6">
                <div class="flex items-center gap-2">
                  <img
                    [src]="currentPlayer.avatar"
                    class="w-8 h-8 rounded-full"
                  />
                  <span>{{ currentPlayer.username }}</span>
                  <span class="text-sm text-gray-400">{{
                    currentPlayer.rank
                  }}</span>
                </div>
              </div>
              <app-queue></app-queue>
            </ng-container>
          </div>

          <!-- Available Teams -->
          <div *ngIf="currentTeam && isTeamCaptain" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl gold-gradient">Available Teams</h2>
              <div class="relative">
                <input
                  type="text"
                  [(ngModel)]="teamSearchQuery"
                  placeholder="Search teams or players..."
                  class="bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-gold focus:outline-none"
                />
                <span
                  class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  search
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div
                *ngFor="let team of filteredTeams"
                class="gold-border rounded-lg p-4 bg-black/50"
              >
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-xl gold-gradient">{{ team.name }}</h3>
                  <button
                    class="gold-button text-sm"
                    (click)="openChallengeModal(team)"
                  >
                    Challenge
                  </button>
                </div>
                <div class="space-y-2">
                  <div
                    *ngFor="let player of team.players"
                    class="flex items-center gap-2"
                  >
                    <img [src]="player.avatar" class="w-6 h-6 rounded-full" />
                    <span>{{ player.username }}</span>
                    <span class="text-sm text-gray-400">{{ player.rank }}</span>
                    <span
                      *ngIf="player.id === team.captain.id"
                      class="text-gold text-sm"
                      >(Captain)</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <app-sidebar
        [isExpanded]="sidebarExpanded"
        [invitations]="invitations"
        [availablePlayers]="availablePlayers"
        (toggle)="toggleSidebar()"
        (acceptInvitation)="acceptInvitation($event)"
        (declineInvitation)="declineInvitation($event)"
        (invitePlayer)="invitePlayer($event)"
      ></app-sidebar>

      <!-- Challenge Modal -->
      <app-challenge-modal
        *ngIf="selectedTeam"
        [team]="selectedTeam"
        (confirm)="confirmChallenge($event)"
        (cancel)="cancelChallenge()"
      ></app-challenge-modal>
    </div>
  `,
})
export class LobbyComponent implements OnInit, OnDestroy {
  currentPlayer!: Player;
  currentTeam: Team | null = null;
  invitations: Invitation[] = [];
  sidebarExpanded = false;
  settingsOpen = false;
  availablePlayers: Player[] = [];
  availableTeams: Team[] = [];
  teamSearchQuery = '';
  selectedTeam: Team | null = null;
  matchFound: QueueMatch | null = null;
  private subscriptions: Subscription[] = [];
  queueMatch: QueueMatch | null = null;
  challengingTeam: Team | null = null;
  showVoting = false;
  lastOpposingTeam: Team | null = null;
  currentVotes: Vote[] = [];

  constructor(
    private authService: AuthService,
    private gameService: GameService,
    private queueService: QueueService
  ) {}

  ngOnInit() {
    this.requestNotificationPermission();
    this.subscriptions.push(
      this.authService.getCurrentUser().subscribe((user) => {
        this.currentPlayer = user;
      }),

      this.gameService.getCurrentTeam().subscribe((team) => {
        this.currentTeam = team;
      }),

      this.gameService.getPendingInvitations().subscribe((invitations) => {
        this.invitations = invitations;
      }),

      this.gameService.getAvailableTeams().subscribe((teams) => {
        this.availableTeams = teams;
      }),

/*       this.queueService.getMatchFound().subscribe((match) => {
        this.matchFound = match;
      }),
      this.queueService.getMatchFound().subscribe((match) => {
        this.queueMatch = match;
      }),
      this.gameService.getTeamChallenges().subscribe((team) => {
        this.challengingTeam = team;
      }) */
    );

    // Simulate available players
/*     this.availablePlayers = Array(5)
      .fill(0)
      .map(() => this.gameService.generateRandomPlayer()); */
  }

  private async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  get isTeamCaptain(): boolean {
    return this.currentTeam?.captain.id === this.currentPlayer.id;
  }

  get filteredTeams(): Team[] {
    if (!this.teamSearchQuery.trim()) {
      return this.availableTeams;
    }

    const query = this.teamSearchQuery.toLowerCase();
    return this.availableTeams.filter(
      (team) =>
        team.name.toLowerCase().includes(query) ||
        team.players.some((player) =>
          player.username.toLowerCase().includes(query)
        )
    );
  }

  toggleSidebar() {
    this.sidebarExpanded = !this.sidebarExpanded;
  }

  toggleSettings() {
    this.settingsOpen = !this.settingsOpen;
  }

  acceptInvitation(id: string) {
    this.gameService.acceptInvitation(id);
  }

  declineInvitation(id: string) {
    this.gameService.declineInvitation(id);
  }

  invitePlayer(id: string) {
    console.log('Inviting player:', id);
  }

  leaveTeam() {
    // this.gameService.leaveTeam();
  }

  openChallengeModal(team: Team) {
    this.selectedTeam = team;
  }

  confirmChallenge(team: Team) {
    // this.gameService.challengeTeam(team);
    this.selectedTeam = null;
  }

  cancelChallenge() {
    this.selectedTeam = null;
  }

  acceptMatch() {
    if (this.matchFound) {
      // this.queueService.acceptMatch(this.matchFound);
    }
  }

  declineMatch() {
    // this.queueService.declineMatch();
  }

  openProfile() {
    this.settingsOpen = false;
  }

  logout() {
    this.settingsOpen = false;
  }

  onTeamChallenge(team: Team) {
    this.challengingTeam = team;
    // Auto-hide the challenge notification after 10 seconds
    setTimeout(() => {
      this.challengingTeam = null;
    }, 10000);
  }

  acceptQueueMatch() {
    if (this.queueMatch) {
      // this.queueService.acceptMatch(this.queueMatch);
    }
  }

  declineQueueMatch() {
    // this.queueService.declineMatch();
  }

  onMatchComplete(opposingTeam: Team) {
    this.challengingTeam = null;
    this.lastOpposingTeam = opposingTeam;
    this.showVoting = true;
  }

  onVoteSubmitted(player: Player) {
/*     const vote: Vote = {
      fromPlayer: this.currentPlayer,
      forPlayer: player,
    }; */
    // this.currentVotes = [...this.currentVotes, vote];
  }

  onVotingComplete() {
    this.showVoting = false;
    // Update the team with the new player
    // Reset for next match
    this.lastOpposingTeam = null;
    this.currentVotes = [];
  }
}
