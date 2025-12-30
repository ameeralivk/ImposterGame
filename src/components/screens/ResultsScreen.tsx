import { useGameState } from "@/hooks/useGameState";
import { ResultsPanel } from "@/components/ResultsPanel";

export const ResultsScreen = () => {
  const { room, currentPlayer, nextRound } = useGameState();

  if (!room || !currentPlayer) return null;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-4xl text-gradient-primary mb-2">
            ROUND {room.roundNumber} RESULTS
          </h1>
        </div>

        {/* Results */}
        <ResultsPanel
          players={room.players}
          thiefId={room.thiefId}
          word={room.currentWord}
          votes={room.votes}
          isHost={currentPlayer.isHost}
          onNextRound={nextRound}
        />
      </div>
    </div>
  );
};
