import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import {
  AvailableTeamsGQL,
  AvailableTeamsQuery,
  CreateTeamGQL,
  CreateTeamMutationVariables,
  PendingInvitationsGQL,
  PendingInvitationsQuery,
  AcceptInvitationGQL,
  AcceptInvitationMutationVariables,
  DeclineInvitationGQL,
  DeclineInvitationMutationVariables,
} from '../generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private currentTeamSubject = new BehaviorSubject<any>(null);

  constructor(
    private availableTeamsGQL: AvailableTeamsGQL,
    private createTeamGQL: CreateTeamGQL,
    private pendingInvitationsGQL: PendingInvitationsGQL,
    private acceptInvitationGQL: AcceptInvitationGQL,
    private declineInvitationGQL: DeclineInvitationGQL
  ) {}

  getAvailableTeams(): Observable<AvailableTeamsQuery['availableTeams']> {
    return this.availableTeamsGQL
      .watch()
      .valueChanges.pipe(map((result) => result.data.availableTeams));
  }

  createTeam(input: CreateTeamMutationVariables): Observable<any> {
    return this.createTeamGQL.mutate(input).pipe(
      tap((response) => {
        if (response.data) {
          this.currentTeamSubject.next(response.data.createTeam);
        }
      })
    );
  }

  getPendingInvitations(): Observable<
    PendingInvitationsQuery['pendingInvitations']
  > {
    return this.pendingInvitationsGQL
      .watch()
      .valueChanges.pipe(map((result) => result.data.pendingInvitations));
  }

  acceptInvitation(invitationId: string): Observable<any> {
    return this.acceptInvitationGQL.mutate({ invitationId }).pipe(
      tap((response) => {
        if (response.data) {
          console.log('Invitation accepted:', response.data.acceptInvitation);
        }
      })
    );
  }

  declineInvitation(invitationId: string): Observable<any> {
    return this.declineInvitationGQL.mutate({ invitationId }).pipe(
      tap(() => {
        console.log('Invitation declined');
      })
    );
  }

  getCurrentTeam(): Observable<any> {
    return this.currentTeamSubject.asObservable();
  }
}
