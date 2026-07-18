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
  gradient: string;
  borderGlow: string;
}

export function CategorySelect({ onSelect, highScores }: CategorySelectProps) {
  const categories: CategoryOption[] = [
    {
      id: "history",
      title: "History & Politics",
      description: "From ancient civilizations and dynastic rulers to modern nationhood.",
      icon: <Landmark className="w-8 h-8 text-orange-400" />,
      gradient: "from-orange-600/20 via-amber-600/10 to-transparent",
      borderGlow: "hover:border-orange-500/50 hover:shadow-orange-500/10"
    },
    {
      id: "sports",
      title: "Sports & Games",
      description: "Celebrating Olympic triumphs, cricket legends, and sporting milestones.",
      icon: <Trophy className="w-8 h-8 text-cyan-400" />,
      gradient: "from-cyan-600/20 via-blue-600/10 to-transparent",
      borderGlow: "hover:border-cyan-500/50 hover:shadow-cyan-500/10"
    },
    {
      id: "cinema",
      title: "Cinema & Arts",
      description: "Tracing Raja Harishchandra, Bollywood blockbusters, and Oscar wins.",
      icon: <Film className="w-8 h-8 text-purple-400" />,
      gradient: "from-purple-600/20 via-indigo-600/10 to-transparent",
      borderGlow: "hover:border-purple-500/50 hover:shadow-purple-500/10"
    },
    {
      id: "science",
      title: "Science & Technology",
      description: "Chronicles of space exploration, nuclear milestones, and pioneers.",
      icon: <Rocket className="w-8 h-8 text-emerald-400" />,
      gradient: "from-emerald-600/20 via-teal-600/10 to-transparent",
      borderGlow: "hover:border-emerald-500/50 hover:shadow-emerald-500/10"
    },
    {
      id: "general",
      title: "General & Culture",
      description: "Literary Nobels, infrastructure marvels, and cultural milestones.",
      icon: <History className="w-8 h-8 text-rose-400" />,
      gradient: "from-rose-600/20 via-pink-600/10 to-transparent",
      borderGlow: "hover:border-rose-500/50 hover:shadow-rose-500/10"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent drop-shadow">
          Bharat Chronology
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Test your knowledge of Indian history and milestones. Sort the cards chronologically to build the ultimate timeline!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {categories.map(cat => {
          const score = highScores[cat.id] || 0;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`group relative flex flex-col items-start p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 text-left cursor-pointer overflow-hidden ${cat.borderGlow}`}
            >
              {/* Decorative category gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative z-10 flex items-center justify-between w-full mb-4">
                <div className="p-3 bg-slate-800/80 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                {score > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-semibold text-amber-400">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Best: {score}</span>
                  </div>
                )}
              </div>

              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-white">
                  {cat.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300">
                  {cat.description}
                </p>
              </div>

              {/* Bottom accent glow bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 group-hover:bg-current transition-colors duration-300" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
