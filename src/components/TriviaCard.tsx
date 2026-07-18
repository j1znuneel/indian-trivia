import { TriviaCard as CardType } from "../data/trivia";
import { Landmark, Trophy, Film, Rocket, History, Calendar, HelpCircle } from "lucide-react";

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

const CATEGORY_THEMES = {
  history: {
    bg: "bg-[#FFEBD6]", /* Very soft orange */
    iconBg: "bg-[#FFBE7A]",
    icon: <Landmark className="w-4 h-4 text-black" />
  },
  sports: {
    bg: "bg-[#E6F9FF]", /* Very soft blue */
    iconBg: "bg-[#7AE4FF]",
    icon: <Trophy className="w-4 h-4 text-black" />
  },
  cinema: {
    bg: "bg-[#F7EFFF]", /* Very soft violet */
    iconBg: "bg-[#C87AFF]",
    icon: <Film className="w-4 h-4 text-black" />
  },
  science: {
    bg: "bg-[#EDFFE6]", /* Very soft green */
    iconBg: "bg-[#7AFF9B]",
    icon: <Rocket className="w-4 h-4 text-black" />
  },
  general: {
    bg: "bg-[#FFE6EC]", /* Very soft pink */
    iconBg: "bg-[#FF7A9B]",
    icon: <History className="w-4 h-4 text-black" />
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
  const theme = CATEGORY_THEMES[card.category];

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
        relative w-44 h-60 border-[3px] border-black p-4 select-none flex flex-col justify-between rounded-none
        ${isCurrent ? "cursor-grab active:cursor-grabbing hover:translate-x-[-3px] hover:translate-y-[-3px]" : ""}
        ${isDragging ? "opacity-30 scale-95" : "opacity-100"}
        ${isSelected 
          ? "bg-[#FFF97A] translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_rgba(0,0,0,1)] ring-3 ring-black" 
          : revealed 
          ? `${theme.bg} shadow-[4px_4px_0px_rgba(0,0,0,1)]` 
          : "bg-[#FFE885] shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]"
        }
        transition-all duration-100 ease-out
      `}
    >
      {/* Header Info */}
      <div className="flex items-center justify-between w-full">
        <div className={`flex items-center gap-1 px-2 py-0.5 border-2 border-black text-[9px] font-black uppercase ${theme.iconBg}`}>
          {theme.icon}
          <span>{card.category}</span>
        </div>
        {!revealed && (
          <HelpCircle className="w-4 h-4 text-black stroke-[2.5]" />
        )}
      </div>

      {/* Main Content Area */}
      {revealed ? (
        /* Revealed Timeline State */
        <div className="flex-1 flex flex-col justify-center items-center text-center py-2">
          <div className="bg-[#FFF97A] border-[2px] border-black px-3 py-1 text-sm font-black text-black uppercase tracking-wide flex items-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <Calendar className="w-4 h-4 text-black stroke-[2.5]" />
            {formatYear(card.year)}
          </div>
          <h4 className="mt-4 text-xs font-black text-black uppercase leading-tight line-clamp-2 px-1">
            {card.title}
          </h4>
        </div>
      ) : (
        /* Active Sorting Card State */
        <div className="flex-1 flex flex-col justify-center py-2 text-center">
          <h4 className="text-sm font-black text-black uppercase leading-tight tracking-tight mb-2">
            {card.title}
          </h4>
          <p className="text-[10px] text-black font-semibold leading-normal line-clamp-4 bg-white border border-black/30 p-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
            {card.description}
          </p>
        </div>
      )}

      {/* Card Footer Design Decor */}
      <div className="w-full flex justify-center mt-2 border-t-[1.5px] border-black pt-1.5">
        {revealed ? (
          <p className="text-[8px] font-semibold text-black leading-tight line-clamp-2 text-center italic">
            {card.description}
          </p>
        ) : (
          <span className="text-[9px] font-extrabold text-black uppercase tracking-wider bg-white border border-black px-2 py-0.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
            {isCurrent ? "SORT ME!" : "Bharat trivia"}
          </span>
        )}
      </div>
    </div>
  );
}
