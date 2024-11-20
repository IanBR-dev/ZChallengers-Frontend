import { gql } from 'apollo-angular';

export const GET_ME = gql`
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

export const GET_AVAILABLE_PLAYERS = gql`
  subscription AvailablePlayers {
    availablePlayers {
      id
      username
      email
      rank
      avatar
    }
  }
`;

export const DISCONNECT = gql`
  mutation Disconnect {
    disconnect
  }
`;
