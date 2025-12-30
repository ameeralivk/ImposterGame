// import { create } from 'zustand';
// import { Player, Room, GameMessage, PLAYER_COLORS, AVATARS, CATEGORIES } from '@/types/game';

// interface GameState {
//   room: Room | null;
//   currentPlayer: Player | null;
//   messages: GameMessage[];

//   // Actions
//   createRoom: (playerName: string) => void;
//   joinRoom: (roomCode: string, playerName: string) => boolean;
//   leaveRoom: () => void;
//   startGame: (category: string, word: string) => void;
//   sendMessage: (content: string) => void;
//   castVote: (targetId: string) => void;
//   nextRound: () => void;
//   endRound: () => void;
// }

// const generateRoomCode = () => {
//   const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
//   return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
// };

// const generateId = () => Math.random().toString(36).substring(2, 15);

// export const useGameState = create<GameState>((set, get) => ({
//   room: null,
//   currentPlayer: null,
//   messages: [],

//   createRoom: (playerName: string) => {
//     const playerId = generateId();
//     const roomCode = generateRoomCode();

//     const player: Player = {
//       id: playerId,
//       name: playerName,
//       avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
//       color: PLAYER_COLORS[0],
//       score: 0,
//       isHost: true,
//       isThief: false,
//       hasVoted: false,
//       votedFor: null,
//     };

//     const room: Room = {
//       id: generateId(),
//       code: roomCode,
//       hostId: playerId,
//       players: [player],
//       status: 'waiting',
//       currentWord: null,
//       category: null,
//       roundNumber: 0,
//       roundTimeLeft: 60,
//       thiefId: null,
//       votes: {},
//     };

//     set({ room, currentPlayer: player, messages: [] });
//   },

//   joinRoom: (roomCode: string, playerName: string) => {
//     const { room } = get();

//     // For demo, we'll simulate joining
//     if (!room || room.code !== roomCode.toUpperCase()) {
//       // Create a demo room for testing
//       const playerId = generateId();

//       const player: Player = {
//         id: playerId,
//         name: playerName,
//         avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
//         color: PLAYER_COLORS[1],
//         score: 0,
//         isHost: false,
//         isThief: false,
//         hasVoted: false,
//         votedFor: null,
//       };

//       // Simulate other players
//       const existingPlayers: Player[] = [
//         {
//           id: 'host-1',
//           name: 'GameMaster',
//           avatar: '🤠',
//           color: PLAYER_COLORS[0],
//           score: 0,
//           isHost: true,
//           isThief: false,
//           hasVoted: false,
//           votedFor: null,
//         },
//         {
//           id: 'bot-1',
//           name: 'CoolCat',
//           avatar: '😎',
//           color: PLAYER_COLORS[2],
//           score: 0,
//           isHost: false,
//           isThief: false,
//           hasVoted: false,
//           votedFor: null,
//         },
//         {
//           id: 'bot-2',
//           name: 'NinjaPanda',
//           avatar: '🐼',
//           color: PLAYER_COLORS[3],
//           score: 0,
//           isHost: false,
//           isThief: false,
//           hasVoted: false,
//           votedFor: null,
//         },
//       ];

//       const newRoom: Room = {
//         id: generateId(),
//         code: roomCode.toUpperCase(),
//         hostId: 'host-1',
//         players: [...existingPlayers, player],
//         status: 'waiting',
//         currentWord: null,
//         category: null,
//         roundNumber: 0,
//         roundTimeLeft: 60,
//         thiefId: null,
//         votes: {},
//       };

//       set({ room: newRoom, currentPlayer: player, messages: [] });
//       return true;
//     }

//     // Add to existing room
//     const playerId = generateId();
//     const colorIndex = room.players.length % PLAYER_COLORS.length;

//     const player: Player = {
//       id: playerId,
//       name: playerName,
//       avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
//       color: PLAYER_COLORS[colorIndex],
//       score: 0,
//       isHost: false,
//       isThief: false,
//       hasVoted: false,
//       votedFor: null,
//     };

//     set({
//       room: { ...room, players: [...room.players, player] },
//       currentPlayer: player,
//     });

//     return true;
//   },

//   leaveRoom: () => {
//     set({ room: null, currentPlayer: null, messages: [] });
//   },

//   startGame: (category: string, word: string) => {
//     const { room } = get();
//     if (!room) return;

