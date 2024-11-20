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
  expiresAt: Scalars['DateTime']['output'];
  from: User;
  id: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  to: User;
};

export type LoginInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Match = {
  team1?: Maybe<Team>;
  team1Snapshot?: Maybe<TeamSnapshotType>;
  team2?: Maybe<Team>;
  team2Snapshot?: Maybe<TeamSnapshotType>;
  votes?: Maybe<Array<Vote>>;
  winner?: Maybe<Team>;
  winnerSnapshot?: Maybe<TeamSnapshotType>;
};

export type MatchType = {
  id: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  team1: TeamType;
  team1Snapshot?: Maybe<TeamSnapshotType>;
  team2: TeamType;
  team2Snapshot?: Maybe<TeamSnapshotType>;
  votes?: Maybe<Array<VoteType>>;
  winner?: Maybe<TeamType>;
  winnerSnapshot?: Maybe<TeamSnapshotType>;
};

export type Mutation = {
  acceptInvitation: Scalars['Boolean']['output'];
  createMatch: MatchType;
  createTeam: TeamType;
  createVote: VoteType;
  declineInvitation: Scalars['Boolean']['output'];
  disconnect: Scalars['Boolean']['output'];
  invitePlayer: InvitationType;
  joinQueue: Scalars['Boolean']['output'];
  leaveQueue: Scalars['Boolean']['output'];
  leftTeam: Scalars['Boolean']['output'];
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
  currentTeam: TeamType;
  getAllMatches: Array<MatchType>;
  getAvailablePlayers: Array<UserType>;
  getAvailableTeams: Array<TeamType>;
  getMyMatch?: Maybe<MatchType>;
  me: UserType;
  pendingInvitations: Array<InvitationType>;
};

export type RegisterInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Subscription = {
  availablePlayer: UserType;
  availableTeam: TeamType;
  invitationReceived: InvitationType;
  matchStatus: MatchType;
  teamFound: TeamType;
};

export type Team = {
  captain: User;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  players: Array<User>;
  status: Scalars['String']['output'];
};

export type TeamSnapshotCaptain = {
  id: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type TeamSnapshotPlayer = {
  avatar?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  rank?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};

export type TeamSnapshotType = {
  captain: TeamSnapshotCaptain;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  players: Array<TeamSnapshotPlayer>;
  status: Scalars['String']['output'];
};

export type TeamType = {
  captain: UserType;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  players: Array<UserType>;
  status: Scalars['String']['output'];
};

export type UpdateMatchInput = {
  matchId: Scalars['ID']['input'];
  winnerId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateTeamInput = {
  captainId?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  playerIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  teamId: Scalars['ID']['input'];
};

export type User = {
  avatar: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  match?: Maybe<Match>;
  rank: Scalars['String']['output'];
  team?: Maybe<Team>;
  username: Scalars['String']['output'];
};

export type UserType = {
  avatar: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  rank: Scalars['String']['output'];
  status: Scalars['String']['output'];
  team?: Maybe<TeamType>;
  username: Scalars['String']['output'];
};

export type Vote = {
  createdAt: Scalars['DateTime']['output'];
  forPlayer: User;
  fromPlayer: User;
};

export type VoteInput = {
  forPlayerId: Scalars['ID']['input'];
  matchId: Scalars['ID']['input'];
};

export type VoteType = {
  forPlayer: UserType;
  fromPlayer: UserType;
  id: Scalars['ID']['output'];
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { login: { token: string, user: { id: string, username: string, rank: string, avatar: string } } };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { register: { token: string, user: { id: string, username: string, rank: string, avatar: string } } };

export type PendingInvitationsQueryVariables = Exact<{ [key: string]: never; }>;


export type PendingInvitationsQuery = { pendingInvitations: Array<{ id: string, status: string, expiresAt: any, from: { id: string, username: string, rank: string, avatar: string }, to: { id: string, username: string, avatar: string } }> };

export type InvitePlayerMutationVariables = Exact<{
  playerId: Scalars['String']['input'];
}>;


export type InvitePlayerMutation = { invitePlayer: { id: string, status: string, expiresAt: any, from: { id: string, username: string }, to: { id: string, username: string } } };

export type AcceptInvitationMutationVariables = Exact<{
  invitationId: Scalars['String']['input'];
}>;


export type AcceptInvitationMutation = { acceptInvitation: boolean };

export type DeclineInvitationMutationVariables = Exact<{
  invitationId: Scalars['String']['input'];
}>;


export type DeclineInvitationMutation = { declineInvitation: boolean };

export type InvitationReceivedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type InvitationReceivedSubscription = { invitationReceived: { id: string, status: string, expiresAt: any, from: { id: string, username: string, avatar: string }, to: { id: string, username: string, avatar: string } } };

export type CreateMatchMutationVariables = Exact<{
  input: CreateMatchInput;
}>;


export type CreateMatchMutation = { createMatch: { id: string, status: string, team1: { id: string, name: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string } }, team2: { id: string, name: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string } } } };

export type CreateVoteMutationVariables = Exact<{
  input: VoteInput;
}>;


export type CreateVoteMutation = { createVote: { id: string, fromPlayer: { id: string, username: string }, forPlayer: { id: string, username: string } } };

export type MatchStatusSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MatchStatusSubscription = { matchStatus: { id: string, status: string, team1: { id: string, name: string, status: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string } }, team2: { id: string, name: string, status: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string } }, winner?: { id: string } | null, votes?: Array<{ fromPlayer: { id: string }, forPlayer: { id: string } }> | null } };

