import { gql } from 'apollo-angular';

export const JOIN_QUEUE = gql`
  mutation JoinQueue {
    joinQueue
  }
`;

export const LEAVE_QUEUE = gql`
  mutation LeaveQueue {
    leaveQueue
  }
`;

export const TEAM_FOUND_SUBSCRIPTION = gql`
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
