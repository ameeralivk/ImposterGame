import { Player } from "@/types/game";
import { PlayerAvatar } from "./PlayerAvatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PlayerGridProps {
  players: Player[];
  showScores?: boolean;
  revealThief?: boolean;
  onPlayerClick?: (player: Player) => void;
  selectedPlayerId?: string | null;
  currentPlayerId?: string;
}

export const PlayerGrid = ({
  players,
  showScores = false,
  revealThief = false,
  onPlayerClick,
  selectedPlayerId,
  currentPlayerId,
}: PlayerGridProps) => {
  return (
    <ScrollArea className="w-full max-h-64">
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4 p-2">
        {players.map((player, index) => (
          <div
            key={player.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <PlayerAvatar
              player={player}
              size="md"
              showName
              showScore={showScores}
              isThief={player.isThief}
              revealThief={revealThief}
              onClick={
                onPlayerClick && player.id !== currentPlayerId
                  ? () => onPlayerClick(player)
                  : undefined
              }
              selected={selectedPlayerId === player.id}
              hasVoted={player.hasVoted}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