//     // Randomly select thief
//     const thiefIndex = Math.floor(Math.random() * room.players.length);
//     const thiefId = room.players[thiefIndex].id;

//     const updatedPlayers = room.players.map((p, idx) => ({
//       ...p,
//       isThief: idx === thiefIndex,
//       hasVoted: false,
//       votedFor: null,
//     }));

//     set({
//       room: {
//         ...room,
//         status: 'playing',
//         currentWord: word,
//         category,
//         roundNumber: room.roundNumber + 1,
//         roundTimeLeft: 60,
//         thiefId,
//         players: updatedPlayers,
//         votes: {},
//       },
//       messages: [],
//     });
//   },

//   sendMessage: (content: string) => {
//     const { currentPlayer, messages } = get();
//     if (!currentPlayer) return;

//     const message: GameMessage = {
//       id: generateId(),
//       playerId: currentPlayer.id,
//       playerName: currentPlayer.name,
//       content,
//       timestamp: Date.now(),
//     };

//     set({ messages: [...messages, message] });
//   },

//   castVote: (targetId: string) => {
//     const { room, currentPlayer } = get();
//     if (!room || !currentPlayer) return;

//     const updatedPlayers = room.players.map(p =>
//       p.id === currentPlayer.id
//         ? { ...p, hasVoted: true, votedFor: targetId }
//         : p
//     );

//     const updatedVotes = { ...room.votes, [currentPlayer.id]: targetId };

//     set({
//       room: {
//         ...room,
//         players: updatedPlayers,
//         votes: updatedVotes,
//       },
//     });

//     // Check if all players voted
//     if (Object.keys(updatedVotes).length === room.players.length) {
//       get().endRound();
//     }
//   },

//   endRound: () => {
//     const { room } = get();
//     if (!room) return;

//     // Calculate votes
//     const voteCounts: Record<string, number> = {};
//     Object.values(room.votes).forEach(targetId => {
//       voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
//     });

//     // Find who got most votes
//     let maxVotes = 0;
//     let mostVotedId = '';
//     Object.entries(voteCounts).forEach(([id, count]) => {
//       if (count > maxVotes) {
//         maxVotes = count;
//         mostVotedId = id;
//       }
//     });

//     // Update scores
//     const thiefCaught = mostVotedId === room.thiefId;
//     const updatedPlayers = room.players.map(p => {
//       let scoreChange = 0;
//       if (p.isThief && !thiefCaught) {
//         scoreChange = 3; // Thief escaped
//       } else if (!p.isThief && thiefCaught) {
//         scoreChange = 2; // Correctly identified thief
//       } else if (!p.isThief && p.votedFor === room.thiefId) {
//         scoreChange = 1; // Voted for thief even if not majority
//       }
//       return { ...p, score: p.score + scoreChange };
//     });

//     set({
//       room: {
//         ...room,
//         status: 'results',
//         players: updatedPlayers,
//       },
//     });
//   },

//   nextRound: () => {
//     const { room } = get();
//     if (!room) return;

//     const resetPlayers = room.players.map(p => ({
//       ...p,
//       isThief: false,
//       hasVoted: false,
//       votedFor: null,
//     }));

//     set({
//       room: {
//         ...room,
//         status: 'waiting',
//         currentWord: null,
//         category: null,
//         thiefId: null,
//         players: resetPlayers,
//         votes: {},
//       },
//       messages: [],
//     });
//   },
// }));

// import { create } from 'zustand';
// import { io, Socket } from 'socket.io-client';
// import { Room, Player, GameMessage } from '@/types/game';

// interface GameState {
//   socket: Socket | null;
//   room: Room | null;
//   currentPlayer: Player | null;
//   messages: GameMessage[];

//   createRoom: (playerName: string) => void;
//   joinRoom: (roomCode: string, playerName: string) => void;
//   sendMessage: (content: string) => void;
//   castVote: (targetId: string) => void;
//   startGame: (category: string, word: string) => void;
//   leaveRoom: () => void; // ✅ ADDED
// }

// export const useGameState = create<GameState>((set, get) => ({
//   socket: null,
//   room: null,
//   currentPlayer: null,
//   messages: [],

//   createRoom: (playerName) => {
//     const socket = io('http://localhost:4000');
//     set({ socket });

