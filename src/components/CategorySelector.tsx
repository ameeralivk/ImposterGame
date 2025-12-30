// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { CATEGORIES } from "@/types/game";
// import { cn } from "@/lib/utils";

// interface CategorySelectorProps {
//   onSelect: (category: string, word: string) => void;
// }

// export const CategorySelector = ({ onSelect }: CategorySelectorProps) => {
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [selectedWord, setSelectedWord] = useState<string | null>(null);

//   const category = CATEGORIES.find((c) => c.id === selectedCategory);

//   return (
//     <div className="space-y-6">
//       <div className="text-center">
//         <h2 className="font-display text-3xl text-gradient-primary mb-2">
//           Select Category
//         </h2>
//         <p className="text-muted-foreground">Choose a category and word for this round</p>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//         {CATEGORIES.map((cat) => (
//           <Button
//             key={cat.id}
//             variant={selectedCategory === cat.id ? "default" : "outline"}
//             className={cn(
//               "h-20 text-lg flex flex-col gap-1 transition-all",
//               selectedCategory === cat.id && "scale-105 shadow-glow-primary"
//             )}
//             onClick={() => {
//               setSelectedCategory(cat.id);
//               setSelectedWord(null);
//             }}
//           >
//             <span className="text-2xl">{cat.emoji}</span>
//             <span>{cat.name}</span>
//           </Button>
//         ))}
//       </div>

//       {category && (
//         <div className="animate-slide-up space-y-4">
//           <div className="text-center">
//             <h3 className="font-display text-2xl text-foreground mb-2">
//               {category.emoji} Choose a Word
//             </h3>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//             {category.words.map((word) => (
//               <Button
//                 key={word}
//                 variant={selectedWord === word ? "secondary" : "ghost"}
//                 className={cn(
//                   "h-12 transition-all",
//                   selectedWord === word && "scale-105 shadow-glow-secondary"
//                 )}
//                 onClick={() => setSelectedWord(word)}
//               >
//                 {word}
//               </Button>
//             ))}
//           </div>

//           {selectedWord && (
//             <div className="flex justify-center pt-4 animate-bounce-in">
//               <Button
//                 variant="game"
//                 size="xl"
//                 onClick={() => onSelect(category.name, selectedWord)}
//               >
//                 🎮 Start Round
//               </Button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { CATEGORIES } from "@/types/game";
// import { cn } from "@/lib/utils";

// interface CategorySelectorProps {
//   onSelect: (category: string, word: string) => void;
// }

// export const CategorySelector = ({ onSelect }: CategorySelectorProps) => {
//   const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
//     null
//   );
//   const [selectedWord, setSelectedWord] = useState<string | null>(null);

//   const selectedCategory = CATEGORIES.find(
//     (cat) => cat.id === selectedCategoryId
//   );

//   const handleStart = () => {

//     if (!selectedCategory || !selectedWord) return;

//     console.log("START ROUND:", selectedCategory.name, selectedWord);

//     onSelect(selectedCategory.name, selectedWord);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="text-center">
//         <h2 className="font-display text-3xl text-gradient-primary mb-2">
//           Select Category
//         </h2>
//         <p className="text-muted-foreground">
//           Choose a category and a word for this round
//         </p>
//       </div>

//       {/* Category Grid */}
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//         {CATEGORIES.map((cat) => (
//           <Button
//             key={cat.id}
//             variant={selectedCategoryId === cat.id ? "default" : "outline"}
//             className={cn(
//               "h-20 flex flex-col gap-1 text-lg transition-all",
//               selectedCategoryId === cat.id && "scale-105 shadow-glow-primary"
//             )}
//             onClick={() => {
//               setSelectedCategoryId(cat.id);
//               setSelectedWord(null);
//             }}
//           >
//             <span className="text-2xl">{cat.emoji}</span>
//             <span>{cat.name}</span>
//           </Button>
//         ))}
//       </div>

//       {/* Word Selection */}
//       {selectedCategory && (
//         <div className="animate-slide-up space-y-4">
//           <div className="text-center">
//             <h3 className="font-display text-2xl">
//               {selectedCategory.emoji} Choose a Word
//             </h3>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//             {selectedCategory.words.map((word) => (
//               <Button
//                 key={word}
//                 variant={selectedWord === word ? "secondary" : "ghost"}
//                 className={cn(
//                   "h-12 transition-all",
//                   selectedWord === word && "scale-105 shadow-glow-secondary"
//                 )}
//                 onClick={() => setSelectedWord(word)}
//               >
//                 {word}
//               </Button>
//             ))}
//           </div>

//           {/* Start Button */}
//           <div className="flex justify-center pt-4">
//             <Button
//               variant="default"
//               size="lg"
//               disabled={!selectedWord}
//               onClick={handleStart}
//             >
//               🎮 Start Round
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/types/game";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  onSelect: (categoryId: string, word: string) => void;
}

export const CategorySelector = ({ onSelect }: CategorySelectorProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const selectedCategory = CATEGORIES.find(
    (cat) => cat.id === selectedCategoryId
  );

  const handleStart = () => {
    if (!selectedCategory || !selectedWord) return;

    console.log("START ROUND:", selectedCategory.id, selectedWord);

    // Send category ID and word to parent
    onSelect(selectedCategory.id, selectedWord);

    // Optional: reset selection after starting
    setSelectedCategoryId(null);
    setSelectedWord(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display text-3xl text-gradient-primary mb-2">
          Select Category
        </h2>
        <p className="text-muted-foreground">
          Choose a category and a word for this round
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategoryId === cat.id ? "default" : "outline"}
            className={cn(
              "h-20 flex flex-col gap-1 text-lg transition-all",
              selectedCategoryId === cat.id && "scale-105 shadow-glow-primary"
            )}
            onClick={() => {
              setSelectedCategoryId(cat.id);
              setSelectedWord(null);
            }}
          >
            <span className="text-2xl">{cat.emoji}</span>
            <span>{cat.name}</span>
          </Button>
        ))}
      </div>

      {/* Word Selection */}
      {selectedCategory && (
        <div className="animate-slide-up space-y-4">
          <div className="text-center">
            <h3 className="font-display text-2xl">
              {selectedCategory.emoji} Choose a Word
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {selectedCategory.words.map((word) => (
              <Button
                key={word}
                variant={selectedWord === word ? "secondary" : "ghost"}
                className={cn(
                  "h-12 transition-all",
                  selectedWord === word && "scale-105 shadow-glow-secondary"
                )}
                onClick={() => setSelectedWord(word)}
              >
                {word}
              </Button>
            ))}
          </div>

          {/* Start Button */}
          <div className="flex justify-center pt-4">
            <Button size="lg" disabled={!selectedWord} onClick={handleStart}>
              🎮 Start Round
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
