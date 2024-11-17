import { gql } from 'apollo-angular';

export const PENDING_INVITATIONS = gql`
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

export const INVITE_PLAYER = gql`
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

export const ACCEPT_INVITATION = gql`
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

export const DECLINE_INVITATION = gql`
  mutation DeclineInvitation($invitationId: String!) {
    declineInvitation(invitationId: $invitationId) {
      id
      status
    }
  }
`;

export const INVITATION_SUBSCRIPTION = gql`
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
