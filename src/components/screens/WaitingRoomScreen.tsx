import { Button } from "@/components/ui/button";
import { useGameState } from "@/hooks/useGameState";
import { RoomCodeDisplay } from "@/components/RoomCodeDisplay";
import { PlayerGrid } from "@/components/PlayerGrid";
import { CategorySelector } from "@/components/CategorySelector";
import { LogOut } from "lucide-react";

export const WaitingRoomScreen = () => {
  const { room, currentPlayer, startGame, leaveRoom } = useGameState();

  if (!room || !currentPlayer) return null;

  const isHost = currentPlayer.isHost;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={leaveRoom} className="gap-2">
            <LogOut className="w-4 h-4" />
            Leave
          </Button>
          <RoomCodeDisplay code={room.code} />
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="font-display text-4xl text-gradient-primary mb-2">
            WAITING ROOM
          </h1>
          <p className="text-muted-foreground">
            {room.players.length} player{room.players.length !== 1 && "s"} in lobby
          </p>
        </div>

        {/* Players */}
        <div className="bg-card rounded-2xl p-6 border-2 border-border">
          <h2 className="font-display text-xl text-foreground mb-4 text-center">
            👥 Players
          </h2>
          <PlayerGrid players={room.players} />
        </div>

        {/* Category Selection (Host Only) */}
        {isHost ? (
          <div className="bg-card rounded-2xl p-6 border-2 border-border">
            <CategorySelector onSelect={startGame} />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-block px-8 py-6 bg-card rounded-2xl border-2 border-border">
              <div className="font-display text-2xl text-muted-foreground mb-2">
                ⏳ Waiting for host...
              </div>
              <p className="text-sm text-muted-foreground">
                The host will select a category and word
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
