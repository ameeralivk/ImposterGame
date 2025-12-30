// // server/index.ts
// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import { Room, Player } from "./types/game";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// interface RoomData extends Room {
//   players: Player[];
// }

// const rooms: Record<string, RoomData> = {};

// io.on("connection", (socket) => {
//   console.log("New client:", socket.id);

//   socket.on("createRoom", ({ playerName }, callback) => {
//     const roomCode = generateRoomCode();
//     const playerId = socket.id;

//     const player: Player = {
//       id: playerId,
//       name: playerName,
//       avatar: "😎", // choose randomly
//       color: "blue",
//       score: 0,
//       isHost: true,
//       isThief: false,
//       hasVoted: false,
//       votedFor: null,
//     };

//     const room: RoomData = {
//       id: generateId(),
//       code: roomCode,
//       hostId: playerId,
//       players: [player],
//       status: "waiting",
//       currentWord: null,
//       category: null,
//       roundNumber: 0,
//       roundTimeLeft: 60,
//       thiefId: null,
//       votes: {},
//     };

//     rooms[roomCode] = room;
//     socket.join(roomCode);
//     callback(room, player);
//   });

//   socket.on("joinRoom", ({ roomCode, playerName }, callback) => {
//     const room = rooms[roomCode];
//     if (!room) return callback(null, null);

//     const player: Player = {
//       id: socket.id,
//       name: playerName,
//       avatar: "🐱",
//       color: "red",
//       score: 0,
//       isHost: false,
//       isThief: false,
//       hasVoted: false,
//       votedFor: null,
//     };

//     room.players.push(player);
//     socket.join(roomCode);
//     io.to(roomCode).emit("roomUpdate", room); // broadcast to all
//     callback(room, player);
//   });

//   socket.on("startGame", ({ roomCode, category, word }, callback) => {
//     const room = rooms[roomCode];
//     if (!room) return;

//     // Only host can start
//     if (room.hostId !== socket.id) return;

//     room.status = "playing"; // 🔥 THIS TRIGGERS GameScreen
//     room.category = category;
//     room.currentWord = word;
//     room.roundNumber += 1;

//     // Reset player round state
//     room.players.forEach((player) => {
//       player.isThief = false;
//       player.hasVoted = false;
//       player.votedFor = null;
//     });
//     console.log("ROOM STATUS:", room?.status);

//     // Pick thief randomly
//     const randomIndex = Math.floor(Math.random() * room.players.length);
//     room.thiefId = room.players[randomIndex].id;
//     room.players[randomIndex].isThief = true;

//     io.to(roomCode).emit("roomUpdate", room); // 🔥 broadcast update

//     callback?.(room);
//   });

//   socket.on("leaveRoom", ({ roomCode }) => {
//     const room = rooms[roomCode];
//     if (!room) return;

//     room.players = room.players.filter((p) => p.id !== socket.id);

//     // If host leaves, assign new host
//     if (room.hostId === socket.id && room.players.length > 0) {
//       room.players[0].isHost = true;
//       room.hostId = room.players[0].id;
//     }

//     if (room.players.length === 0) {
//       delete rooms[roomCode];
//     } else {
//       io.to(roomCode).emit("roomUpdate", room);
//     }

//     socket.leave(roomCode);
//   });

//   socket.on("sendMessage", ({ roomCode, content }) => {
//     const room = rooms[roomCode];
//     if (!room) return;

//     const message = {
//       id: generateId(),
//       playerId: socket.id,
//       playerName:
//         room.players.find((p) => p.id === socket.id)?.name || "Unknown",
//       content,
//       timestamp: Date.now(),
//     };

//     io.to(roomCode).emit("newMessage", message);
//   });

//   // Add startGame, castVote, nextRound, endRound similar to above
// });

// server.listen(400, () => console.log("Server running on port 4000"));

// // Helpers
// const generateRoomCode = () => "ABC123"; // simplified for demo
// const generateId = () => Math.random().toString(36).substring(2, 10);

