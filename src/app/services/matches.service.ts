import { Injectable } from '@angular/core';
import {
  CreateMatchGQL,
  CreateVoteGQL,
  GetAllMatchesGQL,
  GetMyMatchGQL,
  MatchStatusGQL,
  MatchStatusSubscription,
  UpdateMatchGQL,
} from '../generated/graphql';
import { filter, map, Observable, tap } from 'rxjs';
import { Match, MatchOutcome, Player, Team } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  constructor(
    private challengeTeamGQL: CreateMatchGQL,
    private matchStatusGQL: MatchStatusGQL,
    private getAllMatchesGQL: GetAllMatchesGQL,
    private updateMatchGQL: UpdateMatchGQL,
    private createVoteGQL: CreateVoteGQL,
    private getMyMatchGQL: GetMyMatchGQL
  ) {}

  getMatches(): Observable<any> {
    return this.getAllMatchesGQL.fetch().pipe(
      map((result) => result.data?.getAllMatches),
      filter((matches): matches is NonNullable<typeof matches> => !!matches), // Filtra valores nulos/indefinidos
      tap((matches) => {
        return matches;
      })
    );
  }

  challengeTeam(input: any) {
    return this.challengeTeamGQL.mutate({ input }).pipe(
      tap((response) => {
        return response.data?.createMatch;
      })
    );
  }

  matchStatus(): Observable<MatchStatusSubscription['matchStatus']> {
    return this.matchStatusGQL.subscribe().pipe(
      map((result) => result.data?.matchStatus),
      filter(
        (matchStatus): matchStatus is NonNullable<typeof matchStatus> =>
          !!matchStatus
      ), // Filtra valores nulos/indefinidos
      tap((matchStatus) => {
        return matchStatus;
      })
    );
  }

  updateMatch(input: any) {
    return this.updateMatchGQL.mutate({ input }).pipe(
      tap((response) => {
        return response.data?.updateMatch;
      })
    );
  }

  createVote(input: any) {
    return this.createVoteGQL.mutate({ input }).pipe(
      tap((response) => {
        return response.data?.createVote;
      })
    );
  }

  getMyMatch() {
    return this.getMyMatchGQL.fetch().pipe(
      map((result) => result.data?.getMyMatch),
      tap((match) => {
        return match;
      })
    );
  }

  getMostVotedPlayer(match: Match, team: Team): Player | null {
    if (!match.votes?.length) return null;

    const voteCounts = new Map<string, number>();
    let maxVotes = 0;
    let mostVotedPlayerId = '';

    match.votes.forEach((vote) => {
      const playerId = vote.forPlayer.id;
      const currentCount = (voteCounts.get(playerId) || 0) + 1;
      voteCounts.set(playerId, currentCount);

      if (currentCount > maxVotes) {
        maxVotes = currentCount;
        mostVotedPlayerId = playerId;
      }
    });

    return team.players.find((p) => p.id === mostVotedPlayerId) || null;
  }

  getMatchOutcome(match: Match, currentTeamId: string): MatchOutcome {
    const winningTeam =
      match.winner?.id === match.team1?.id ? match.team1 : match.team2;
    const losingTeam =
      match.winner?.id === match.team1?.id ? match.team2 : match.team1;
    const currentTeam =
      currentTeamId === match.team1?.id ? match.team1 : match.team2;
    const isTeamEliminated = losingTeam.players.length <= 2;
    const mostVotedPlayer = match.mostVotedPlayer;

    return {
      winningTeam,
      losingTeam,
      isTeamEliminated,
      mostVotedPlayer: mostVotedPlayer!,
      currentTeam,
    };
  }

  getVoteCount(match: Match, playerId: string): number {
    return match.votes?.filter((v) => v.forPlayer.id === playerId).length || 0;
  }

  isVotingComplete(match: Match, team: Team): boolean {
    const expectedVotes = team.players.length;
    const actualVotes = match.votes?.length || 0;
    return actualVotes >= expectedVotes;
  }
}
