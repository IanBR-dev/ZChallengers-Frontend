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

export const CREATE_VOTE = gql`
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
