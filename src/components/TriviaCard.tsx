import { TriviaCard as CardType } from "../data/trivia";
import { Landmark, Trophy, Film, Rocket, History, Calendar } from "lucide-react";

interface TriviaCardProps {
  card: CardType;
  revealed?: boolean;
  isCurrent?: boolean;
  isDragging?: boolean;
  isSelected?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onClick?: () => void;
}

const CATEGORY_STYLES = {
  history: {
    accent: "border-orange-500/30 text-orange-400",
    bg: "from-orange-950/40 to-slate-900/90",
    icon: <Landmark className="w-4 h-4 text-orange-400" />,
    badgeBg: "bg-orange-500/10 text-orange-400 border-orange-500/20"
  },
  sports: {
    accent: "border-cyan-500/30 text-cyan-400",
    bg: "from-cyan-950/40 to-slate-900/90",
    icon: <Trophy className="w-4 h-4 text-cyan-400" />,
    badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
  },
  cinema: {
    accent: "border-purple-500/30 text-purple-400",
    bg: "from-purple-950/40 to-slate-900/90",
    icon: <Film className="w-4 h-4 text-purple-400" />,
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/20"
  },
  science: {
    accent: "border-emerald-500/30 text-emerald-400",
    bg: "from-emerald-950/40 to-slate-900/90",
    icon: <Rocket className="w-4 h-4 text-emerald-400" />,
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  general: {
    accent: "border-rose-500/30 text-rose-400",
    bg: "from-rose-950/40 to-slate-900/90",
    icon: <History className="w-4 h-4 text-rose-400" />,
    badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  }
};

export function TriviaCard({
  card,
  revealed = false,
  isCurrent = false,
  isDragging = false,
  isSelected = false,
  onDragStart,
  onDragEnd,
  onClick
}: TriviaCardProps) {
  const styles = CATEGORY_STYLES[card.category];

  const formatYear = (year: number) => {
    if (year < 0) {
      return `${Math.abs(year)} BCE`;
    }
    return `${year} CE`;
  };

  return (
    <div
      draggable={isCurrent}
      onDragStart={isCurrent ? onDragStart : undefined}
      onDragEnd={isCurrent ? onDragEnd : undefined}
      onClick={onClick}
      className={`
        relative w-40 h-56 rounded-2xl border bg-gradient-to-b ${styles.bg} ${styles.accent}
        flex flex-col justify-between p-4 select-none transition-all duration-300
        ${isCurrent ? "cursor-grab active:cursor-grabbing hover:scale-105" : ""}
        ${isDragging ? "opacity-40 scale-95" : "opacity-100"}
        ${isSelected ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950 scale-105" : ""}
        ${isCurrent && !isSelected ? "hover:shadow-lg hover:shadow-slate-900/50" : ""}
        group perspective-1000
      `}
    >
      {/* 3D hover flip effect wrapper (only for non-timeline active cards) */}
      <div className="flex flex-col justify-between h-full w-full">
        {/* Header containing category icon & label */}
        <div className="flex items-center justify-between w-full">
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${styles.badgeBg}`}>
            {styles.icon}
            <span className="capitalize">{card.category}</span>
          </div>
          {revealed && (
            <span className="text-[10px] text-slate-500 font-mono">
              #{card.id.split("_")[1]}
            </span>
          )}
        </div>

        {/* Year display if revealed */}
        {revealed ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center py-2">
            <div className="bg-slate-800/80 border border-slate-700/50 px-3 py-1 rounded-lg text-lg font-black tracking-wide text-amber-300 flex items-center gap-1.5 shadow-inner shadow-black/40">
              <Calendar className="w-4 h-4 text-amber-400" />
              {formatYear(card.year)}
            </div>
            <h4 className="mt-3 text-xs font-bold text-slate-200 line-clamp-2 px-1">
              {card.title}
            </h4>
          </div>
        ) : (
          /* Clue/Title if unrevealed */
          <div className="flex-1 flex flex-col justify-center py-2 overflow-hidden text-center">
            <h4 className="text-sm font-extrabold text-slate-100 leading-tight mb-2 group-hover:text-white transition-colors">
              {card.title}
            </h4>
            <p className="text-[10px] text-slate-400 leading-normal line-clamp-4 group-hover:text-slate-300 transition-colors">
              {card.description}
            </p>
          </div>
        )}

        {/* Footer/Visual design decoration */}
        <div className="w-full flex justify-center">
          {!revealed && (
            <span className="text-[10px] font-medium text-slate-500 bg-slate-800/50 px-2.5 py-0.5 rounded-full border border-slate-700/30">
              Drag to timeline
            </span>
          )}
          {revealed && (
            <p className="text-[9px] text-slate-500 text-center line-clamp-2 leading-tight">
              {card.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
