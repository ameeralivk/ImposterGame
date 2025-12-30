// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import cors from "cors";

// /* ------------------ TYPES ------------------ */

// type Player = {
//   id: string;
//   name: string;
//   avatar: string;
//   color: string;
//   score: number;
//   isHost: boolean;
//   vote?: string;
//   isThief?: boolean;
// };

// type Room = {
//   code: string;
//   status: "waiting" | "playing" | "voting" | "results";
//   players: Player[];
//   category?: string;
//   currentWord?: string;
//   round: number;
//   thiefId?: string;
// };

// /* ------------------ SETUP ------------------ */

// const app = express();
// app.use(cors());

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// const PORT = 4000;

// /* ------------------ DATA ------------------ */

// const rooms: Record<string, Room> = {};

// const AVATARS = ["🎅", "🦌", "⛄", "🎄", "🎁", "🧦"];
// const COLORS = ["red", "green", "blue", "yellow", "purple", "orange"];

// const WORDS: Record<string, string[]> = {
//   Animals: ["Lion", "Tiger", "Elephant"],
//   Movies: ["Titanic", "Avatar", "Inception"],
//   Food: ["Pizza", "Burger", "Pasta"],
// };

// /* ------------------ HELPERS ------------------ */

// const generateRoomCode = () => {
//   const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
//   return Array.from(
//     { length: 6 },
//     () => chars[Math.floor(Math.random() * chars.length)]
//   ).join("");
// };

// const randomItem = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

// /* ------------------ SOCKET LOGIC ------------------ */

// io.on("connection", (socket) => {
//   console.log("🔌 Connected:", socket.id);

//   /* CREATE ROOM */
//   socket.on("createRoom", ({ playerName }, callback) => {
//     const roomCode = generateRoomCode();

//     const player: Player = {
//       id: socket.id,
//       name: playerName,
//       avatar: randomItem(AVATARS),
//       color: randomItem(COLORS),
//       score: 0,
//       isHost: true,
//     };

//     const room: Room = {
//       code: roomCode,
//       status: "waiting",
//       players: [player],
//       round: 1,
//     };

//     rooms[roomCode] = room;
//     socket.join(roomCode);

//     io.to(roomCode).emit("roomUpdate", room);
//     callback(room, player);
//   });

//   /* JOIN ROOM */
//   socket.on("joinRoom", ({ roomCode, playerName }, callback) => {
//     const room = rooms[roomCode];

//     if (!room) {
//       return callback({ error: "Room not found" });
//     }

//     const player: Player = {
//       id: socket.id,
//       name: playerName,
//       avatar: randomItem(AVATARS),
//       color: randomItem(COLORS),
//       score: 0,
//       isHost: false,
//     };

//     room.players.push(player);
//     socket.join(roomCode);

//     io.to(roomCode).emit("roomUpdate", room);
//     callback(room, player);
//   });
//   socket.on("startGame", ({ roomCode, category }) => {
//     const room = rooms[roomCode];
//     if (!room) return;

//     const wordsForCategory = WORDS[category];
//     if (!wordsForCategory || wordsForCategory.length === 0) {
//       console.log(`Category "${category}" not found or empty!`);
//       return;
//     }

//     room.status = "playing"; // ✅ important
//     room.category = category;
//     room.currentWord = randomItem(wordsForCategory);

//     // Pick one player as thief
//     const players = room.players;
//     const thiefIndex = Math.floor(Math.random() * players.length);
//     players.forEach((p, i) => (p.isThief = i === thiefIndex));
//     room.thiefId = players[thiefIndex].id;

//     io.to(roomCode).emit("roomUpdate", room);
//     console.log(
//       `Game started in room ${roomCode} with thief ${players[thiefIndex].name}`
//     );
//   });

//   /* SUBMIT VOTE */
//   socket.on("castVote", ({ roomCode, votedPlayerId }) => {
//     const room = rooms[roomCode];
//     if (!room) return;

//     const voter = room.players.find((p) => p.id === socket.id);
//     if (!voter) return;

//     voter.vote = votedPlayerId;

//     const allVoted = room.players.every((p) => p.vote);
//     if (allVoted) {
//       room.status = "results";
//       calculateResults(room);
//       io.to(roomCode).emit("roomUpdate", room);
//     }
//   });

//   /* DISCONNECT */
//   socket.on("disconnect", () => {
//     console.log("❌ Disconnected:", socket.id);

//     for (const roomCode in rooms) {
//       const room = rooms[roomCode];
//       room.players = room.players.filter((p) => p.id !== socket.id);

//       if (room.players.length === 0) {
//         delete rooms[roomCode];
//       } else {
//         io.to(roomCode).emit("roomUpdate", room);
//       }
//     }
//   });
// });

// /* ------------------ RESULTS ------------------ */

// function calculateResults(room: Room) {
//   const votes: Record<string, number> = {};

//   room.players.forEach((p) => {
//     if (p.vote) {
//       votes[p.vote] = (votes[p.vote] || 0) + 1;
//     }
//   });

//   const maxVotes = Math.max(...Object.values(votes));

//   room.players.forEach((player) => {
//     if (votes[player.id] === maxVotes) {
//       player.score += 1;
//     }
//     delete player.vote;
//   });
// }

// /* ------------------ START SERVER ------------------ */

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

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
  isThief?: boolean;
};

type Message = {
  id: string;
  name: string;
  content: string;
  timestamp: string;
};

