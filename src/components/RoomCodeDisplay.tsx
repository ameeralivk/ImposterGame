import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface RoomCodeDisplayProps {
  code: string;
}

export const RoomCodeDisplay = ({ code }: RoomCodeDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Room code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Room Code
      </span>
      <div className="flex items-center gap-3 bg-card rounded-2xl px-6 py-3 border-2 border-border">
        <span className="font-display text-3xl tracking-[0.3em] text-primary">
          {code}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={copyCode}
          className="hover:bg-primary/20"
        >
          {copied ? (
            <Check className="w-5 h-5 text-game-green" />
          ) : (
            <Copy className="w-5 h-5 text-primary" />
          )}
        </Button>
      </div>
    </div>
  );
};
