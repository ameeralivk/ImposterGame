// types/game.ts

export interface Player {
  id: string;
  name: string;
  avatar: string;
  color: string;
  score: number;
  isHost: boolean;
  isThief: boolean;
  hasVoted: boolean;
  votedFor: string | null;
}

export interface Room {
  id: string;
  code: string;
  hostId: string;
  players: Player[];
  status: 'waiting' | 'playing' | 'results';
  currentWord: string | null;
  category: string | null;
  roundNumber: number;
  roundTimeLeft: number;
  thiefId: string | null;
  votes: Record<string, string>;
}

export interface GameMessage {
  id: string;
  playerId: string;
  playerName: string;
  content: string;
  timestamp: number;
}

// Optional constants for demo purposes
export const PLAYER_COLORS = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6A4C93'];
export const AVATARS = ['😎', '🐱', '🐼', '🤠'];
export const CATEGORIES = ['Fruits', 'Animals', 'Objects'];
