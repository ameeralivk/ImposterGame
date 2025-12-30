import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameState } from "@/hooks/useGameState";
import { toast } from "sonner";

export const LobbyScreen = () => {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [mode, setMode] = useState<"menu" | "create" | "join">("menu");
  
  const { createRoom, joinRoom } = useGameState();

  const handleCreate = () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name!");
      return;
    }
    createRoom(playerName.trim());
    toast.success("Room created!");
  };

  const handleJoin = () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name!");
      return;
    }
    if (!roomCode.trim()) {
      toast.error("Please enter room code!");
      return;
    }
    const success = joinRoom(roomCode.trim(), playerName.trim());
    if (success) {
      toast.success("Joined room!");
    } else {
      toast.error("Room not found!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center animate-float">
          <h1 className="font-display text-6xl md:text-7xl text-gradient-primary tracking-wider mb-2">
            WORD THIEF
          </h1>
          <p className="text-muted-foreground font-semibold text-lg">
            🔍 Find the imposter among you!
          </p>
        </div>

        {mode === "menu" && (
          <div className="space-y-4 animate-slide-up">
            <div className="space-y-3">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Your Name
              </label>
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name..."
                maxLength={15}
                className="text-center text-lg"
              />
            </div>

            <div className="grid gap-3 pt-4">
              <Button
                variant="game"
                size="xl"
                onClick={() => setMode("create")}
                className="w-full"
              >
                🎮 Create Room
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setMode("join")}
                className="w-full"
              >
                🚪 Join Room
              </Button>
            </div>
          </div>
        )}

        {mode === "create" && (
          <div className="space-y-6 animate-slide-up">
            <div className="space-y-3">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Your Name
              </label>
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name..."
                maxLength={15}
                className="text-center text-lg"
              />
            </div>

            <Button
              variant="game"
              size="xl"
              onClick={handleCreate}
              className="w-full"
            >
              ✨ Create & Host
            </Button>

            <Button
              variant="ghost"
              onClick={() => setMode("menu")}
              className="w-full"
            >
              ← Back
            </Button>
          </div>
        )}

        {mode === "join" && (
          <div className="space-y-6 animate-slide-up">
            <div className="space-y-3">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Your Name
              </label>
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name..."
                maxLength={15}
                className="text-center text-lg"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Room Code
              </label>
              <Input
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="XXXXXX"
                maxLength={6}
                className="text-center text-2xl font-display tracking-[0.3em]"
              />
            </div>

            <Button
              variant="secondary"
              size="xl"
              onClick={handleJoin}
              className="w-full"
            >
              🚀 Join Game
            </Button>

            <Button
              variant="ghost"
              onClick={() => setMode("menu")}
              className="w-full"
            >
              ← Back
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-xs text-muted-foreground">
            One player is the thief who doesn't know the word. <br />
            Can you find them before time runs out?
          </p>
        </div>
      </div>
    </div>
  );
};