type Room = {
  code: string;
  status: "waiting" | "playing" | "voting" | "results";
  players: Player[];
  category?: string;
  currentWord?: string;
  round: number;
  thiefId?: string;
  messages: Message[];
};

/* ------------------ SETUP ------------------ */

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
app.get("/", (req, res) => {
  res.send("ready");
});
/* ------------------ DATA ------------------ */

const rooms: Record<string, Room> = {};

const AVATARS = ["🎅", "🦌", "⛄", "🎄", "🎁", "🧦"];
const COLORS = ["red", "green", "blue", "yellow", "purple", "orange"];
export const WORDS: Record<string, string[]> = {
  animals: [
    "Lion",
    "Elephant",
    "Penguin",
    "Dolphin",
    "Giraffe",
    "Koala",
    "Octopus",
    "Butterfly",
  ],

  movies: [
    "Titanic",
    "Avatar",
    "Inception",
    "Frozen",
    "Matrix",
    "Shrek",
    "Joker",
    "Gladiator",
  ],

  countries: [
    "Japan",
    "Brazil",
    "Egypt",
    "Canada",
    "Australia",
    "Italy",
    "Mexico",
    "India",
  ],

  food: [
    "Pizza",
    "Sushi",
    "Taco",
    "Burger",
    "Pasta",
    "Curry",
    "Ramen",
    "Croissant",
  ],

  sports: [
    "Soccer",
    "Tennis",
    "Basketball",
    "Swimming",
    "Golf",
    "Volleyball",
    "Boxing",
    "Surfing",
  ],

  toys: [
    "Lego",
    "Barbie",
    "Puzzle",
    "Yo-yo",
    "Frisbee",
    "Kite",
    "Teddy Bear",
    "Rubik's Cube",
  ],
};

/* ------------------ HELPERS ------------------ */

const generateRoomCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

const randomItem = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

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
      isHost: true,
    };

    const room: Room = {
      code: roomCode,
      status: "waiting",
      players: [player],
      round: 1,
      messages: [],
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
      isHost: false,
    };

    room.players.push(player);
    socket.join(roomCode);

    io.to(roomCode).emit("roomUpdate", room);
    callback(room, player);
  });

  /* START GAME */
  // socket.on("startGame", ({ roomCode, category, word }) => {
  //   console.log(word, "word");
  //   const room = rooms[roomCode];
  //   if (!room) return;
  //   console.log(category, "cat");
  //   const wordsForCategory = WORDS[category];
  //   if (!wordsForCategory || wordsForCategory.length === 0) {
  //     console.log(`Category "${category}" not found or empty!`);
  //     return;
  //   }
  //   room.status = "playing";
  //   room.category = category;
  //   room.currentWord = randomItem(wordsForCategory);

  //   // Pick one player as thief
  //   const players = room.players;
  //   const thiefIndex = Math.floor(Math.random() * players.length);
  //   players.forEach((p, i) => (p.isThief = i === thiefIndex));
  //   room.thiefId = players[thiefIndex].id;
  //   io.to(roomCode).emit("roomUpdate", room);
  //   console.log(
  //     `Game started in room ${roomCode} with thief ${players[thiefIndex].name}`
  //   );
  // });

  socket.on("startGame", ({ roomCode, category, word }) => {
  console.log(word, "word");

  const room = rooms[roomCode];
  if (!room) return;

  console.log(category, "cat");

  const wordsForCategory = WORDS[category];
  if (!wordsForCategory || wordsForCategory.length === 0) {
    console.log(`Category "${category}" not found or empty!`);
    return;
  }

  // ✅ ADD: check word and use it
  if (word && wordsForCategory.includes(word)) {
    room.currentWord = word;
  } else {
    room.currentWord = randomItem(wordsForCategory);
  }

  room.status = "playing";
  room.category = category;

  // Pick one player as thief
  const players = room.players;
  const thiefIndex = Math.floor(Math.random() * players.length);
  players.forEach((p, i) => (p.isThief = i === thiefIndex));
  room.thiefId = players[thiefIndex].id;

  // ✅ ADD: send word to non-thief players only
  players.forEach((player) => {
    if (!player.isThief) {
      io.to(player.id).emit("wordAssigned", room.currentWord);
    }
  });

  io.to(roomCode).emit("roomUpdate", room);

  console.log(
    `Game started in room ${roomCode} with word "${room.currentWord}"`
  );
});


  /* SEND MESSAGE */
  socket.on("sendMessage", ({ roomCode, content }, callback) => {
    const room = rooms[roomCode];
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;

    const message: Message = {
      id: socket.id,
      name: player.name,
      content,
      timestamp: new Date().toISOString(),
    };

    room.messages.push(message);

    io.to(roomCode).emit("newMessage", message);
    if (callback) callback(message);
  });

  /* CAST VOTE */
  socket.on("castVote", ({ roomCode, votedPlayerId }) => {
    const room = rooms[roomCode];
    if (!room) return;

    const voter = room.players.find((p) => p.id === socket.id);
    if (!voter) return;

    voter.vote = votedPlayerId;

    const allVoted = room.players.every((p) => p.vote);
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
      room.players = room.players.filter((p) => p.id !== socket.id);

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

  room.players.forEach((p) => {
    if (p.vote) {
      votes[p.vote] = (votes[p.vote] || 0) + 1;
    }
  });

  const maxVotes = Math.max(...Object.values(votes));

  room.players.forEach((player) => {
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

// hey there my name is sidhique 
