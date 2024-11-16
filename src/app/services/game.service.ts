import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Player, Team, Invitation, TeamChallenge } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private currentPlayer: Player = {
    id: '1',
    username: 'Player1',
    rank: 'Gold II',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  };

  private teamSubject = new BehaviorSubject<Team | null>(null);
  private invitations = new BehaviorSubject<Invitation[]>([]);
  private availableTeams = new BehaviorSubject<Team[]>([]);
  private teamChallengeSubject = new BehaviorSubject<Team | null>(null);

  constructor() {
    // Simulate random invitations
    setInterval(() => {
      if (Math.random() > 0.8) {
        this.addInvitation();
      }
    }, 5000);

    // Simulate available teams
    this.generateRandomTeams();
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  generateRandomPlayer(): Player {
    const id = Math.random().toString();
    return {
      id,
      username: `Player${id.substring(2, 6)}`,
      rank: ['Bronze', 'Silver', 'Gold', 'Platinum'][
        Math.floor(Math.random() * 4)
      ],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    };
  }

  createTeam(players: Player[]) {
    const team: Team = {
      id: Math.random().toString(),
      name: `Team ${Math.floor(Math.random() * 1000)}`,
      players,
      captain: players[0],
    };
    this.teamSubject.next(team);
  }

  private generateRandomTeams(): void {
    const teams: Team[] = Array(5)
      .fill(0)
      .map(() => {
        const players = [
          this.generateRandomPlayer(),
          this.generateRandomPlayer(),
        ];
        return {
          id: Math.random().toString(),
          name: `Team ${Math.floor(Math.random() * 1000)}`,
          players,
          captain: players[0],
        };
      });
    this.availableTeams.next(teams);
  }

  getAvailableTeams(): Observable<Team[]> {
    return this.availableTeams.asObservable();
  }

  private addInvitation(): void {
    const newInvitation: Invitation = {
      id: Math.random().toString(),
      from: this.generateRandomPlayer(),
      timestamp: new Date(),
    };
    const current = this.invitations.value;
    this.invitations.next([...current, newInvitation]);
  }

  getInvitations(): Observable<Invitation[]> {
    return this.invitations.asObservable();
  }

  acceptInvitation(invitationId: string): void {
    const current = this.invitations.value;
    this.invitations.next(current.filter((inv) => inv.id !== invitationId));
    const invitation = current.find((inv) => inv.id === invitationId);
    if (invitation) {
      this.createTeam([this.currentPlayer, invitation.from]);
    }
  }

  declineInvitation(invitationId: string): void {
    const current = this.invitations.value;
    this.invitations.next(current.filter((inv) => inv.id !== invitationId));
  }

  getCurrentTeam(): Observable<Team | null> {
    return this.teamSubject.asObservable();
  }

  leaveTeam(): void {
    this.teamSubject.next(null);
  }

  challengeTeam(team: Team): void {
    // Implement challenge logic here
    console.log('Challenging team:', team);
    setTimeout(() => {
      this.teamChallengeSubject.next(team);
    }, 1000);
  }

  getTeamChallenges(): Observable<Team | null> {
    return this.teamChallengeSubject.asObservable();
  }
}
