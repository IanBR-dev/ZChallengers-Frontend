import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import {
  AvailablePlayersGQL,
  AvailablePlayersSubscription,
} from '../generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private availablePlayersSubject = new BehaviorSubject<any>(null);

  constructor(private availablePlayersGQL: AvailablePlayersGQL) {}

  getAvailablePlayers(): Observable<
    AvailablePlayersSubscription['availablePlayers']
  > {
    return this.availablePlayersGQL.subscribe().pipe(
      map((result) => result.data?.availablePlayers),
      filter(
        (queueStatus): queueStatus is NonNullable<typeof queueStatus> =>
          !!queueStatus
      ), // Filtra valores nulos/indefinidos
      tap((queueStatus) => {
        this.availablePlayersSubject.next(queueStatus);
      })
    );
  }
}