export type GetAllMatchesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllMatchesQuery = { getAllMatches: Array<{ id: string, status: string, team1Snapshot?: { id: string, name: string, players: Array<{ id: string, username: string, avatar?: string | null }>, captain: { id: string } } | null, team2Snapshot?: { id: string, name: string, players: Array<{ id: string, username: string, avatar?: string | null }>, captain: { id: string } } | null, winnerSnapshot?: { id: string } | null }> };

export type UpdateMatchMutationVariables = Exact<{
  input: UpdateMatchInput;
}>;


export type UpdateMatchMutation = { updateMatch: { id: string, status: string, team1: { id: string, name: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string } }, team2: { id: string, name: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string } } } };

export type GetMyMatchQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyMatchQuery = { getMyMatch?: { id: string, status: string, team1: { id: string, name: string, status: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string } }, team2: { id: string, name: string, status: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string } }, winner?: { id: string } | null, votes?: Array<{ fromPlayer: { id: string }, forPlayer: { id: string } }> | null } | null };

export type JoinQueueMutationVariables = Exact<{ [key: string]: never; }>;


export type JoinQueueMutation = { joinQueue: boolean };

export type LeaveQueueMutationVariables = Exact<{ [key: string]: never; }>;


export type LeaveQueueMutation = { leaveQueue: boolean };

export type TeamFoundSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TeamFoundSubscription = { teamFound: { id: string, name: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string } } };

export type CreateTeamMutationVariables = Exact<{
  input: CreateTeamInput;
}>;


export type CreateTeamMutation = { createTeam: { id: string, name: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string } } };

export type CurrentTeamQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentTeamQuery = { currentTeam: { id: string, name: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string } } };

export type GetAvailableTeamsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAvailableTeamsQuery = { getAvailableTeams: Array<{ id: string, name: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string } }> };

export type UpdateTeamMutationVariables = Exact<{
  input: UpdateTeamInput;
}>;


export type UpdateTeamMutation = { updateTeam: { id: string, name: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string } } };

export type AvailableTeamSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type AvailableTeamSubscription = { availableTeam: { id: string, name: string, status: string, players: Array<{ id: string, username: string, rank: string, avatar: string }>, captain: { id: string } } };

export type LeftTeamMutationVariables = Exact<{ [key: string]: never; }>;


export type LeftTeamMutation = { leftTeam: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, username: string, rank: string, avatar: string, team?: { id: string, name: string, captain: { id: string }, players: Array<{ id: string, avatar: string, username: string, rank: string }> } | null } };

export type GetAvailablePlayersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAvailablePlayersQuery = { getAvailablePlayers: Array<{ id: string, username: string, rank: string, avatar: string, status: string }> };

export type AvailablePlayerSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type AvailablePlayerSubscription = { availablePlayer: { id: string, username: string, rank: string, avatar: string, status: string } };

export type DisconnectMutationVariables = Exact<{ [key: string]: never; }>;


export type DisconnectMutation = { disconnect: boolean };

