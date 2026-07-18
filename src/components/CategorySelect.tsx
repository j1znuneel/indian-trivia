import React from "react";
import { Category } from "../hooks/useGameState";
import { History, Trophy, Film, Rocket, Landmark } from "lucide-react";

interface CategorySelectProps {
  onSelect: (category: Category) => void;
  highScores: Record<string, number>;
}

interface CategoryOption {
  id: Category;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  iconBg: string;
}

export function CategorySelect({ onSelect, highScores }: CategorySelectProps) {
  const categories: CategoryOption[] = [
    {
      id: "history",
      title: "History & Politics",
      description: "From ancient civilizations and dynastic rulers to modern nationhood.",
      icon: <Landmark className="w-8 h-8 text-black" />,
      bgColor: "bg-[#FFBE7A]", /* Saffron Pastel */
      iconBg: "bg-[#FF931F]"
    },
    {
      id: "sports",
      title: "Sports & Games",
      description: "Celebrating Olympic triumphs, cricket legends, and sporting milestones.",
      icon: <Trophy className="w-8 h-8 text-black" />,
      bgColor: "bg-[#7AE4FF]", /* Sky Blue Pastel */
      iconBg: "bg-[#00B5E2]"
    },
    {
      id: "cinema",
      title: "Cinema & Arts",
      description: "Tracing Raja Harishchandra, Bollywood blockbusters, and Oscar wins.",
      icon: <Film className="w-8 h-8 text-black" />,
      bgColor: "bg-[#C87AFF]", /* Purple Pastel */
      iconBg: "bg-[#A020F0]"
    },
    {
      id: "science",
      title: "Science & Technology",
      description: "Chronicles of space exploration, nuclear milestones, and pioneers.",
      icon: <Rocket className="w-8 h-8 text-black" />,
      bgColor: "bg-[#7AFF9B]", /* Emerald Pastel */
      iconBg: "bg-[#129E59]"
    },
    {
      id: "general",
      title: "General & Culture",
      description: "Literary Nobels, infrastructure marvels, and cultural milestones.",
      icon: <History className="w-8 h-8 text-black" />,
      bgColor: "bg-[#FF7A9B]", /* Rose/Pink Pastel */
      iconBg: "bg-[#FF4D75]"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center select-none">
      {/* Heavy Brutalist Header */}
      <div className="text-center mb-16 relative">
        <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-4 uppercase border-brutal-thick bg-[#FDE047] text-black px-8 py-4 inline-block shadow-brutal rotate-[-1deg] transform">
          Indian Trivia
        </h1>
        <div className="mt-6">
          <p className="text-black text-md font-bold uppercase tracking-wider max-w-xl mx-auto bg-white border-2 border-black px-4 py-2 shadow-brutal-sm rotate-[1deg] inline-block">
            Sort the cards. Fix the timeline. Rule history!
          </p>
        </div>
      </div>

      {/* Grid of Neubrutalist Category Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-2">
        {categories.map(cat => {
          const score = highScores[cat.id] || 0;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`
                group relative flex flex-col items-start p-6 rounded-none border-brutal-thick ${cat.bgColor}
                transition-all duration-150 shadow-brutal hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal-lg
                active:translate-x-[3px] active:translate-y-[3px] active:shadow-brutal-sm text-left cursor-pointer
              `}
            >
              {/* Score Indicator */}
              <div className="flex items-center justify-between w-full mb-6">
                <div className={`p-3 rounded-none border-brutal ${cat.iconBg}`}>
                  {cat.icon}
                </div>
                {score > 0 ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-300 border-2 border-black font-extrabold text-xs uppercase shadow-brutal-sm">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Best: {score}</span>
                  </div>
                ) : (
                  <div className="px-3 py-1 bg-white border-2 border-black font-extrabold text-[10px] uppercase">
                    New Game
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <div className="mt-auto">
                <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-2 border-b-2 border-black pb-1 inline-block">
                  {cat.title}
                </h3>
                <p className="text-black text-xs font-semibold leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
