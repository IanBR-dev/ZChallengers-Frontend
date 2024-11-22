import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, firstValueFrom, take } from 'rxjs';

// Components
import { LobbyHeaderComponent } from './components/header.component';
import { PlayerCardComponent } from './components/player-card.component';
import { TeamListComponent } from './components/team-list.component';
import { AvailablePlayersModalComponent } from './components/available-players.component';
import { InviteButtonComponent } from './components/invite-button.component';
import { ChallengeModalComponent } from './components/challenge-modal.component';
import { QueueComponent } from './components/queue.component';
import { VoteModalComponent } from './components/vote-modal/vote-modal.component';
import { TeamChallengeComponent } from './components/team-challenge.component';
import { MatchStatusComponent } from './components/match-status.component';
import { TeamFoundAnimationComponent } from './components/team-found-animation.component';

// Componets Shared
import { LoadingStateComponent } from '../../shared/components/loading-state.component';

// Types
import { Invitation, Match, Player, Team, Vote } from '../../models/types';
import { AuthService } from '../auth/services/auth.service';
import { GameService } from '../../services/game.service';
import { TeamsService } from '../../services/teams.service';
import { InvitationsService } from '../../services/invitations.service';
import { MatchesService } from '../../services/matches.service';

// Services

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChallengeModalComponent,
    QueueComponent,
    TeamFoundAnimationComponent,
    VoteModalComponent,
    TeamChallengeComponent,
    MatchStatusComponent,
    LoadingStateComponent,
    PlayerCardComponent,
    LobbyHeaderComponent,
    TeamListComponent,
    InviteButtonComponent,
    AvailablePlayersModalComponent,
  ],
  template: `
    <!-- Loading State -->
    <div
      *ngIf="isLoading"
      class="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center"
    >
      <app-loading-state message="Loading lobby..."></app-loading-state>
    </div>

    <div class="min-h-screen relative overflow-hidden">
      <!-- Background Video/Image Container -->
      <div class="absolute inset-0 w-full h-full z-0">
        <video
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 flip-horizontal"
          (pause)="(true)"
          loop
          muted
          playsinline
        >
          <source src="assets/videos/login-background.mp4" type="video/mp4" />
        </video>
        <div
          class="absolute inset-0"
          style="background: var(--bg-overlay)"
        ></div>
      </div>

      <!-- Header -->
      <app-lobby-header
        [invitations]="invitations"
        (onAcceptInvitation)="acceptInvitation($event)"
        (onDeclineInvitation)="declineInvitation($event)"
        (onProfileClick)="openProfile()"
        (onLogout)="logout()"
        class="relative z-50"
      >
      </app-lobby-header>

      <!-- Main Content -->
      <div
        class="relative z-10 pt-24 px-4 pb-4 max-w-7xl mx-auto"
        *ngIf="!match"
      >
        <!-- Quick Actions -->
        <div class="flex justify-end mb-8">
          <app-invite-button
            *ngIf="!currentTeam"
            (onClick)="showInviteModal = true"
          >
          </app-invite-button>
        </div>

        <!-- Current Team/Player Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Player/Team Info -->
          <div class="lg:col-span-1">
            <div class="glass rounded-lg p-6">
              <h2 class="text-2xl font-bold mb-6" style="color: var(--primary)">
                {{ currentTeam ? 'Your Team' : 'Solo Player' }}
              </h2>

              <ng-container *ngIf="currentTeam">
                <div class="space-y-4">
                  <h3 class="text-xl" style="color: var(--text-primary)">
                    {{ currentTeam.name }}
                  </h3>
                  <!-- Team Players Grid -->
                  <div class="grid grid-cols-1 gap-3">
                    <app-player-card
                      *ngFor="let player of currentTeam.players"
                      [player]="player"
                      [currentPlayer]="currentPlayer"
                      [isCaptain]="player.id === currentTeam.captain.id"
                    >
                    </app-player-card>
                  </div>
                  <button
                    class="primary-button w-full mt-4"
                    (click)="leaveTeam()"
                  >
                    Leave Team
                  </button>
                </div>
              </ng-container>

              <ng-container *ngIf="!currentTeam && currentPlayer">
                <app-player-card [player]="currentPlayer" class="mb-6">
                </app-player-card>
                <app-queue
                  *ngIf="!currentTeam"
                  (teamFounded)="teamFounded($event)"
                ></app-queue>
              </ng-container>
            </div>
          </div>

          <!-- Available Teams -->
          <div class="lg:col-span-2" *ngIf="currentTeam">
            <div
              class="glass rounded-lg p-6 h-full overflow-auto max-h-[calc(100vh-200px)]"
            >
              <app-team-list
                [teams]="availableTeams"
                [isTeamCaptain]="isTeamCaptain"
                (onChallengeTeam)="openChallengeModal($event)"
              >
              </app-team-list>
            </div>
          </div>
        </div>
      </div>

      <div
        class="relative z-10 pt-24 px-4 pb-4 max-w-7xl mx-auto"
        *ngIf="match"
      >
        <app-match-status
          *ngIf="match.team1 && match.team2"
          [team1]="match.team1"
          [team2]="match.team2"
        >
        </app-match-status>
      </div>
      <!-- Modals -->
      <app-team-found-animation
        *ngIf="teamFound"
        [team]="teamFound"
        [isInvitation]="false"
        (onContinue)="closeModalTeamFound()"
        class="z-[70]"
      >
      </app-team-found-animation>

      <app-team-challenge
        *ngIf="showChallenge && challengingTeam && challengedTeam"
        [challengingTeam]="challengingTeam"
        [challengedTeam]="challengedTeam"
        [isChallenger]="isChallenger"
        (closeChallengeModal)="closeChallengeModal()"
        class="z-[70]"
      >
      </app-team-challenge>

      <app-vote-modal
        *ngIf="showVoting"
        [opposingTeam]="lastOpposingTeam!"
        [currentTeam]="currentTeam!"
        [canVote]="canVote"
        [submittedVotes]="currentVotes"
        [isComplete]="isVotingComplete"
        [winnerTeamId]="match?.winner?.id"
        [mostVotedPlayer]="match?.mostVotedPlayer"
        [currentPlayer]="currentPlayer"
        (onVoteSubmit)="handleVoteSubmit($event)"
        (onVotingComplete)="handleVotingComplete()"
        class="z-[70]"
      >
      </app-vote-modal>

      <app-available-players-modal
        *ngIf="showInviteModal"
        [players]="availablePlayers"
        [pendingInvites]="invitations"
        (onInvite)="invitePlayer($event)"
        (onClose)="showInviteModal = false"
        class="z-[70]"
      >
      </app-available-players-modal>

      <app-challenge-modal
        *ngIf="selectedTeam"
        [team]="selectedTeam"
        (confirm)="confirmChallenge($event)"
        (cancel)="cancelChallenge()"
        class="z-[70]"
      >
      </app-challenge-modal>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .flip-horizontal {
        transform: scaleX(-1);
      }

      .glass {
        background: var(--bg-glass);
        backdrop-filter: blur(16px) saturate(180%);
        border: 1px solid var(--border-light);
      }

      .primary-button {
        @apply px-6 py-3 rounded font-semibold relative overflow-hidden;
        background: var(--primary);
        color: var(--text-primary);
        transition: all 0.3s ease;
      }

      .primary-button:hover {
        filter: brightness(1.2);
        transform: translateY(-2px);
      }

      .primary-button:active {
        transform: translateY(0);
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,
  ],
})
export class LobbyComponent implements OnInit, OnDestroy {
  // UI States
  isLoading = true;
  showInviteModal = false;
  showChallenge = false;
  showVoting = false;

  // Player & Team States
  currentPlayer!: Player;
  currentTeam: Team | null | undefined = null;
  teamFound: Team | null = null;
  availablePlayers: Player[] = [];
  availableTeams: Team[] = [];
  selectedTeam: Team | null = null;

  // Match States
  match: Match | null = null;
  challengingTeam: Team | null | undefined = null;
  challengedTeam: Team | null | undefined = null;
  isChallenger = false;
  lastOpposingTeam: Team | null | undefined = null;
  currentVotes: Vote[] = [];
  canVote = false;
  myVote: Vote | undefined = undefined;
  isVotingComplete = false;

  // Invitations
  invitations: Invitation[] = [];

  // Subscriptions Management
  private subscriptions = {
    availablePlayers: new Subscription(),
    availableTeams: new Subscription(),
    invitations: new Subscription(),
    matchStatus: new Subscription(),
    teamFound: new Subscription(),
  };

  constructor(
    private authService: AuthService,
    private gameService: GameService,
    private teamsService: TeamsService,
    private invitationsService: InvitationsService,
    private matchesService: MatchesService
  ) {}

  async ngOnInit() {
    try {
      await this.initializeLobby();
    } finally {
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  // Initialization Methods
  private async initializeLobby() {
    await this.requestNotificationPermission();
    await this.setCurrentPlayer();
    await this.setupInitialState();
  }

  private async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch (error) {
        console.error('Failed to request notification permission:', error);
      }
    }
  }

  private async setCurrentPlayer() {
    this.currentPlayer = await firstValueFrom(
      this.authService.getCurrentUser()
    );
    this.currentTeam = this.currentPlayer.team;
  }

  private async setupInitialState() {
    if (this.currentTeam) {
      await this.initTeamState();
    } else {
      await this.initSoloState();
    }
    const myMatch = await firstValueFrom(this.matchesService.getMyMatch());
    if (myMatch) {
      await this.handleMatchUpdate(myMatch);
    }
  }

  // State Management Methods
  private async initTeamState() {
    await this.getAvailableTeams();
    this.setupAvailableTeamsSubscription();
    this.setupMatchStatusSubscription();
  }

  private async initSoloState() {
    await this.getAvailablePlayers();
    this.setupAvailablePlayersSubscription();
    this.setupInvitationsSubscription();
  }

  // Subscription Setup Methods
  private setupAvailablePlayersSubscription() {
    this.unsubscribe('availablePlayers');
    this.subscriptions.availablePlayers = this.gameService
      .getAvailablePlayerSubscription()
      .subscribe({
        next: (player) => {
          if (player.status === 'AVAILABLE') {
            this.availablePlayers.push(player);
          } else {
            this.availablePlayers = this.availablePlayers.filter(
              (p) => p.id !== player.id
            );
          }
        },
      });
  }

  private setupAvailableTeamsSubscription() {
    this.unsubscribe('availableTeams');
    this.subscriptions.availableTeams = this.teamsService
      .getAvailableTeam()
      .subscribe({
        next: (team) => {
          this.handleTeamUpdate(team);
        },
      });
  }

  private setupInvitationsSubscription() {
    this.unsubscribe('invitations');
    this.subscriptions.invitations = this.invitationsService
      .getInvitations()
      .subscribe({
        next: (invitation) => {
          this.handleInvitation(invitation);
        },
      });
  }

  private setupMatchStatusSubscription() {
    this.unsubscribe('matchStatus');
    this.subscriptions.matchStatus = this.matchesService
      .matchStatus()
      .subscribe({
        next: (match) => {
          this.handleMatchUpdate(match);
        },
      });
  }

  // Event Handlers
  private handleTeamUpdate(team: Team) {
    if (team.id === this.currentTeam?.id) {
      this.currentTeam = { ...team };

      if (team.status === 'eliminated') {
        this.initSoloState();
        this.currentTeam = null;
        this.availableTeams = [];
        return;
      }

      this.getAvailableTeams();
      return;
    }

    let updatedTeams = [...this.availableTeams];
    const teamIndex = updatedTeams.findIndex((t) => t.id === team.id);

    if (team.status === 'available') {
      const hasValidPlayerCount =
        team.players.length === this.currentTeam?.players.length;

      if (hasValidPlayerCount) {
        if (teamIndex !== -1) {
          updatedTeams[teamIndex] = { ...team };
        } else {
          updatedTeams.push({ ...team });
        }
      } else if (teamIndex !== -1) {
        updatedTeams.splice(teamIndex, 1);
      }
    } else {
      updatedTeams = updatedTeams.filter((t) => t.id !== team.id);
    }

    if (JSON.stringify(updatedTeams) !== JSON.stringify(this.availableTeams)) {
      this.availableTeams = updatedTeams;
    }
  }

  private handleInvitation(invitation: Invitation) {
    if (
      invitation.status === 'PENDING' &&
      invitation.to.id === this.currentPlayer.id
    ) {
      const expirationTime =
        new Date(invitation.expiresAt).getTime() - Date.now();
      this.invitations.push(invitation);

      if (expirationTime > 0) {
        setTimeout(() => {
          this.invitations = this.invitations.filter(
            (inv) => inv.id !== invitation.id
          );
        }, expirationTime);
      }
    } else if (invitation.status === 'ACCEPTED') {
      this.invitations = this.invitations.filter(
        (inv) => inv.id !== invitation.id
      );
      this.getCurrentTeam();
    } else if (invitation.status === 'DECLINED') {
      this.invitations = this.invitations.filter(
        (inv) => inv.id !== invitation.id
      );
    }
  }

  private async handleMatchUpdate(match: Match) {
    this.match = match;
    if (match.status === 'IN_PROGRESS') {
      this.handleMatchInProgress(match);
    } else if (match.status === 'VOTING') {
      this.handleMatchVoting(match);
    } else if (match.status === 'COMPLETED') {
      this.handleMatchCompletion(match);
    }
  }

  private handleMatchInProgress(match: Match) {
    const myTeam = this.currentTeam?.id;
    this.challengingTeam = match.team1;
    this.challengedTeam = match.team2;
    this.isChallenger = myTeam === match.team1?.id;
    this.showChallenge = true;
    setTimeout(() => {
      this.match = match;
    }, 9500);
  }

  private handleMatchVoting(match: Match) {
    if (match.winner && match.votes) {
      const team1 = match.team1;
      const team2 = match.team2;
      const winnerTeamId = match.winner.id;
      const loserTeam = winnerTeamId === team1?.id ? team2 : team1;
      const winnerTeam = winnerTeamId === team1?.id ? team1 : team2;

      // Actualizar estado de votación
      this.canVote = winnerTeamId === this.currentTeam?.id;

      // Actualizar votos solo si son diferentes
      if (JSON.stringify(this.currentVotes) !== JSON.stringify(match.votes)) {
        this.currentVotes = [...match.votes];
        // Actualizar mi voto si existe
        this.myVote = this.currentVotes.find(
          (vote) => vote.fromPlayer.id === this.currentPlayer.id
        );
      }

      // Mostrar modal de votación si aún no está visible
      if (!this.showVoting) {
        this.lastOpposingTeam = loserTeam;
        this.showVoting = true;
      }

      // Verificar si la votación está completa
      const totalVotes = this.currentVotes.length;
      const requiredVotes = winnerTeam?.players.length;

      if (totalVotes === requiredVotes) {
        this.isVotingComplete = true;
      }
    }
  }

  private async handleMatchCompletion(match: Match) {
    // Actualizar estado del equipo
    const teams = [match.team1, match.team2];
    this.currentTeam = teams.find((team) =>
      team?.players.some((player) => player.id === this.currentPlayer.id)
    );

    // agregar jugador mas votado a match
    this.match = match;

    // Si el modal de votación está abierto, marcar como completo
    if (this.showVoting) {
      this.isVotingComplete = true;
      // No hacemos cleanup aquí, esperamos a que el usuario cierre el modal
      return;
    }

    // Si no hay modal de votación, proceder con la limpieza
    await this.cleanupAfterMatch();
  }

  // State Transition Methods
  async onTeamJoined(team: Team) {
    this.unsubscribe('availablePlayers');
    this.unsubscribe('invitations');

    this.currentTeam = team;
    await this.initTeamState();
  }

  async onTeamLeft() {
    this.currentTeam = null;
    this.availableTeams = [];
    await this.initSoloState();
  }

  // UI Event Handlers
  async acceptInvitation(id: string) {
    this.invitationsService.acceptInvitation(id).subscribe({
      next: async (response) => {
        await this.onTeamJoined(response.data.acceptInvitation.team);
      },
      error: (err) => {
        console.error('Error accepting invitation:', err);
      },
    });
  }

  declineInvitation(id: string) {
    this.invitationsService.declineInvitation(id).subscribe(() => {
      this.invitations = this.invitations.filter((inv) => inv.id !== id);
    });
  }

  invitePlayer(id: string) {
    this.invitationsService.invitePlayer(id).subscribe();
  }

  async leaveTeam() {
    this.unsubscribe('availableTeams');
    this.unsubscribe('matchStatus');
    this.gameService.leaveTeam().subscribe({
      next: async (result) => {
        if (result) {
          await this.onTeamLeft();
        } else {
          this.initTeamState();
        }
      },
      error: (err) => {
        console.error('Error leaving team:', err);
      },
    });
  }

  async teamFounded(team: Team) {
    this.teamFound = team;
    await this.onTeamJoined(team);
  }

  openChallengeModal(team: Team) {
    if (this.isTeamCaptain) {
      this.selectedTeam = team;
    }
  }

  confirmChallenge(team: Team) {
    const input = { team1Id: this.currentTeam?.id, team2Id: team.id };
    this.matchesService.challengeTeam(input).subscribe({
      next: (response) => {
        const match = response.data?.createMatch;
        if (match) {
          this.handleNewMatch(match);
        }
      },
      error: (err) => {
        console.error('Challenge error:', err);
      },
    });
    this.selectedTeam = null;
  }

  cancelChallenge() {
    this.selectedTeam = null;
  }

  closeChallengeModal() {
    this.showChallenge = false;
  }

  closeModalTeamFound() {
    this.teamFound = null;
  }

  openProfile() {
    // Implement profile navigation
  }

  logout() {
    this.authService.logout();
  }

  handleVoteSubmit(playerId: string) {
    if (this.myVote) {
      return;
    }

    const input = {
      matchId: this.match?.id,
      forPlayerId: playerId,
    };

    this.matchesService
      .createVote(input)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          const vote = response.data?.createVote;
          if (vote) {
            // No actualizamos currentVotes aquí, se actualizará a través de la suscripción
            this.myVote = {
              id: vote.id,
              fromPlayer: vote.fromPlayer,
              forPlayer: vote.forPlayer,
            };
          }
        },
        error: (err) => {
          console.error('Error submitting vote:', err);
        },
      });
  }

  handleVotingComplete() {
    this.showVoting = false;
    this.canVote = false;
    this.currentVotes = [];
    this.lastOpposingTeam = null;
    this.isVotingComplete = false;
    this.match = null;
    this.myVote = undefined;

    // Limpiar suscripciones y actualizar estado
    this.unsubscribe('availableTeams');
    this.unsubscribe('matchStatus');
    this.cleanupAfterMatch();
  }

  private async cleanupAfterMatch() {
    if (this.currentTeam?.status === 'eliminated' || !this.currentTeam) {
      this.currentTeam = null;
      await this.initSoloState();
    } else {
      await this.initTeamState();
    }
  }

  // Helper Methods
  private async getAvailablePlayers() {
    this.availablePlayers = [
      ...(await firstValueFrom(this.gameService.getAvailablePlayers())),
    ];
  }

  private async getAvailableTeams() {
    if (this.currentTeam) {
      const availableTeams = [
        ...(await firstValueFrom(this.teamsService.getAvailableTeams())),
      ];
      this.availableTeams = availableTeams.filter(
        (t) => t.id !== this.currentTeam?.id
      );
    } else {
      this.availableTeams = [];
    }
  }

  private async getCurrentTeam(): Promise<void> {
    this.currentTeam = await firstValueFrom(this.teamsService.getCurrentTeam());
    await this.initTeamState();
  }

  private handleNewMatch(match: Match) {
    const myTeam = this.currentTeam?.id;
    this.challengingTeam =
      match.team1?.id === myTeam ? match.team2 : match.team1;
    this.challengedTeam =
      match.team1?.id !== myTeam ? match.team1 : match.team2;
    this.isChallenger = true;
    this.showChallenge = true;
    setTimeout(() => {
      this.match = match;
    }, 9500);
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

  get isTeamCaptain(): boolean {
    return this.currentTeam?.captain.id === this.currentPlayer.id;
  }
}
