import { cn } from "@/lib/utils";

interface WordDisplayProps {
  word: string | null;
  category: string | null;
  isThief: boolean;
}

export const WordDisplay = ({ word, category, isThief }: WordDisplayProps) => {
  return (
    <div className="flex flex-col items-center gap-4 animate-bounce-in">
      {category && (
        <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Category: {category}
        </span>
      )}
      
      <div
        className={cn(
          "relative px-12 py-8 rounded-2xl border-4 transition-all",
          isThief
            ? "bg-destructive/20 border-destructive"
            : "bg-primary/20 border-primary shadow-glow-primary"
        )}
      >
        {isThief ? (
          <div className="text-center">
            <div className="font-display text-4xl md:text-5xl text-destructive mb-2">
              YOU ARE THE THIEF!
            </div>
            <p className="text-muted-foreground font-semibold">
              🕵️ Blend in without knowing the word!
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="font-display text-5xl md:text-6xl text-gradient-primary tracking-wider">
              {word}
            </div>
            <p className="text-muted-foreground font-semibold mt-2">
              🔍 Find the thief who doesn't know this word!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
