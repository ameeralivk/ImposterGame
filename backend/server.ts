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
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { Room, Player } from "./types/game";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Extend Room to include players
interface RoomData extends Room {
  players: Player[];
}

// In-memory rooms store
const rooms: Record<string, RoomData> = {};

// Socket.IO connection
io.on("connection", (socket: Socket) => {
  console.log("New client:", socket.id);

  // Create room
  socket.on(
    "createRoom",
    (
      { playerName }: { playerName: string },
      callback: (room: RoomData, player: Player) => void
    ) => {
      const roomCode = generateRoomCode();
      const playerId = socket.id;

      const player: Player = {
        id: playerId,
        name: playerName,
        avatar: "😎",
        color: "blue",
        score: 0,
        isHost: true,
        isThief: false,
        hasVoted: false,
        votedFor: null,
      };

      const room: RoomData = {
        id: generateId(),
        code: roomCode,
        hostId: playerId,
        players: [player],
        status: "waiting",
        currentWord: null,
        category: null,
        roundNumber: 0,
        roundTimeLeft: 60,
        thiefId: null,
        votes: {},
      };

      rooms[roomCode] = room;
      socket.join(roomCode);
      callback(room, player);
    }
  );

  // Join room
  socket.on(
    "joinRoom",
    (
      { roomCode, playerName }: { roomCode: string; playerName: string },
      callback: (room: RoomData | null, player: Player | null) => void
    ) => {
      const room = rooms[roomCode];
      if (!room) return callback(null, null);

      const player: Player = {
        id: socket.id,
        name: playerName,
        avatar: "🐱",
        color: "red",
        score: 0,
        isHost: false,
        isThief: false,
        hasVoted: false,
        votedFor: null,
      };

      room.players.push(player);
      socket.join(roomCode);
      io.to(roomCode).emit("roomUpdate", room);
      callback(room, player);
    }
  );

  // Start game
  socket.on(
    "startGame",
    (
      { roomCode, category, word }: { roomCode: string; category: string; word: string },
      callback?: (room: RoomData) => void
    ) => {
      const room = rooms[roomCode];
      if (!room) return;
      if (room.hostId !== socket.id) return; // only host can start

      room.status = "playing";
      room.category = category;
      room.currentWord = word;
      room.roundNumber += 1;

      room.players.forEach((player) => {
        player.isThief = false;
        player.hasVoted = false;
        player.votedFor = null;
      });

      // Pick thief randomly
      const randomIndex = Math.floor(Math.random() * room.players.length);
      room.thiefId = room.players[randomIndex].id;
      room.players[randomIndex].isThief = true;

      io.to(roomCode).emit("roomUpdate", room);
      callback?.(room);
    }
  );

  // Leave room
  socket.on(
    "leaveRoom",
    ({ roomCode }: { roomCode: string }) => {
      const room = rooms[roomCode];
      if (!room) return;

      room.players = room.players.filter((p) => p.id !== socket.id);

      // Assign new host if needed
      if (room.hostId === socket.id && room.players.length > 0) {
        room.players[0].isHost = true;
        room.hostId = room.players[0].id;
      }

      if (room.players.length === 0) {
        delete rooms[roomCode];
      } else {
        io.to(roomCode).emit("roomUpdate", room);
      }

      socket.leave(roomCode);
    }
  );

  // Send message
  socket.on(
    "sendMessage",
    ({ roomCode, content }: { roomCode: string; content: string }) => {
      const room = rooms[roomCode];
      if (!room) return;

      const message = {
        id: generateId(),
        playerId: socket.id,
        playerName: room.players.find((p) => p.id === socket.id)?.name || "Unknown",
        content,
        timestamp: Date.now(),
      };

      io.to(roomCode).emit("newMessage", message);
    }
  );

  // Add other events (castVote, nextRound, endRound) with similar typing if needed
});

// Start server
server.listen(4000, () => console.log("Server running on port 4000"));

// Helpers
const generateRoomCode = () => "ABC123"; // simplify for demo
const generateId = () => Math.random().toString(36).substring(2, 10);