// server/index.ts
// import express from "express";
// import http from "http";
// import { Server, Socket } from "socket.io";
// import { Room, Player } from "./types/game";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// // Extend Room to include players
// interface RoomData extends Room {
//   players: Player[];
// }

// // In-memory rooms store
// const rooms: Record<string, RoomData> = {};

// // Socket.IO connection
// io.on("connection", (socket: Socket) => {
//   console.log("New client:", socket.id);

//   // Create room
//   socket.on(
//     "createRoom",
//     (
//       { playerName }: { playerName: string },
//       callback: (room: RoomData, player: Player) => void
//     ) => {
//       const roomCode = generateRoomCode();
//       const playerId = socket.id;

//       const player: Player = {
//         id: playerId,
//         name: playerName,
//         avatar: "😎",
//         color: "blue",
//         score: 0,
//         isHost: true,
//         isThief: false,
//         hasVoted: false,
//         votedFor: null,
//       };

//       const room: RoomData = {
//         id: generateId(),
//         code: roomCode,
//         hostId: playerId,
//         players: [player],
//         status: "waiting",
//         currentWord: null,
//         category: null,
//         roundNumber: 0,
//         roundTimeLeft: 60,
//         thiefId: null,
//         votes: {},
//       };

//       rooms[roomCode] = room;
//       socket.join(roomCode);
//       callback(room, player);
//     }
//   );

//   // Join room
//   socket.on(
//     "joinRoom",
//     (
//       { roomCode, playerName }: { roomCode: string; playerName: string },
//       callback: (room: RoomData | null, player: Player | null) => void
//     ) => {
//       const room = rooms[roomCode];
//       if (!room) return callback(null, null);

//       const player: Player = {
//         id: socket.id,
//         name: playerName,
//         avatar: "🐱",
//         color: "red",
//         score: 0,
//         isHost: false,
//         isThief: false,
//         hasVoted: false,
//         votedFor: null,
//       };

//       room.players.push(player);
//       socket.join(roomCode);
//       io.to(roomCode).emit("roomUpdate", room);
//       callback(room, player);
//     }
//   );

//   // Start game
//   socket.on(
//     "startGame",
//     (
//       { roomCode, category, word }: { roomCode: string; category: string; word: string },
//       callback?: (room: RoomData) => void
//     ) => {
//       const room = rooms[roomCode];
//       if (!room) return;
//       if (room.hostId !== socket.id) return; // only host can start

//       room.status = "playing";
//       room.category = category;
//       room.currentWord = word;
//       room.roundNumber += 1;

//       room.players.forEach((player) => {
//         player.isThief = false;
//         player.hasVoted = false;
//         player.votedFor = null;
//       });

//       // Pick thief randomly
//       const randomIndex = Math.floor(Math.random() * room.players.length);
//       room.thiefId = room.players[randomIndex].id;
//       room.players[randomIndex].isThief = true;

//       io.to(roomCode).emit("roomUpdate", room);
//       callback?.(room);
//     }
//   );

//   // Leave room
//   socket.on(
//     "leaveRoom",
//     ({ roomCode }: { roomCode: string }) => {
//       const room = rooms[roomCode];
//       if (!room) return;

//       room.players = room.players.filter((p) => p.id !== socket.id);

//       // Assign new host if needed
//       if (room.hostId === socket.id && room.players.length > 0) {
//         room.players[0].isHost = true;
//         room.hostId = room.players[0].id;
//       }

//       if (room.players.length === 0) {
//         delete rooms[roomCode];
//       } else {
//         io.to(roomCode).emit("roomUpdate", room);
//       }

//       socket.leave(roomCode);
//     }
//   );

//   // Send message
//   socket.on(
//     "sendMessage",
//     ({ roomCode, content }: { roomCode: string; content: string }) => {
//       const room = rooms[roomCode];
//       if (!room) return;

//       const message = {
//         id: generateId(),
//         playerId: socket.id,
//         playerName: room.players.find((p) => p.id === socket.id)?.name || "Unknown",
//         content,
//         timestamp: Date.now(),
//       };

//       io.to(roomCode).emit("newMessage", message);
//     }
//   );

//   // Add other events (castVote, nextRound, endRound) with similar typing if needed
// });

