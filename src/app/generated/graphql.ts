import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type AuthResponse = {
  token: Scalars['String']['output'];
  user: UserType;
};

export type CreateMatchInput = {
  team1Id: Scalars['ID']['input'];
  team2Id: Scalars['ID']['input'];
};

export type CreateTeamInput = {
  captainId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  playerIds: Array<Scalars['ID']['input']>;
};

export type InvitationType = {
  createdAt: Scalars['DateTime']['output'];
  from: User;
  id: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  to: User;
};

export type LoginInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export enum MatchStatus {
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING'
}

export type MatchType = {
  id: Scalars['ID']['output'];
  status: MatchStatus;
  team1: TeamType;
  team2: TeamType;
  winner?: Maybe<TeamType>;
};

export type Mutation = {
  acceptInvitation: InvitationType;
  createMatch: MatchType;
  createTeam: TeamType;
  createVote: VoteType;
  declineInvitation: InvitationType;
  invitePlayer: InvitationType;
  joinQueue: Scalars['Boolean']['output'];
  leaveQueue: Scalars['Boolean']['output'];
  login: AuthResponse;
  register: AuthResponse;
  updateMatch: MatchType;
  updateTeam: TeamType;
};


export type MutationAcceptInvitationArgs = {
  invitationId: Scalars['String']['input'];
};


export type MutationCreateMatchArgs = {
  input: CreateMatchInput;
};


export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
};


export type MutationCreateVoteArgs = {
  input: VoteInput;
};


export type MutationDeclineInvitationArgs = {
  invitationId: Scalars['String']['input'];
};


