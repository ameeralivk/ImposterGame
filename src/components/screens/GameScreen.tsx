import { useGameState } from "@/hooks/useGameState";
import { WordDisplay } from "@/components/WordDisplay";
import { GameTimer } from "@/components/GameTimer";
import { PlayerGrid } from "@/components/PlayerGrid";
import { ChatBox } from "@/components/ChatBox";
import { Button } from "@/components/ui/button";

export const GameScreen = () => {
  const { room, currentPlayer, messages, sendMessage } = useGameState();
  const { castVote } = useGameState();

  if (!room || !currentPlayer) return null;

  const isThief = currentPlayer.id === room.thiefId;

  const handleTimeUp = () => {
    // Auto-transition to voting
    // In real implementation, this would be server-controlled
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

          <GameTimer initialTime={60} onTimeUp={handleTimeUp} />

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
                room: state.room ? { ...state.room, status: 'voting' } : null,
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
