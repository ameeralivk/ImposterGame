// import { useGameState } from "@/hooks/useGameState";
// import { WordDisplay } from "@/components/WordDisplay";
// import { GameTimer } from "@/components/GameTimer";
// import { PlayerGrid } from "@/components/PlayerGrid";
// import { ChatBox } from "@/components/ChatBox";
// import { Button } from "@/components/ui/button";

// export const GameScreen = () => {
//   const { room, currentPlayer, messages, sendMessage } = useGameState();
//   const { castVote } = useGameState();

//   if (!room || !currentPlayer) return null;

//   const isThief = currentPlayer.id === room.thiefId;

//   const handleTimeUp = () => {
//     // Auto-transition to voting
//     // In real implementation, this would be server-controlled
//   };

//   return (
//     <div className="min-h-screen p-4 md:p-6">
//       <div className="max-w-6xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="bg-card px-4 py-2 rounded-xl border border-border">
//             <span className="text-sm text-muted-foreground">Round</span>
//             <span className="font-display text-2xl text-primary ml-2">
//               {room.roundNumber}
//             </span>
//           </div>

//           <GameTimer initialTime={60} onTimeUp={handleTimeUp} />

//           <div className="bg-card px-4 py-2 rounded-xl border border-border">
//             <span className="text-sm text-muted-foreground">Players</span>
//             <span className="font-display text-2xl text-primary ml-2">
//               {room.players.length}
//             </span>
//           </div>
//         </div>

//         {/* Word Display */}
//         <WordDisplay
//           word={room.currentWord}
//           category={room.category}
//           isThief={isThief}
//         />

//         {/* Main Content */}
//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Players */}
//           <div className="lg:col-span-2 bg-card rounded-2xl p-4 border-2 border-border">
//             <h3 className="font-display text-lg text-foreground mb-3 flex items-center gap-2">
//               👥 Players
//               <span className="text-sm text-muted-foreground font-nunito">
//                 — Watch for suspicious behavior!
//               </span>
//             </h3>
//             <PlayerGrid
//               players={room.players}
//               currentPlayerId={currentPlayer.id}
//             />
//           </div>

//           {/* Chat */}
//           <div className="h-80 lg:h-auto">
//             <ChatBox
//               messages={messages}
//               players={room.players}
//               onSendMessage={sendMessage}
//             />
//           </div>
//         </div>

//         {/* Vote Button */}
//         <div className="flex justify-center">
//           <Button
//             variant="secondary"
//             size="lg"
//             onClick={() => {
//               useGameState.setState((state) => ({
//                 room: state.room ? { ...state.room, status: 'voting' } : null,
//               }));
//             }}
//           >
//             🗳️ Ready to Vote
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

import { useState } from "react";
import { useGameState } from "@/hooks/useGameState";
import { WordDisplay } from "@/components/WordDisplay";
import { GameTimer } from "@/components/GameTimer";
import { PlayerGrid } from "@/components/PlayerGrid";
import { ChatBox } from "@/components/ChatBox";
import { Button } from "@/components/ui/button";

export const GameScreen = () => {
  const { room, currentPlayer, messages, sendMessage, timer, setTimer } =
    useGameState();

  if (!room || !currentPlayer) return null;

  const isThief = currentPlayer.id === room.thiefId;

  // Local host input for timer
  const [inputTime, setInputTime] = useState(60);
  console.log(timer, "timer is here");
  const handleSetTime = () => {
    // Only host can set the timer
    if (currentPlayer.isHost) {
      setTimer(inputTime); // Update global/shared timer in game state
    }
  };

  const handleTimeUp = () => {
    // Auto-transition to voting
    // Stop timer automatically
    useGameState.setState((state) => ({
      room: state.room ? { ...state.room, status: "voting" } : null,
      timerRunning: false,
    }));
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="bg-card px-4 py-2 rounded-xl border border-border">
            <span className="text-sm text-muted-foreground">Round</span>
            <span className="font-display text-2xl text-primary ml-2">
              {room.roundNumber}
            </span>
          </div>

          {/* Timer Section */}
          <div className="flex flex-col items-center gap-4 p-4 bg-gray-900 rounded-lg shadow-lg w-full max-w-sm mx-auto">
            {/* Host Timer Input */}
            {currentPlayer.isHost && (
              <div className="flex items-center gap-2 w-full">
                <input
                  type="number"
                  min={5}
                  value={inputTime}
                  onChange={(e) => setInputTime(Number(e.target.value))}
                  className="w-24 px-3 py-2 border border-gray-700 rounded-md text-center text-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Seconds"
                />
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm transition"
                  onClick={handleSetTime}
                >
                  Set
                </Button>
              </div>
            )}

            {/* Timer Display for All Players */}
            <div className="mt-2 w-full flex justify-center">
              <GameTimer
                initialTime={timer || 0} // Shared timer from global state
                onTimeUp={handleTimeUp}
                isRunning={room.timerRunning || false} // Controlled by host
              />
            </div>
          </div>

          <div className="bg-card px-4 py-2 rounded-xl border border-border">
            <span className="text-sm text-muted-foreground">Players</span>
            <span className="font-display text-2xl text-primary ml-2">
              {room.players.length}
            </span>
          </div>
        </div>

        {/* Word Display */}
        <WordDisplay
          word={room.currentWord}
          category={room.category}
          isThief={isThief}
        />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Players */}
          <div className="lg:col-span-2 bg-card rounded-2xl p-4 border-2 border-border">
            <h3 className="font-display text-lg text-foreground mb-3 flex items-center gap-2">
              👥 Players
              <span className="text-sm text-muted-foreground font-nunito">
                — Watch for suspicious behavior!
              </span>
            </h3>
            <PlayerGrid
              players={room.players}
              currentPlayerId={currentPlayer.id}
            />
          </div>

          {/* Chat */}
          <div className="h-80 lg:h-auto">
            <ChatBox
              messages={messages}
              players={room.players}
              onSendMessage={sendMessage}
            />
          </div>
        </div>

        {/* Vote Button */}
        <div className="flex justify-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              useGameState.setState((state) => ({
                room: state.room ? { ...state.room, status: "voting" } : null,
              }));
            }}
          >
            🗳️ Ready to Vote
          </Button>
        </div>
      </div>
    </div>
  );
};
