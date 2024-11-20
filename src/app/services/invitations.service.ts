import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import {
  AcceptInvitationGQL,
  DeclineInvitationGQL,
  InvitationReceivedGQL,
  InvitationReceivedSubscription,
  InvitePlayerGQL,
} from '../generated/graphql';
import { Invitation } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class InvitationsService {
  private invitations = new BehaviorSubject<any>(null);

  constructor(
    private acceptInvitationGQL: AcceptInvitationGQL,
    private declineInvitationGQL: DeclineInvitationGQL,
    private invitationReceivedGQL: InvitationReceivedGQL,
    private invitePlayerGQL: InvitePlayerGQL
  ) {}

  getInvitations(): Observable<
    InvitationReceivedSubscription['invitationReceived']
  > {
    return this.invitationReceivedGQL.subscribe().pipe(
      map((result) => {
        if (!result.data?.invitationReceived) {
          throw new Error('No invitation data received');
        }
        return result.data.invitationReceived;
      }),
      tap((invitation) => {
        this.invitations.next(invitation);
      })
    );
  }

  invitePlayer(playerId: string): Observable<any> {
    return this.invitePlayerGQL.mutate({ playerId }).pipe(
      tap((response) => {
        if (response.data) {
        }
      })
    );
  }

  acceptInvitation(invitationId: string): Observable<any> {
    return this.acceptInvitationGQL.mutate({ invitationId }).pipe(
      tap((response) => {
        if (response.data) {
        }
      })
    );
  }

  declineInvitation(invitationId: string): Observable<any> {
    return this.declineInvitationGQL.mutate({ invitationId }).pipe(
      tap((response) => {
        if (response.data) {
        }
      })
    );
  }
}