//     socket.emit('createRoom', { playerName }, (room: Room, player: Player) => {
//       set({ room, currentPlayer: player, messages: [] });
//     });

//     socket.on('roomUpdate', (room: Room) => set({ room }));
//     socket.on('newMessage', (message: GameMessage) => {
//       set(state => ({ messages: [...state.messages, message] }));
//     });
//   },

//   joinRoom: (roomCode, playerName) => {
//     const socket = io('http://localhost:4000');
//     set({ socket });

//     socket.emit(
//       'joinRoom',
//       { roomCode, playerName },
//       (room: Room, player: Player) => {
//         if (!room || !player) {
//           alert('Room not found!');
//           return;
//         }
//         set({ room, currentPlayer: player });
//       }
//     );

//     socket.on('roomUpdate', (room: Room) => set({ room }));
//     socket.on('newMessage', (message: GameMessage) => {
//       set(state => ({ messages: [...state.messages, message] }));
//     });
//   },

//   sendMessage: (content) => {
//     const { socket, room } = get();
//     if (!socket || !room) return;
//     socket.emit('sendMessage', { roomCode: room.code, content });
//   },

//   startGame: (category, word) => {
//     const { socket, room } = get();
//     if (!socket || !room) return;
//     socket.emit('startGame', { roomCode: room.code, category, word });
//   },

//   castVote: (targetId) => {
//     const { socket, room } = get();
//     if (!socket || !room) return;
//     socket.emit('castVote', { roomCode: room.code, targetId });
//   },

//   // ✅ NEW FUNCTION
//   leaveRoom: () => {
//     const { socket, room } = get();

//     if (socket && room) {
//       socket.emit('leaveRoom', { roomCode: room.code });
//       socket.disconnect();
//     }

//     set({
//       socket: null,
//       room: null,
//       currentPlayer: null,
//       messages: [],
//     });
//   },
// }));

// import { create } from "zustand";
// import { io, Socket } from "socket.io-client";
// import { Room, Player, GameMessage } from "@/types/game";

// interface GameState {
//   socket: Socket | null;
//   room: Room | null;
//   currentPlayer: Player | null;
//   messages: GameMessage[];

//   createRoom: (playerName: string) => void;
//   joinRoom: (roomCode: string, playerName: string) => void;
//   sendMessage: (content: string) => void;
//   castVote: (targetId: string) => void;
//   startGame: (category: string, word: string) => void;
//   leaveRoom: () => void;
// }

// export const useGameState = create<GameState>((set, get) => {
//   // 🔥 SINGLE SOCKET INSTANCE
//   let socket: Socket | null = null;

//   // 🔥 INIT SOCKET ONLY ONCE
//   const initSocket = () => {
//     if (socket) return socket;

//     socket = io("http://localhost:4000", {
//       transports: ["websocket"],
//     });

//     socket.on("roomUpdate", (room: Room) => {
//       console.log("ROOM UPDATE:", room.status);
//       set({ room });
//     });

//     socket.on("newMessage", (message: GameMessage) => {
//       set((state) => ({
//         messages: [...state.messages, message],
//       }));
//     });

//     socket.on("disconnect", () => {
//       console.warn("Socket disconnected");
//     });

//     return socket;
//   };

//   return {
//     socket: null,
//     room: null,
//     currentPlayer: null,
//     messages: [],

//     /* ---------- CREATE ROOM ---------- */
//     createRoom: (playerName) => {
//       const s = initSocket();
//       set({ socket: s });

//       s.emit("createRoom", { playerName }, (room: Room, player: Player) => {
//         set({
//           room,
//           currentPlayer: player,
//           messages: [],
//         });
//       });
//     },

//     /* ---------- JOIN ROOM ---------- */
//     joinRoom: (roomCode, playerName) => {
//       const s = initSocket();
//       set({ socket: s });

//       s.emit(
//         "joinRoom",
//         { roomCode, playerName },
//         (room: Room, player: Player) => {
//           if (!room || !player) {
//             alert("Room not found");
//             return;
//           }
//           set({ room, currentPlayer: player });
//         }
//       );
//     },

//     /* ---------- START GAME ---------- */
//     startGame: (category, word) => {
//       const { room } = get();
//       if (!socket || !room) return;

//       console.log("START GAME EMIT");
//       socket.emit("startGame", {
//         roomCode: room.code,
//         category,
//         word,
//       });
//     },

