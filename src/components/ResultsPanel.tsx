import { Button } from "@/components/ui/button";
import { Player } from "@/types/game";
import { PlayerAvatar } from "./PlayerAvatar";

interface ResultsPanelProps {
  players: Player[];
  thiefId: string | null;
  word: string | null;
  votes: Record<string, string>;
  isHost: boolean;
  onNextRound: () => void;
}

export const ResultsPanel = ({
  players,
  thiefId,
  word,
  votes,
  isHost,
  onNextRound,
}: ResultsPanelProps) => {
  const thief = players.find((p) => p.id === thiefId);
  
  // Count votes
  const voteCounts: Record<string, number> = {};
  Object.values(votes).forEach((targetId) => {
    voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
  });

  const maxVotes = Math.max(...Object.values(voteCounts), 0);
  const mostVotedId = Object.entries(voteCounts).find(([_, count]) => count === maxVotes)?.[0];
  const thiefCaught = mostVotedId === thiefId;

  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Result Banner */}
      <div className="text-center">
        <div
          className={`inline-block px-8 py-6 rounded-2xl border-4 ${
            thiefCaught
              ? "bg-game-green/20 border-game-green"
              : "bg-destructive/20 border-destructive"
          }`}
        >
          <div className="font-display text-4xl mb-2">
            {thiefCaught ? "🎉 THIEF CAUGHT!" : "😈 THIEF ESCAPED!"}
          </div>
          <p className="text-muted-foreground">
            {thiefCaught
              ? "Great detective work!"
              : `The thief blended in perfectly!`}
          </p>
        </div>
      </div>

      {/* Reveal Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* The Thief */}
        <div className="bg-card rounded-2xl p-6 border-2 border-destructive/50">
          <h3 className="font-display text-xl text-destructive mb-4 text-center">
            🦹 The Thief Was...
          </h3>
          {thief && (
            <div className="flex flex-col items-center">
              <PlayerAvatar player={thief} size="lg" showName isThief revealThief />
            </div>
          )}
        </div>

        {/* The Word */}
        <div className="bg-card rounded-2xl p-6 border-2 border-primary/50">
          <h3 className="font-display text-xl text-primary mb-4 text-center">
            📝 The Word Was...
          </h3>
          <div className="text-center">
            <span className="font-display text-4xl text-gradient-primary">
              {word}
            </span>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-card rounded-2xl p-6 border-2 border-border">
        <h3 className="font-display text-2xl text-accent mb-6 text-center">
          🏆 Leaderboard
        </h3>
        <div className="space-y-3">
          {sortedPlayers.slice(0, 5).map((player, index) => (
            <div
              key={player.id}
              className="flex items-center gap-4 bg-muted/50 rounded-xl p-3"
            >
              <span className="font-display text-2xl w-8 text-center">
                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
              </span>
              <PlayerAvatar player={player} size="sm" showName={false} />
              <span className="font-bold flex-1">{player.name}</span>
              <span className="font-display text-xl text-accent">
                {player.score} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Round Button */}
      {isHost && (
        <div className="flex justify-center">
          <Button variant="game" size="xl" onClick={onNextRound}>
            🎮 Next Round
          </Button>
        </div>
      )}

      {!isHost && (
        <p className="text-center text-muted-foreground">
          Waiting for host to start next round...
        </p>
      )}
    </div>
  );
};
