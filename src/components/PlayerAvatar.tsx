import { cn } from "@/lib/utils";
import { Player } from "@/types/game";

interface PlayerAvatarProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showScore?: boolean;
  isThief?: boolean;
  revealThief?: boolean;
  onClick?: () => void;
  selected?: boolean;
  hasVoted?: boolean;
}

export const PlayerAvatar = ({
  player,
  size = 'md',
  showName = true,
  showScore = false,
  isThief = false,
  revealThief = false,
  onClick,
  selected = false,
  hasVoted = false,
}: PlayerAvatarProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl',
  };

  const nameSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 transition-all duration-200",
        onClick && "cursor-pointer hover:scale-105",
        selected && "scale-110"
      )}
      onClick={onClick}
    >
      <div className="relative">
        <div
          className={cn(
            sizeClasses[size],
            "rounded-full flex items-center justify-center transition-all duration-300",
            selected && "ring-4 ring-accent shadow-lg",
            hasVoted && "opacity-70",
            onClick && "hover:brightness-110"
          )}
          style={{
            backgroundColor: player.color,
            boxShadow: selected ? `0 0 20px ${player.color}` : `0 4px 12px ${player.color}40`,
          }}
        >
          <span className="drop-shadow-md">{player.avatar}</span>
        </div>
        
        {player.isHost && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-xs animate-bounce-in">
            👑
          </div>
        )}
        
        {revealThief && isThief && (
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-destructive rounded-full flex items-center justify-center text-sm animate-bounce-in">
            🦹
          </div>
        )}

        {hasVoted && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-game-green rounded-full flex items-center justify-center text-xs">
            ✓
          </div>
        )}
      </div>

      {showName && (
        <span className={cn(
          nameSizeClasses[size],
          "font-bold text-foreground truncate max-w-20 text-center"
        )}>
          {player.name}
        </span>
      )}

      {showScore && (
        <span className="text-xs font-bold text-accent">
          {player.score} pts
        </span>
      )}
    </div>
  );
};
