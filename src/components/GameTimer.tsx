// import { useEffect, useState } from "react";
// import { cn } from "@/lib/utils";

// interface GameTimerProps {
//   initialTime: number;
//   onTimeUp?: () => void;
//   isRunning?: boolean;
// }

// export const GameTimer = ({
//   initialTime,
//   onTimeUp,
//   isRunning = true,
// }: GameTimerProps) => {
//   const [timeLeft, setTimeLeft] = useState(initialTime);
//   console.log(initialTime, "initail time");
//   useEffect(() => {
//     if (!isRunning) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           onTimeUp?.();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [isRunning, onTimeUp]);

//   const percentage = (timeLeft / initialTime) * 100;
//   const isLow = timeLeft <= 10;

//   return (
//     <div className="flex flex-col items-center gap-2">
//       <div className="relative w-24 h-24">
//         <svg className="w-full h-full transform -rotate-90">
//           <circle
//             cx="48"
//             cy="48"
//             r="44"
//             strokeWidth="6"
//             className="fill-none stroke-muted"
//           />
//           <circle
//             cx="48"
//             cy="48"
//             r="44"
//             strokeWidth="6"
//             strokeLinecap="round"
//             className={cn(
//               "fill-none transition-all duration-300",
//               isLow ? "stroke-destructive" : "stroke-primary"
//             )}
//             style={{
//               strokeDasharray: `${2 * Math.PI * 44}`,
//               strokeDashoffset: `${2 * Math.PI * 44 * (1 - percentage / 100)}`,
//             }}
//           />
//         </svg>
//         <div className="absolute inset-0 flex items-center justify-center">
//           <span
//             className={cn(
//               "font-display text-3xl",
//               isLow ? "text-destructive animate-pulse" : "text-foreground"
//             )}
//           >
//             {timeLeft}
//           </span>
//         </div>
//       </div>
//       <span className="text-sm font-semibold text-muted-foreground">
//         seconds left
//       </span>
//     </div>
//   );
// };


import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GameTimerProps {
  initialTime: number;
  onTimeUp?: () => void;
  isRunning?: boolean;
}

export const GameTimer = ({
  initialTime,
  onTimeUp,
  isRunning = true,
}: GameTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const totalTimeRef = useRef(initialTime);

  // reset timer ONLY when initialTime changes
  useEffect(() => {
    totalTimeRef.current = initialTime;
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp]);

  const isLow = timeLeft <= 10;

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={cn(
          "font-display text-5xl tabular-nums",
          isLow
            ? "text-destructive animate-pulse"
            : "text-foreground"
        )}
      >
        {timeLeft}
      </span>

      <span className="text-sm font-medium text-muted-foreground">
        seconds left
      </span>
    </div>
  );
};

