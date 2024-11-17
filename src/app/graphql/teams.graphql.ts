import { gql } from 'apollo-angular';

export const CREATE_TEAM = gql`
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

export const UPDATE_TEAM = gql`
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

export const GET_AVAILABLE_TEAMS = gql`
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