export type MutationInvitePlayerArgs = {
  playerId: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationUpdateMatchArgs = {
  input: UpdateMatchInput;
};


export type MutationUpdateTeamArgs = {
  input: UpdateTeamInput;
};

export type Query = {
  availablePlayers: Array<UserType>;
  availableTeams: Array<TeamType>;
  me: UserType;
  pendingInvitations: Array<InvitationType>;
};

export type QueueMatchType = {
  status: QueueStatus;
  team?: Maybe<TeamType>;
  timestamp: Scalars['DateTime']['output'];
};

export enum QueueStatus {
  Cancelled = 'CANCELLED',
  MatchFound = 'MATCH_FOUND',
  Searching = 'SEARCHING'
}

export type QueueUpdateType = {
  playersInQueue: Scalars['Float']['output'];
  status: QueueStatus;
  timeElapsed: Scalars['Float']['output'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Subscription = {
  invitationReceived: InvitationType;
  matchCompleted: MatchType;
  matchStarted: MatchType;
  queueStatus: QueueUpdateType;
  teamFound: QueueMatchType;
};

export type Team = {
  captain: User;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  players: Array<User>;
};

export type TeamType = {
  captain: UserType;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  players: Array<UserType>;
};

export type UpdateMatchInput = {
  matchId: Scalars['ID']['input'];
  status?: InputMaybe<MatchStatus>;
  winnerId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateTeamInput = {
  captainId?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  playerIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  teamId: Scalars['ID']['input'];
};

export type User = {
  avatar: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  rank: Scalars['String']['output'];
  team?: Maybe<Team>;
  username: Scalars['String']['output'];
};

export type UserType = {
  avatar: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  rank: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type VoteInput = {
  forPlayerId: Scalars['ID']['input'];
  matchId: Scalars['ID']['input'];
};

export type VoteType = {
  forPlayer: UserType;
  fromPlayer: UserType;
  id: Scalars['ID']['output'];
  match: MatchType;
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { login: { token: string, user: { id: string, username: string, email: string, rank: string, avatar: string } } };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { register: { token: string, user: { id: string, username: string, email: string, rank: string, avatar: string } } };

export type PendingInvitationsQueryVariables = Exact<{ [key: string]: never; }>;


export type PendingInvitationsQuery = { pendingInvitations: Array<{ id: string, status: string, createdAt: any, from: { id: string, username: string, rank: string, avatar: string }, to: { id: string, username: string } }> };

export type InvitePlayerMutationVariables = Exact<{
  playerId: Scalars['String']['input'];
}>;


export type InvitePlayerMutation = { invitePlayer: { id: string, status: string, createdAt: any, from: { id: string, username: string }, to: { id: string, username: string } } };

export type AcceptInvitationMutationVariables = Exact<{
  invitationId: Scalars['String']['input'];
}>;


export type AcceptInvitationMutation = { acceptInvitation: { id: string, status: string, from: { id: string, username: string }, to: { id: string, username: string } } };

export type DeclineInvitationMutationVariables = Exact<{
  invitationId: Scalars['String']['input'];
}>;


export type DeclineInvitationMutation = { declineInvitation: { id: string, status: string } };

export type InvitationReceivedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type InvitationReceivedSubscription = { invitationReceived: { id: string, status: string, createdAt: any, from: { id: string, username: string, rank: string, avatar: string }, to: { id: string, username: string } } };

export type CreateMatchMutationVariables = Exact<{
  input: CreateMatchInput;
}>;


export type CreateMatchMutation = { createMatch: { id: string, status: MatchStatus, team1: { id: string, name: string, players: Array<{ id: string, username: string, rank: string, avatar: string }> }, team2: { id: string, name: string, players: Array<{ id: string, username: string, rank: string, avatar: string }> } } };

export type CreateVoteMutationVariables = Exact<{
  input: VoteInput;
}>;


export type CreateVoteMutation = { createVote: { id: string, match: { id: string }, fromPlayer: { id: string, username: string }, forPlayer: { id: string, username: string } } };

export type JoinQueueMutationVariables = Exact<{ [key: string]: never; }>;


export type JoinQueueMutation = { joinQueue: boolean };

export type LeaveQueueMutationVariables = Exact<{ [key: string]: never; }>;


export type LeaveQueueMutation = { leaveQueue: boolean };

export type QueueStatusSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type QueueStatusSubscription = { queueStatus: { status: QueueStatus, timeElapsed: number, playersInQueue: number } };

export type TeamFoundSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TeamFoundSubscription = { teamFound: { status: QueueStatus, timestamp: any, team?: { id: string, name: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string, username: string } } | null } };

export type CreateTeamMutationVariables = Exact<{
  input: CreateTeamInput;
}>;


export type CreateTeamMutation = { createTeam: { id: string, name: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string, username: string } } };

export type UpdateTeamMutationVariables = Exact<{
  input: UpdateTeamInput;
}>;


export type UpdateTeamMutation = { updateTeam: { id: string, name: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string, username: string } } };

export type AvailableTeamsQueryVariables = Exact<{ [key: string]: never; }>;


export type AvailableTeamsQuery = { availableTeams: Array<{ id: string, name: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string, username: string } }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, username: string, email: string, rank: string, avatar: string } };

export type AvailablePlayersQueryVariables = Exact<{ [key: string]: never; }>;


export type AvailablePlayersQuery = { availablePlayers: Array<{ id: string, username: string, email: string, rank: string, avatar: string }> };

export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      id
      username
      email
      rank
      avatar
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoginGQL extends Apollo.Mutation<LoginMutation, LoginMutationVariables> {
    override document = LoginDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RegisterDocument = gql`
    mutation Register($input: RegisterInput!) {
  register(input: $input) {
    token
    user {
      id
      username
      email
      rank
      avatar
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RegisterGQL extends Apollo.Mutation<RegisterMutation, RegisterMutationVariables> {
    override document = RegisterDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const PendingInvitationsDocument = gql`
    query PendingInvitations {
  pendingInvitations {
    id
    from {
      id
      username
      rank
      avatar
    }
    to {
      id
      username
    }
    status
    createdAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PendingInvitationsGQL extends Apollo.Query<PendingInvitationsQuery, PendingInvitationsQueryVariables> {
    override document = PendingInvitationsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InvitePlayerDocument = gql`
    mutation InvitePlayer($playerId: String!) {
  invitePlayer(playerId: $playerId) {
    id
    from {
      id
      username
    }
    to {
      id
      username
    }
    status
    createdAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InvitePlayerGQL extends Apollo.Mutation<InvitePlayerMutation, InvitePlayerMutationVariables> {
    override document = InvitePlayerDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AcceptInvitationDocument = gql`
    mutation AcceptInvitation($invitationId: String!) {
  acceptInvitation(invitationId: $invitationId) {
    id
    from {
      id
      username
    }
    to {
      id
      username
    }
    status
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AcceptInvitationGQL extends Apollo.Mutation<AcceptInvitationMutation, AcceptInvitationMutationVariables> {
    override document = AcceptInvitationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeclineInvitationDocument = gql`
    mutation DeclineInvitation($invitationId: String!) {
  declineInvitation(invitationId: $invitationId) {
    id
    status
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeclineInvitationGQL extends Apollo.Mutation<DeclineInvitationMutation, DeclineInvitationMutationVariables> {
    override document = DeclineInvitationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InvitationReceivedDocument = gql`
    subscription InvitationReceived {
  invitationReceived {
    id
    from {
      id
      username
      rank
      avatar
    }
    to {
      id
      username
    }
    status
    createdAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InvitationReceivedGQL extends Apollo.Subscription<InvitationReceivedSubscription, InvitationReceivedSubscriptionVariables> {
    override document = InvitationReceivedDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateMatchDocument = gql`
    mutation CreateMatch($input: CreateMatchInput!) {
  createMatch(input: $input) {
    id
    team1 {
      id
      name
      players {
        id
        username
        rank
        avatar
      }
    }
    team2 {
      id
      name
      players {
        id
        username
        rank
        avatar
      }
    }
    status
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateMatchGQL extends Apollo.Mutation<CreateMatchMutation, CreateMatchMutationVariables> {
    override document = CreateMatchDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateVoteDocument = gql`
    mutation CreateVote($input: VoteInput!) {
  createVote(input: $input) {
    id
    match {
      id
    }
    fromPlayer {
      id
      username
    }
    forPlayer {
      id
      username
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateVoteGQL extends Apollo.Mutation<CreateVoteMutation, CreateVoteMutationVariables> {
    override document = CreateVoteDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const JoinQueueDocument = gql`
    mutation JoinQueue {
  joinQueue
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class JoinQueueGQL extends Apollo.Mutation<JoinQueueMutation, JoinQueueMutationVariables> {
    override document = JoinQueueDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LeaveQueueDocument = gql`
    mutation LeaveQueue {
  leaveQueue
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LeaveQueueGQL extends Apollo.Mutation<LeaveQueueMutation, LeaveQueueMutationVariables> {
    override document = LeaveQueueDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const QueueStatusDocument = gql`
    subscription QueueStatus {
  queueStatus {
    status
    timeElapsed
    playersInQueue
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class QueueStatusGQL extends Apollo.Subscription<QueueStatusSubscription, QueueStatusSubscriptionVariables> {
    override document = QueueStatusDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const TeamFoundDocument = gql`
    subscription TeamFound {
  teamFound {
    status
    team {
      id
      name
      players {
        id
        username
        rank
        avatar
      }
      captain {
        id
        username
      }
    }
    timestamp
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class TeamFoundGQL extends Apollo.Subscription<TeamFoundSubscription, TeamFoundSubscriptionVariables> {
    override document = TeamFoundDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateTeamDocument = gql`
    mutation CreateTeam($input: CreateTeamInput!) {
  createTeam(input: $input) {
    id
    name
    players {
      id
      username
      rank
      avatar
    }
    captain {
      id
      username
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateTeamGQL extends Apollo.Mutation<CreateTeamMutation, CreateTeamMutationVariables> {
    override document = CreateTeamDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateTeamDocument = gql`
    mutation UpdateTeam($input: UpdateTeamInput!) {
  updateTeam(input: $input) {
    id
    name
    players {
      id
      username
      rank
      avatar
    }
    captain {
      id
      username
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateTeamGQL extends Apollo.Mutation<UpdateTeamMutation, UpdateTeamMutationVariables> {
    override document = UpdateTeamDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AvailableTeamsDocument = gql`
    query AvailableTeams {
  availableTeams {
    id
    name
    players {
      id
      username
      rank
      avatar
    }
    captain {
      id
      username
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AvailableTeamsGQL extends Apollo.Query<AvailableTeamsQuery, AvailableTeamsQueryVariables> {
    override document = AvailableTeamsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MeDocument = gql`
    query Me {
  me {
    id
    username
    email
    rank
    avatar
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MeGQL extends Apollo.Query<MeQuery, MeQueryVariables> {
    override document = MeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AvailablePlayersDocument = gql`
    query AvailablePlayers {
  availablePlayers {
    id
    username
    email
    rank
    avatar
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AvailablePlayersGQL extends Apollo.Query<AvailablePlayersQuery, AvailablePlayersQueryVariables> {
    override document = AvailablePlayersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }