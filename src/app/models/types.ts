import { MatchStatus } from '../generated/graphql';

export interface Credentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Player;
}

export interface Player {
  id?: string;
  username: string;
  rank?: string;
  avatar?: string;
  email?: string; // Opcional porque no siempre se usa
  team?: Team | null; // Referencia al equipo actual del jugador
}
export interface Team {
  id: string;
  name: string;
  players: Player[];
  captain: Pick<Player, 'id'>; // Solo incluye las propiedades devueltas por el backend
  status?: string;
}

export interface TeamChallenge {
  id: string;
  fromTeam: Team; // Equipo que emite el desafío
  toTeam: Team; // Equipo desafiado
  status: 'pending' | 'accepted' | 'declined'; // Estado del desafío
  timestamp: Date; // Hora de creación del desafío
}

export interface Invitation {
  id: string;
  from: Player; // El backend devuelve todos los campos de "Player" para "from"
  to: Player; // Solo incluye las propiedades devueltas por el backend
  status: string; // Cambiar a "string" si no puedes garantizar los valores fijos
  createdAt: Date; // Mantener como Date
}

export interface QueueMatch {
  id: string; // ID único del emparejamiento
  status: 'pending' | 'accepted' | 'declined'; // Estado del emparejamiento
  player1: Player; // Primer jugador emparejado
  player2: Player; // Segundo jugador emparejado
  timestamp: Date; // Hora del emparejamiento
}

export interface MatchResult {
  id: string; // ID único del resultado del partido
  winner: Team; // Equipo ganador
  loser: Team; // Equipo perdedor
  timestamp: Date; // Hora del partido
}

export interface Vote {
  fromPlayer: Pick<Player, 'id'>; // Jugador que emitió el voto
  forPlayer: Pick<Player, 'id'>; // Jugador que recibió el voto
}

export interface Match {
  id: string; // ID único del partido
  status: MatchStatus; // Estado del partido
  team1: Team; // Equipo 1
  team2: Team; // Equipo 2
  votes?: Voted[] | null; // Votos emitidos
  winner?: { id: string } | null; // Equipo ganador
}

interface Voted {
  forPlayer: Pick<Player, 'id'>;
  fromPlayer: Pick<Player, 'id'>;
}
