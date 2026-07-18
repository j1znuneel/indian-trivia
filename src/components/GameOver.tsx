import { Category } from "../hooks/useGameState";
import { Award, Trophy, RotateCcw, Home, Star } from "lucide-react";

interface GameOverProps {
  score: number;
  highScore: number;
  category: Category;
  onRestart: () => void;
  onHome: () => void;
}

const CATEGORY_NAMES: Record<Category, string> = {
  history: "History & Politics",
  sports: "Sports & Games",
  cinema: "Cinema & Arts",
  science: "Science & Technology",
  general: "General & Culture"
};

export function GameOver({ score, highScore, category, onRestart, onHome }: GameOverProps) {
  const getAwardTitle = (s: number) => {
    if (s <= 2) return { title: "Panchayat Member", desc: "A humble start. Take a walk through history and try again!" };
    if (s <= 5) return { title: "Royal Court Advisor", desc: "Impressive! You know your way around major historical milestones." };
    if (s <= 9) return { title: "Grand Minister (Mahamatya)", desc: "Brilliant! Chanakya would be proud of your tactical historical ordering." };
    return { title: "Chakravartin Samrat", desc: "Phenomenal! You are the absolute Emperor of Time and Bharat's history!" };
  };

  const award = getAwardTitle(score);
  const isNewHighScore = score > 0 && score >= highScore;

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-lg text-center shadow-2xl animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-slate-800/80 border border-slate-700/50 rounded-2xl relative">
          <Award className="w-16 h-16 text-amber-400" />
          {isNewHighScore && (
            <div className="absolute -top-2 -right-2 bg-red-500 border border-red-400 text-white rounded-full p-1.5 animate-bounce">
              <Star className="w-4 h-4 fill-white" />
            </div>
          )}
        </div>
      </div>

      <h2 className="text-3xl font-black mb-1 bg-gradient-to-r from-red-400 via-amber-300 to-green-400 bg-clip-text text-transparent">
        Game Over
      </h2>
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-6">
        Category: {CATEGORY_NAMES[category]}
      </p>

      {/* Scores Panel */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
          <span className="block text-xs font-medium text-slate-500 mb-1">Your Score</span>
          <span className="text-4xl font-extrabold text-white">{score}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
          <span className="block text-xs font-medium text-slate-500 mb-1">High Score</span>
          <span className="text-4xl font-extrabold text-amber-400 flex items-center justify-center gap-1">
            <Trophy className="w-5 h-5 text-amber-400" />
            {isNewHighScore ? score : highScore}
          </span>
        </div>
      </div>

      {/* Title Award Card */}
      <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 text-center mb-8">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
          Award Title
        </span>
        <h3 className="text-xl font-black text-slate-100 mb-2">
          {award.title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {award.desc}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 font-bold text-white transition-all shadow-lg shadow-orange-950/30 cursor-pointer active:scale-[0.98]"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>
        <button
          onClick={onHome}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-slate-800 bg-slate-850 hover:bg-slate-800 font-semibold text-slate-300 hover:text-white transition-all cursor-pointer active:scale-[0.98]"
        >
          <Home className="w-5 h-5" />
          Categories Dashboard
        </button>
      </div>
    </div>
  );
}
