import { Injectable } from '@angular/core';
import { filter, map, Observable, take, tap } from 'rxjs';
import {
  AvailableTeamGQL,
  AvailableTeamSubscription,
  CurrentTeamGQL,
  GetAvailableTeamsGQL,
} from '../generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  constructor(
    private availableTeamGQL: AvailableTeamGQL,
    private currentTeamGQL: CurrentTeamGQL,
    private availableTeamsGQL: GetAvailableTeamsGQL
  ) {}

  getAvailableTeam(): Observable<AvailableTeamSubscription['availableTeam']> {
    return this.availableTeamGQL.subscribe().pipe(
      map((result) => result.data?.availableTeam),
      filter((team): team is NonNullable<typeof team> => !!team), // Filtra valores nulos/indefinidos
      tap((team) => {
        return team;
      })
    );
  }

  getAvailableTeams(): Observable<any> {
    return this.availableTeamsGQL.fetch().pipe(
      take(1),
      map((result) => result.data?.getAvailableTeams),
      filter((teams): teams is NonNullable<typeof teams> => !!teams), // Filtra valores nulos/indefinidos
      tap((teams) => {
        return teams;
      })
    );
  }

  getCurrentTeam(): Observable<any> {
    return this.currentTeamGQL.fetch().pipe(
      take(1),
      map((result) => result.data?.currentTeam),
      tap((team) => {
        if (team) {
          return team;
        }
        return null;
      })
    );
  }
}
