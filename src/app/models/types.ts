export interface Credentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Player;
}

export interface Player {
  id: string;
  username: string;
  rank: string;
  avatar: string;
  email?: string;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  captain: Player;
}

export interface TeamChallenge {
  id: string;
  fromTeam: Team;
  toTeam: Team;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: Date;
}

export interface Invitation {
  id: string;
  from: Player;
  timestamp: Date;
}

export interface QueueMatch {
  player1: Player;
  player2: Player;
  timestamp: Date;
}

export interface MatchResult {
  winner: Team;
  loser: Team;
  timestamp: Date;
}

export interface Vote {
  fromPlayer: Player;
  forPlayer: Player;
}
