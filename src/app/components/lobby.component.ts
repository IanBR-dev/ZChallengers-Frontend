import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../services/game.service';
import { QueueService } from '../services/queue.service';
import {
  Player,
  Team,
  QueueMatch,
  Invitation,
  Vote,
  Match,
} from '../models/types';
import { SidebarComponent } from './sidebar.component';
import { ChallengeModalComponent } from './challenge-modal.component';
import { QueueComponent } from './queue.component';
import { MatchFoundComponent } from './match-found.component';
import { firstValueFrom, Subscription, take } from 'rxjs';
import { TeamFoundComponent } from './team-found.component';
import { VoteModalComponent } from './vote-modal.component';
import { AuthService } from '../services/auth.service';
import { TeamsService } from '../services/teams.service';
import { InvitationsService } from '../services/invitations.service';
import { MatchesService } from '../services/matches.service';
import { TeamChallengeComponent } from './team-challenge.component';
import { MatchStatusComponent } from './match-status.component';
import { MatchStatus } from '../generated/graphql';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    ChallengeModalComponent,
    QueueComponent,
    TeamFoundComponent,
    VoteModalComponent,
    TeamChallengeComponent,
    MatchStatusComponent,
  ],
  template: `
    <div class="min-h-screen bg-black">
      <!-- Team Found Modal (for queue matches) -->
      <app-team-found
        *ngIf="teamFound"
        [team]="teamFound"
        (closeModal)="closeModalTeamFound()"
      >
      </app-team-found>

      <!-- Match Found Modal (for team challenges) -->
      <app-team-challenge
        *ngIf="showChallenge"
        [challengingTeam]="challengingTeam"
        [challengedTeam]="challengedTeam"
        [isChallenger]="isChallenger"
        (closeChallengeModal)="closeChallengeModal()"
      ></app-team-challenge>

      <app-vote-modal
        *ngIf="showVoting"
        [canVote]="canVote"
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
      <div class="pt-24 px-4 pb-4" *ngIf="!match">
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

            <ng-container *ngIf="!currentTeam && currentPlayer">
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
              <app-queue (teamFounded)="teamFounded($event)"></app-queue>
            </ng-container>
          </div>

          <!-- Available Teams -->
          <div *ngIf="currentTeam" class="mb-8">
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
                    *ngIf="isTeamCaptain"
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

      <app-match-status
        *ngIf="match"
        [team1]="match.team1"
        [team2]="match.team2"
      ></app-match-status>

      <!-- Sidebar -->
      <app-sidebar
        *ngIf="!currentTeam"
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
  currentTeam: Team | null | undefined = null;
  teamFound: Team | null = null;
  invitations: Invitation[] = [];
  sidebarExpanded = false;
  settingsOpen = false;
  availablePlayers: Player[] = [];
  availableTeams: Team[] = [];
  teamSearchQuery = '';
  selectedTeam: Team | null = null;
  match: Match | null = null;
  private subscriptions: Subscription[] = [];
  challengingTeam: Team | null = null;
  challengedTeam: Team | null = null;
  isChallenger = false;
  showChallenge = false;
  showVoting = false;
  lastOpposingTeam: Team | null = null;
  currentVotes: Vote[] | null | undefined = null;
  canVote = false;

  private getAvailablePlayersSubscription: Subscription[] = [];
  private getAvailableTeamSubscription: Subscription[] = [];
  private matchSubscription: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private gameService: GameService,
    private teamsService: TeamsService,
    private invitationsService: InvitationsService,
    private matchesService: MatchesService
  ) {}

  async ngOnInit() {
    this.requestNotificationPermission();
    this.currentPlayer = await firstValueFrom(
      this.authService.getCurrentUser()
    );
    await this.getCurrentTeam();
    this.subscriptions.push(
      this.invitationsService.getInvitations().subscribe((invitation) => {
        if (
          invitation.status === 'PENDING' &&
          invitation.to.id === this.currentPlayer.id
        ) {
          this.invitations.push(invitation);
        }
        if (invitation.status === 'ACCEPTED') {
          this.invitations.filter((inv) => inv.id !== invitation.id);
          this.getCurrentTeam();
        }
        if (invitation.status === 'DECLINED') {
          this.invitations = this.invitations.filter(
            (inv) => inv.id !== invitation.id
          );
        }
      })
    );
  }

  private async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
      } catch (error) {}
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  async getCurrentTeam(): Promise<void> {
    if (!this.currentTeam) {
      this.currentTeam = await firstValueFrom(
        this.teamsService.getCurrentTeam()
      );
      this.getAvailablePlayersSubscription.push(
        this.gameService.getAvailablePlayers().subscribe((players: any) => {
          this.availablePlayers = players.filter(
            (player: any) => player.id !== this.currentPlayer.id
          );
        })
      );
    }
    if (this.currentTeam) {
      this.getAvailableTeams();
      this.getAvailableTeamSub(true);
      this.getMatchSub(true);
    }
  }

  async teamFounded(team: Team) {
    this.currentTeam = team;
    this.getAvailablePlayersSubscription.forEach((sub) => sub.unsubscribe());
  }

  async getAvailableTeams() {
    this.availableTeams = [
      ...(await firstValueFrom(this.teamsService.getAvailableTeams())),
    ];
  }

  async getAvailableTeamSub(sub?: boolean) {
    if (sub) {
      this.getAvailableTeamSubscription.push(
        this.teamsService.getAvailableTeam().subscribe((team) => {
          if (team.status === 'available') {
            this.availableTeams.push(team);
          }
          if (team.status === 'in-match') {
            this.availableTeams = this.availableTeams.filter(
              (t) => t.id !== team.id
            );
          }
        })
      );
    } else {
      this.getAvailableTeamSubscription.forEach((sub) => sub.unsubscribe());
    }
  }

  async getMatchSub(sub?: boolean) {
    if (sub) {
      this.matchSubscription.push(
        this.matchesService.matchStatus().subscribe((match) => {
          if (match && match.status === MatchStatus.InProgress) {
            const myTeam = this.currentTeam?.id;
            this.challengingTeam = match.team1;
            this.challengedTeam = match.team2;
            this.isChallenger = myTeam === match.team1.id;
            this.showChallenge = true;
            // Eliminar availableTeam del suscriptor
            this.getAvailableTeamSub();
            this.subscriptions.forEach((sub) => sub.unsubscribe());
            setTimeout(() => {
              this.match = match;
            }, 9500);
          }
          if (
            match &&
            match.status === MatchStatus.Voting &&
            match.winner &&
            match.votes &&
            match.votes?.length === 0
          ) {
            const team1 = match.team1;
            const team2 = match.team2;
            const winnerTeam = match.winner.id;
            const losserTeam = winnerTeam === team1.id ? team2 : team1;
            if (winnerTeam === this.currentTeam?.id) {
              this.canVote = true;
            }
            this.onMatchComplete(losserTeam);
          }
          if (
            match &&
            match.status === MatchStatus.Voting &&
            match.votes &&
            match.votes?.length > 0
          ) {
            this.currentVotes = match.votes;
          }
          if (match.status === MatchStatus.Completed) {
            // Refresh my team
            const team1 = match.team1;
            const team2 = match.team2;
            const teams = [team1, team2];
            this.currentTeam = teams.find((team) =>
              team.players.some((player) => player.id === this.currentPlayer.id)
            );
            this.onVotingComplete();
          }
        })
      );
    } else {
      this.matchSubscription.forEach((sub) => sub.unsubscribe());
    }
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
    this.invitationsService.acceptInvitation(id).subscribe({
      next: (response) => {
        this.currentTeam = response.data.acceptInvitation.team;
        this.getAvailablePlayersSubscription.forEach((sub) =>
          sub.unsubscribe()
        );
      },
      error: (err) => {
        console.error('Error accepting invitation:', err);
      },
    });
  }

  declineInvitation(id: string) {
    this.invitationsService.declineInvitation(id).subscribe();
  }

  invitePlayer(id: string) {
    this.invitationsService.invitePlayer(id).subscribe();
  }

  leaveTeam() {
    // this.gameService.leaveTeam();
  }

  async closeModalTeamFound() {
    this.currentTeam = this.teamFound;
    this.teamFound = null;
    this.getCurrentTeam();
  }

  openChallengeModal(team: Team) {
    if (this.isTeamCaptain) {
      this.selectedTeam = team;
    }
  }

  closeChallengeModal() {
    this.showChallenge = false;
  }

  confirmChallenge(team: Team) {
    const input = { team1Id: this.currentTeam?.id, team2Id: team.id };
    this.matchesService.challengeTeam(input).subscribe({
      next: (response) => {
        const match = response.data?.createMatch;
        if (match) {
          const myTeam = this.currentTeam?.id;
          this.challengingTeam =
            match.team1.id === myTeam ? match.team2 : match.team1;
          this.challengedTeam =
            match.team1.id !== myTeam ? match.team1 : match.team2;
          this.isChallenger = true;
          this.showChallenge = true;
          setTimeout(() => {
            this.match = match;
          }, 9500);
        }
      },
      error: (err) => {},
    });
    this.selectedTeam = null;
  }

  cancelChallenge() {
    this.selectedTeam = null;
  }

  openProfile() {
    this.settingsOpen = false;
  }

  logout() {
    this.settingsOpen = false;
    this.authService.logout();
  }

  onTeamChallenge(team: Team) {
    this.challengingTeam = team;
    // Auto-hide the challenge notification after 10 seconds
    setTimeout(() => {
      this.challengingTeam = null;
    }, 10000);
  }

  onMatchComplete(lossingTeam: Team) {
    this.challengingTeam = null;
    this.lastOpposingTeam = lossingTeam;
    this.showVoting = true;
  }

  onVoteSubmitted(player: Player) {
    const input: any = {
      matchId: this.match?.id,
      forPlayerId: player.id,
    };
    this.matchesService.createVote(input).pipe(take(1)).subscribe();
  }

  onVotingComplete() {
    this.showVoting = false;
    this.canVote = false;
    this.match = null;
    this.lastOpposingTeam = null;
    this.matchSubscription.forEach((sub) => sub.unsubscribe());
    this.getAvailableTeams();
    this.currentVotes = [];
  }
}
