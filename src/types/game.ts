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
  status: "waiting" | "playing" | "voting" | "results";
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

export const CATEGORIES = [
  {
    id: "animals",
    name: "Animals",
    emoji: "🐾",
    words: [
      "Lion",
      "Elephant",
      "Penguin",
      "Dolphin",
      "Giraffe",
      "Koala",
      "Octopus",
      "Butterfly",
    ],
  },
  {
    id: "movies",
    name: "Movies",
    emoji: "🎬",
    words: [
      "Titanic",
      "Avatar",
      "Inception",
      "Frozen",
      "Matrix",
      "Shrek",
      "Joker",
      "Gladiator",
    ],
  },
  {
    id: "countries",
    name: "Countries",
    emoji: "🌍",
    words: [
      "Japan",
      "Brazil",
      "Egypt",
      "Canada",
      "Australia",
      "Italy",
      "Mexico",
      "India",
    ],
  },
  {
    id: "food",
    name: "Food",
    emoji: "🍕",
    words: [
      "Pizza",
      "Sushi",
      "Taco",
      "Burger",
      "Pasta",
      "Curry",
      "Ramen",
      "Croissant",
    ],
  },
  {
    id: "sports",
    name: "Sports",
    emoji: "⚽",
    words: [
      "Soccer",
      "Tennis",
      "Basketball",
      "Swimming",
      "Golf",
      "Volleyball",
      "Boxing",
      "Surfing",
    ],
  },
  {
    id: "toys",
    name: "Toys",
    emoji: "🧸",
    words: [
      "Lego",
      "Barbie",
      "Puzzle",
      "Yo-yo",
      "Frisbee",
      "Kite",
      "Teddy Bear",
      "Rubik's Cube",
    ],
  },
];

export const PLAYER_COLORS = [
  "hsl(174 72% 56%)", // cyan
  "hsl(340 82% 65%)", // pink
  "hsl(45 93% 58%)", // yellow
  "hsl(270 70% 60%)", // purple
  "hsl(142 70% 50%)", // green
  "hsl(25 95% 60%)", // orange
  "hsl(200 80% 60%)", // blue
  "hsl(0 80% 60%)", // red
  "hsl(60 80% 55%)", // lime
  "hsl(300 70% 60%)", // magenta
];

export const AVATARS = [
  "😎",
  "🤠",
  "🥳",
  "😈",
  "🤓",
  "🦊",
  "🐸",
  "🦄",
  "🐱",
  "🐶",
  "🐼",
  "🦁",
  "🐯",
  "🐨",
  "🐵",
  "🦉",
];