//     /* ---------- SEND MESSAGE ---------- */
//     sendMessage: (content) => {
//       const { room } = get();
//       if (!socket || !room) return;

//       socket.emit("sendMessage", {
//         roomCode: room.code,
//         content,
//       });
//     },

//     /* ---------- CAST VOTE ---------- */
//     castVote: (targetId) => {
//       const { room } = get();
//       if (!socket || !room) return;

//       socket.emit("castVote", {
//         roomCode: room.code,
//         targetId,
//       });
//     },

//     /* ---------- LEAVE ROOM ---------- */
//     leaveRoom: () => {
//       const { room } = get();

//       if (socket && room) {
//         socket.emit("leaveRoom", { roomCode: room.code });
//         socket.disconnect();
//       }

//       socket = null;

//       set({
//         socket: null,
//         room: null,
//         currentPlayer: null,
//         messages: [],
//       });
//     },
//   };
// });

import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { Room, Player, GameMessage } from "@/types/game";

interface GameState {
  socket: Socket | null;
  room: Room | null;
  currentPlayer: Player | null;
  messages: GameMessage[];

  createRoom: (playerName: string) => void;
  joinRoom: (roomCode: string, playerName: string) => void;
  startGame: (category: string, word: string) => void;
  sendMessage: (content: string) => void;
  castVote: (targetId: string) => void;
  leaveRoom: () => void;
  nextRound?: () => void;
}

export const useGameState = create<GameState>((set, get) => {
  // 🔹 Singleton socket
  let socket: Socket | null = null;

  const initSocket = () => {
    if (socket) return socket;

    socket = io("http://localhost:4000", { transports: ["websocket"] });

    socket.on("roomUpdate", (room: Room) => {
      console.log("ROOM UPDATE:", room.status);
      set({ room });
    });

    socket.on("newMessage", (msg: GameMessage) => {
      console.log(msg, "message received");
      set((state) => ({ messages: [...state.messages, msg] }));
    });

    socket.on("disconnect", () => {
      console.warn("Socket disconnected");
    });

    return socket;
  };

  return {
    socket: null,
    room: null,
    currentPlayer: null,
    messages: [],

    // ---------- CREATE ROOM ----------
    createRoom: (playerName) => {
      const s = initSocket();
      set({ socket: s });

      s.emit("createRoom", { playerName }, (room: Room, player: Player) => {
        set({ room, currentPlayer: player, messages: [] });
      });
    },

    // ---------- JOIN ROOM ----------
    joinRoom: (roomCode, playerName) => {
      const s = initSocket();
      set({ socket: s });

      s.emit(
        "joinRoom",
        { roomCode, playerName },
        (room: Room, player: Player) => {
          if (!room || !player) {
            alert("Room not found");
            return;
          }
          set({ room, currentPlayer: player });
        }
      );
    },

    // ---------- START GAME ----------
    startGame: (category, word) => {
      const { room } = get();
      if (!socket || !room) return;

      console.log("START GAME EMIT");

      // Optimistically update room status so UI navigates immediately
      set({
        room: {
          ...room,
          status: "playing",
          category,
          currentWord: word,
        },
      });

      socket.emit("startGame", { roomCode: room.code, category, word });
    },

    // ---------- SEND MESSAGE ----------
    // sendMessage: (content) => {
    //   const { room } = get();
    //   console.log(content, "ameer ready");
    //   if (!socket || !room) return;

    //   socket.emit("newMessage", { roomCode: room.code, content });
    // },
    sendMessage: (content) => {
      const { room } = get();
      console.log(content, "ameer ready");
      if (!socket || !room) return;

      socket.emit("sendMessage", { roomCode: room.code, content });
    },

    // ---------- CAST VOTE ----------
    castVote: (targetId) => {
      const { room } = get();
      if (!socket || !room) return;

      socket.emit("castVote", { roomCode: room.code, targetId });
    },

    // ---------- LEAVE ROOM ----------
    leaveRoom: () => {
      const { room } = get();

      if (socket && room) {
        socket.emit("leaveRoom", { roomCode: room.code });
        // Do NOT disconnect socket globally; leave for next room join
      }

      set({
        socket: null,
        room: null,
        currentPlayer: null,
        messages: [],
      });

      socket = null;
    },
  };
});
