import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import {
  JoinQueueGQL,
  LeaveQueueGQL,
  QueueStatusGQL,
  QueueStatusSubscription,
} from '../generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  private queueStatusSubject = new BehaviorSubject<any>(null);

  constructor(
    private joinQueueGQL: JoinQueueGQL,
    private leaveQueueGQL: LeaveQueueGQL,
    private queueStatusGQL: QueueStatusGQL
  ) {}

  joinQueue(): Observable<any> {
    return this.joinQueueGQL.mutate().pipe(
      tap(() => {
        console.log('Joined queue');
      })
    );
  }

  leaveQueue(): Observable<any> {
    return this.leaveQueueGQL.mutate().pipe(
      tap(() => {
        console.log('Left queue');
      })
    );
  }

  getQueueStatus(): Observable<QueueStatusSubscription['queueStatus']> {
    return this.queueStatusGQL.subscribe().pipe(
      map((result) => result.data?.queueStatus),
      filter(
        (queueStatus): queueStatus is NonNullable<typeof queueStatus> =>
          !!queueStatus
      ), // Filtra valores nulos/indefinidos
      tap((queueStatus) => {
        this.queueStatusSubject.next(queueStatus);
      })
    );
  }

  observeQueueStatus(): Observable<any> {
    return this.queueStatusSubject.asObservable();
  }
}
