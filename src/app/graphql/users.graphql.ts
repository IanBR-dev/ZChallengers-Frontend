import { gql } from 'apollo-angular';

export const GET_ME = gql`
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

export const GET_AVAILABLE_PLAYERS = gql`
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

export const GET_AVAILABLE_PLAYERS_SUBSCRIPTION = gql`
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

export const DISCONNECT = gql`
  mutation Disconnect {
    disconnect
  }
`;