export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      id
      username
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
      avatar
    }
    status
    expiresAt
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
    expiresAt
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
  acceptInvitation(invitationId: $invitationId)
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
  declineInvitation(invitationId: $invitationId)
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
      avatar
    }
    to {
      id
      username
      avatar
    }
    status
    expiresAt
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
      captain {
        id
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
      captain {
        id
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
export const MatchStatusDocument = gql`
    subscription MatchStatus {
  matchStatus {
    id
    status
    team1 {
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
      }
      status
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
      captain {
        id
      }
      status
    }
    winner {
      id
    }
    votes {
      fromPlayer {
        id
      }
      forPlayer {
        id
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MatchStatusGQL extends Apollo.Subscription<MatchStatusSubscription, MatchStatusSubscriptionVariables> {
    override document = MatchStatusDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAllMatchesDocument = gql`
    query GetAllMatches {
  getAllMatches {
    id
    team1Snapshot {
      id
      name
      players {
        id
        username
        avatar
      }
      captain {
        id
      }
    }
    team2Snapshot {
      id
      name
      players {
        id
        username
        avatar
      }
      captain {
        id
      }
    }
    status
    winnerSnapshot {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAllMatchesGQL extends Apollo.Query<GetAllMatchesQuery, GetAllMatchesQueryVariables> {
    override document = GetAllMatchesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateMatchDocument = gql`
    mutation UpdateMatch($input: UpdateMatchInput!) {
  updateMatch(input: $input) {
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
      captain {
        id
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
      captain {
        id
      }
    }
    status
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateMatchGQL extends Apollo.Mutation<UpdateMatchMutation, UpdateMatchMutationVariables> {
    override document = UpdateMatchDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetMyMatchDocument = gql`
    query GetMyMatch {
  getMyMatch {
    id
    status
    team1 {
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
      }
      status
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
      captain {
        id
      }
      status
    }
    winner {
      id
    }
    votes {
      fromPlayer {
        id
      }
      forPlayer {
        id
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetMyMatchGQL extends Apollo.Query<GetMyMatchQuery, GetMyMatchQueryVariables> {
    override document = GetMyMatchDocument;
    
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
export const TeamFoundDocument = gql`
    subscription TeamFound {
  teamFound {
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
    }
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
export const CurrentTeamDocument = gql`
    query CurrentTeam {
  currentTeam {
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
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CurrentTeamGQL extends Apollo.Query<CurrentTeamQuery, CurrentTeamQueryVariables> {
    override document = CurrentTeamDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAvailableTeamsDocument = gql`
    query GetAvailableTeams {
  getAvailableTeams {
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
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAvailableTeamsGQL extends Apollo.Query<GetAvailableTeamsQuery, GetAvailableTeamsQueryVariables> {
    override document = GetAvailableTeamsDocument;
    
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
export const AvailableTeamDocument = gql`
    subscription AvailableTeam {
  availableTeam {
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
    }
    status
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AvailableTeamGQL extends Apollo.Subscription<AvailableTeamSubscription, AvailableTeamSubscriptionVariables> {
    override document = AvailableTeamDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LeftTeamDocument = gql`
    mutation LeftTeam {
  leftTeam
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LeftTeamGQL extends Apollo.Mutation<LeftTeamMutation, LeftTeamMutationVariables> {
    override document = LeftTeamDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MeDocument = gql`
    query Me {
  me {
    id
    username
    rank
    avatar
    team {
      id
      name
      captain {
        id
      }
      players {
        id
        avatar
        username
        rank
      }
    }
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
export const GetAvailablePlayersDocument = gql`
    query getAvailablePlayers {
  getAvailablePlayers {
    id
    username
    rank
    avatar
    status
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAvailablePlayersGQL extends Apollo.Query<GetAvailablePlayersQuery, GetAvailablePlayersQueryVariables> {
    override document = GetAvailablePlayersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AvailablePlayerDocument = gql`
    subscription AvailablePlayer {
  availablePlayer {
    id
    username
    rank
    avatar
    status
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AvailablePlayerGQL extends Apollo.Subscription<AvailablePlayerSubscription, AvailablePlayerSubscriptionVariables> {
    override document = AvailablePlayerDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DisconnectDocument = gql`
    mutation Disconnect {
  disconnect
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DisconnectGQL extends Apollo.Mutation<DisconnectMutation, DisconnectMutationVariables> {
    override document = DisconnectDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }