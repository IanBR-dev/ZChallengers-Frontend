import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import {
  JoinQueueGQL,
  LeaveQueueGQL,
  TeamFoundGQL,
  TeamFoundSubscription,
} from '../generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  constructor(
    private joinQueueGQL: JoinQueueGQL,
    private leaveQueueGQL: LeaveQueueGQL,
    private teamFoundGQL: TeamFoundGQL
  ) {}

  joinQueue(): Observable<boolean> {
    return this.joinQueueGQL.mutate().pipe(
      map((result) => result.data?.joinQueue ?? false),
      tap((success) => {
        if (success) {
        } else {
        }
      }),
      catchError((error) => {
        return of(false);
      })
    );
  }

  leaveQueue(): Observable<any> {
    return this.leaveQueueGQL.mutate().pipe(tap(() => {}));
  }

  teamFound(): Observable<TeamFoundSubscription['teamFound']> {
    return this.teamFoundGQL.subscribe().pipe(
      map((result) => result.data?.teamFound),
      filter(
        (queueStatus): queueStatus is NonNullable<typeof queueStatus> =>
          !!queueStatus
      ), // Filtra valores nulos/indefinidos
      tap((queueStatus) => {
        return queueStatus;
      })
    );
  }
}
