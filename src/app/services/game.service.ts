import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import {
  AvailablePlayerGQL,
  AvailablePlayerSubscription,
  GetAvailablePlayersGQL,
  LeftTeamGQL,
} from '../generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(
    private getAvailablePlayersGQL: GetAvailablePlayersGQL,
    private availablePlayerGQL: AvailablePlayerGQL,
    private leftTeamGQL: LeftTeamGQL
  ) {}

  getAvailablePlayers(): Observable<any> {
    return this.getAvailablePlayersGQL.fetch().pipe(
      take(1),
      map((result) => result.data?.getAvailablePlayers),
      filter((players): players is NonNullable<typeof players> => !!players), // Filtra valores nulos/indefinidos
      tap((players) => {
        return players;
      })
    );
  }

  getAvailablePlayerSubscription(): Observable<
    AvailablePlayerSubscription['availablePlayer']
  > {
    return this.availablePlayerGQL.subscribe().pipe(
      map((result) => result.data?.availablePlayer),
      filter((player): player is NonNullable<typeof player> => !!player), // Filtra valores nulos/indefinidos
      tap((player) => {
        return player;
      })
    );
  }

  leaveTeam(): Observable<any> {
    return this.leftTeamGQL.mutate().pipe(
      tap((response) => {
        return response.data?.leftTeam;
      })
    );
  }
}
