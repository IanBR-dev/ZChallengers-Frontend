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
        players {
          id
        }
      }
      votes {
        fromPlayer {
          id
        }
        forPlayer {
          id
        }
      }
      mostVotedPlayer {
        id
        username
        avatar
      }
    }
  }
`;

export const ALL_MATCH_STATUS = gql`
  subscription getAllMatchStatus {
    getAllMatchStatus {
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
      winner {
        id
        players {
          id
        }
      }
      votes {
        fromPlayer {
          id
        }
        forPlayer {
          id
        }
      }
      mostVotedPlayer {
        id
        username
        avatar
      }
    }
  }
`;

export const MATCHES = gql`
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

export const MY_MATCH = gql`
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