// // Start server
// server.listen(4000, () => console.log("Server running on port 4000"));

// // Helpers
// const generateRoomCode = () => "ABC123"; // simplify for demo
// const generateId = () => Math.random().toString(36).substring(2, 10);


import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

/* ------------------ TYPES ------------------ */

type Player = {
  id: string;
  name: string;
  avatar: string;
  color: string;
  score: number;
  isHost: boolean;
  vote?: string;
};

type Room = {
  code: string;
  status: "waiting" | "playing" | "voting" | "results";
  players: Player[];
  category?: string;
  currentWord?: string;
  round: number;
};

/* ------------------ SETUP ------------------ */

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const PORT = 4000;

/* ------------------ DATA ------------------ */

const rooms: Record<string, Room> = {};

const AVATARS = ["🎅", "🦌", "⛄", "🎄", "🎁", "🧦"];
const COLORS = ["red", "green", "blue", "yellow", "purple", "orange"];

const WORDS: Record<string, string[]> = {
  Animals: ["Lion", "Tiger", "Elephant"],
  Movies: ["Titanic", "Avatar", "Inception"],
  Food: ["Pizza", "Burger", "Pasta"]
};

/* ------------------ HELPERS ------------------ */

const generateRoomCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

const randomItem = <T>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

/* ------------------ SOCKET LOGIC ------------------ */

io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  /* CREATE ROOM */
  socket.on("createRoom", ({ playerName }, callback) => {
    const roomCode = generateRoomCode();

    const player: Player = {
      id: socket.id,
      name: playerName,
      avatar: randomItem(AVATARS),
      color: randomItem(COLORS),
      score: 0,
      isHost: true
    };

    const room: Room = {
      code: roomCode,
      status: "waiting",
      players: [player],
      round: 1
    };

    rooms[roomCode] = room;
    socket.join(roomCode);

    io.to(roomCode).emit("roomUpdate", room);
    callback(room, player);
  });

  /* JOIN ROOM */
  socket.on("joinRoom", ({ roomCode, playerName }, callback) => {
    const room = rooms[roomCode];

    if (!room) {
      return callback({ error: "Room not found" });
    }

    const player: Player = {
      id: socket.id,
      name: playerName,
      avatar: randomItem(AVATARS),
      color: randomItem(COLORS),
      score: 0,
      isHost: false
    };

    room.players.push(player);
    socket.join(roomCode);

    io.to(roomCode).emit("roomUpdate", room);
    callback(room, player);
  });

  /* START GAME */
  socket.on("startGame", ({ roomCode, category }) => {
    const room = rooms[roomCode];
    if (!room) return;

    room.status = "playing";
    room.category = category;
    room.currentWord = randomItem(WORDS[category]);

    io.to(roomCode).emit("roomUpdate", room);
  });

  /* SUBMIT VOTE */
  socket.on("castVote", ({ roomCode, votedPlayerId }) => {
    const room = rooms[roomCode];
    if (!room) return;

    const voter = room.players.find(p => p.id === socket.id);
    if (!voter) return;

    voter.vote = votedPlayerId;

    const allVoted = room.players.every(p => p.vote);
    if (allVoted) {
      room.status = "results";
      calculateResults(room);
      io.to(roomCode).emit("roomUpdate", room);
    }
  });

  /* DISCONNECT */
  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);

    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      room.players = room.players.filter(p => p.id !== socket.id);

      if (room.players.length === 0) {
        delete rooms[roomCode];
      } else {
        io.to(roomCode).emit("roomUpdate", room);
      }
    }
  });
});

/* ------------------ RESULTS ------------------ */

function calculateResults(room: Room) {
  const votes: Record<string, number> = {};

  room.players.forEach(p => {
    if (p.vote) {
      votes[p.vote] = (votes[p.vote] || 0) + 1;
    }
  });

  const maxVotes = Math.max(...Object.values(votes));

  room.players.forEach(player => {
    if (votes[player.id] === maxVotes) {
      player.score += 1;
    }
    delete player.vote;
  });
}

/* ------------------ START SERVER ------------------ */

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
