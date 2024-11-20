import { gql } from 'apollo-angular';

export const CREATE_MATCH = gql`
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

export const CREATE_VOTE = gql`
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

export const MATCH_STATUS = gql`
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

export const MATCHES = gql`
  query GetAllMatches {
    getAllMatches {
      id
      team1 {
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
      team2 {
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
      winner {
        id
      }
    }
  }
`;

export const UPDATE_MATCH = gql`
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
