import { useGameState } from "@/hooks/useGameState";
import { VotingPanel } from "@/components/VotingPanel";
import { ChatBox } from "@/components/ChatBox";

export const VotingScreen = () => {
  const { room, currentPlayer, castVote, messages, sendMessage } = useGameState();

  if (!room || !currentPlayer) return null;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-4xl text-gradient-secondary mb-2">
            VOTING TIME
          </h1>
          <p className="text-muted-foreground">
            Round {room.roundNumber}
          </p>
        </div>

        {/* Voting Panel */}
        <VotingPanel
          players={room.players}
          currentPlayerId={currentPlayer.id}
          onVote={castVote}
          hasVoted={currentPlayer.hasVoted}
        />

        {/* Chat */}
        <div className="h-64">
          <ChatBox
            messages={messages}
            players={room.players}
            onSendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};
