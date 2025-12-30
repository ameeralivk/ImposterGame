import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Player } from "@/types/game";
import { PlayerAvatar } from "./PlayerAvatar";
import { cn } from "@/lib/utils";

interface VotingPanelProps {
  players: Player[];
  currentPlayerId: string;
  onVote: (targetId: string) => void;
  hasVoted: boolean;
}

export const VotingPanel = ({
  players,
  currentPlayerId,
  onVote,
  hasVoted,
}: VotingPanelProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const otherPlayers = players.filter((p) => p.id !== currentPlayerId);
  const votedCount = players.filter((p) => p.hasVoted).length;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center">
        <h2 className="font-display text-3xl text-gradient-secondary mb-2">
          🔍 Find The Thief!
        </h2>
        <p className="text-muted-foreground">
          {hasVoted
            ? `Waiting for others... (${votedCount}/${players.length})`
            : "Who do you think is the thief?"}
        </p>
      </div>

      {!hasVoted ? (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-w-2xl mx-auto">
            {otherPlayers.map((player) => (
              <div
                key={player.id}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all cursor-pointer",
                  selectedId === player.id
                    ? "border-secondary bg-secondary/20 scale-105"
                    : "border-border hover:border-muted-foreground"
                )}
                onClick={() => setSelectedId(player.id)}
              >
                <PlayerAvatar player={player} size="md" showName />
              </div>
            ))}
          </div>

          {selectedId && (
            <div className="flex justify-center animate-bounce-in">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onVote(selectedId)}
              >
                🗳️ Vote for{" "}
                {players.find((p) => p.id === selectedId)?.name}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-game-green/20 rounded-full border-2 border-game-green">
            <span className="text-2xl">✓</span>
            <span className="font-bold text-game-green">Vote submitted!</span>
          </div>
        </div>
      )}
    </div>
  );
};
