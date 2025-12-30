import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GameMessage, Player } from "@/types/game";
import { Send } from "lucide-react";

interface ChatBoxProps {
  messages: GameMessage[];
  players: Player[];
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export const ChatBox = ({ messages, players, onSendMessage, disabled }: ChatBoxProps) => {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const getPlayerColor = (playerId: string) => {
    const player = players.find((p) => p.id === playerId);
    return player?.color || "hsl(var(--muted))";
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border-2 border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/50">
        <h3 className="font-bold text-foreground">💬 Game Chat</h3>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">
              Start chatting and give hints! 🕵️
            </p>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className="animate-slide-up">
              <span
                className="font-bold mr-2"
                style={{ color: getPlayerColor(msg.playerId) }}
              >
                {msg.playerName}:
              </span>
              <span className="text-foreground">{msg.content}</span>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border bg-muted/30">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a hint..."
            disabled={disabled}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            size="icon"
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
