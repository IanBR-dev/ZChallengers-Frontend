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
      }
    }
  }
`;

export const GET_CURRENT_TEAM = gql`
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

export const AVAILABLE_TEAMS = gql`
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
      }
    }
  }
`;

export const GET_AVAILABLE_TEAM = gql`
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
