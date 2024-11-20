import { Injectable } from '@angular/core';
import {
  CreateMatchGQL,
  CreateVoteGQL,
  GetAllMatchesGQL,
  MatchStatusGQL,
  MatchStatusSubscription,
  UpdateMatchGQL,
} from '../generated/graphql';
import { filter, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  constructor(
    private challengeTeamGQL: CreateMatchGQL,
    private matchStatusGQL: MatchStatusGQL,
    private getAllMatchesGQL: GetAllMatchesGQL,
    private updateMatchGQL: UpdateMatchGQL,
    private createVoteGQL: CreateVoteGQL
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
}
