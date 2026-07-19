import { useState, useEffect } from "react";
import { TriviaCard as CardType } from "../data/trivia";
import { Landmark, Sparkles, Film, Rocket, History, Calendar, HelpCircle } from "lucide-react";

interface TriviaCardProps {
  card: CardType;
  revealed?: boolean;
  isCurrent?: boolean;
  isDragging?: boolean;
  isSelected?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onClick?: () => void;
  skipInitialFlip?: boolean;
  isIncorrect?: boolean;
  isHoverDisabled?: boolean;
}

const CATEGORY_THEMES = {
  history: {
    bg: "bg-[#FFEBD6]",
    iconBg: "bg-[#FFBE7A]",
    icon: <Landmark className="w-4 h-4 text-black" />
  },
  cinema: {
    bg: "bg-[#F7EFFF]",
    iconBg: "bg-[#C87AFF]",
    icon: <Film className="w-4 h-4 text-black" />
  },
  science: {
    bg: "bg-[#EDFFE6]",
    iconBg: "bg-[#7AFF9B]",
    icon: <Rocket className="w-4 h-4 text-black" />
  },
  general: {
    bg: "bg-[#FFE6EC]",
    iconBg: "bg-[#FF7A9B]",
    icon: <History className="w-4 h-4 text-black" />
  },
  culture: {
    bg: "bg-[#FFFDE6]",
    iconBg: "bg-[#FFE885]",
    icon: <Sparkles className="w-4 h-4 text-black" />
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
  onClick,
  skipInitialFlip = false,
  isIncorrect = false,
  isHoverDisabled = false
}: TriviaCardProps) {
  const theme = CATEGORY_THEMES[card.category];
  
  // 3D Flip States: starts face-down, flips face-up in mid-air
  const [isFlipped, setIsFlipped] = useState(
    skipInitialFlip ? (revealed ? true : false) : (revealed ? false : true)
  );
  const [hoverFlipped, setHoverFlipped] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const canHoverFlip = revealed && !isCurrent && !isHoverDisabled;

  const isFaceAActive = (canHoverFlip && hoverFlipped) || !isFlipped;
  const isFaceBActive = !isFaceAActive;

  useEffect(() => {
    if (skipInitialFlip) {
      setIsFlipped(revealed ? true : false);
      return;
    }

    setIsFlipped(revealed ? false : true);
    const timer = setTimeout(() => {
      setIsFlipped(revealed ? true : false);
    }, 450);
    return () => clearTimeout(timer);
  }, [revealed, card.id]);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setHoverFlipped(false);
  }, [card.id]);

  const formatYear = (year: number) => {
    if (year < 0) {
      return `${Math.abs(year)} BCE`;
    }
    return `${year} CE`;
  };

  const renderCardImage = (face: "A" | "B") => {
    const heightClass = face === "A" ? "h-[100px]" : "h-[48px]";

    if (imageError || !card.image) {
      return (
        <div className={`relative w-full ${heightClass} border border-black ${theme.iconBg} flex-shrink-0 my-1 flex items-center justify-center select-none`}>
          <div className="p-2 rounded-full border border-black bg-white shadow-brutal-sm">
            {theme.icon}
          </div>
        </div>
      );
    }

    return (
      <div className={`relative w-full ${heightClass} border border-black bg-[#FFEBD6] flex-shrink-0 my-1 overflow-hidden select-none`}>
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#EAD4BA] animate-pulse flex items-center justify-center">
            <span className="text-[8px] font-black uppercase text-slate-600 tracking-wider">Loading...</span>
          </div>
        )}
        <img
          src={card.image}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          ref={(el) => {
            if (el && el.complete && !imageLoaded && !imageError) {
              setTimeout(() => setImageLoaded(true), 0);
            }
          }}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0 absolute"
          }`}
        />
      </div>
    );
  };

  return (
      <div
        draggable={isCurrent}
        onDragStart={isCurrent ? onDragStart : undefined}
        onDragEnd={isCurrent ? onDragEnd : undefined}
        onClick={isCurrent ? onClick : undefined}
        onMouseEnter={canHoverFlip ? () => setHoverFlipped(true) : undefined}
        onMouseLeave={canHoverFlip ? () => setHoverFlipped(false) : undefined}
        className={`
          relative w-44 h-60 perspective-1000 select-none rounded-none cursor-pointer
          ${isCurrent ? "cursor-grab active:cursor-grabbing hover:scale-[1.02]" : ""}
          ${isDragging ? "opacity-30 scale-95" : "opacity-100"}
          ${isCurrent && isSelected ? "ring-4 ring-black translate-x-[2px] translate-y-[2px]" : ""}
          transition-all duration-200 ease-out
        `}
      >
        {/* 3D Rotating Wrapper */}
        <div 
          className="relative w-full h-full preserve-3d transition-transform duration-500 ease-out"
          style={{
            transform: canHoverFlip && hoverFlipped
              ? "rotateY(0deg)"
              : (isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"),
          }}
        >
          {/* ================= FACE A: CLUE FACE (Front) ================= */}
          <div 
            className={`absolute inset-0 backface-hidden border-[3px] border-black p-3 flex flex-col justify-between rounded-none bg-[#FFE885] ${
              isFaceAActive ? "shadow-brutal" : ""
            }`}
          >
            {/* Header Badge */}
            <div className="w-full flex justify-between items-center mb-1">
              <span className="text-[8px] font-black text-black uppercase tracking-wider bg-white border border-black px-1.5 py-0.2">
                {card.category}
              </span>
              <div className="p-0.5 border border-black bg-white">
                {theme.icon}
              </div>
            </div>

            {/* Clue Content */}
            <div className="flex-1 flex flex-col justify-center items-center py-1 text-center select-none overflow-hidden min-h-0">
              <h4 className="text-xs font-black text-black uppercase leading-tight tracking-tight mb-1 px-1 line-clamp-3">
                {card.title}
              </h4>
              {renderCardImage("A")}
            </div>

            {/* Footer */}
            <div className="w-full flex justify-center mt-1 border-t-[1.5px] border-black pt-1">
              <span className="text-[9px] font-extrabold text-black uppercase tracking-wider bg-white border border-black px-2 py-0.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                {isCurrent ? "SORT ME!" : "BHARAT TRIVIA"}
              </span>
            </div>
          </div>

          {/* ================= FACE B: BACK FACE (Card Back OR Year Face) ================= */}
          <div 
            className="absolute inset-0 backface-hidden rotate-y-180 rounded-none"
          >
            {revealed ? (
              /* Revealed Year Face (Year, Title, Description) */
              <div className={`w-full h-full border-[3px] border-black p-3 flex flex-col justify-between rounded-none ${theme.bg} ${
                isFaceBActive ? "shadow-brutal" : ""
              }`}>
                {/* Year Value */}
                <div className="flex-1 flex flex-col justify-center items-center text-center py-0.5 select-none overflow-hidden min-h-0">
                  <div className={`border-[2px] border-black px-2 py-0.5 text-xs font-black text-black uppercase tracking-wide flex items-center gap-1 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] mb-1 ${
                    isIncorrect ? "bg-[#FF6B6B]" : "bg-[#FFF97A]"
                  }`}>
                    <Calendar className="w-3 h-3 text-black stroke-[2.5]" />
                    {formatYear(card.year)}
                  </div>
                  {renderCardImage("B")}
                  <h4 className="mt-1 text-[10px] font-black text-black uppercase leading-tight px-1 line-clamp-2">
                    {card.title}
                  </h4>
                </div>

                {/* Description */}
                <div className="w-full flex justify-center mt-1 border-t-[1.5px] border-black pt-1">
                  <p className="text-[8px] font-semibold text-black leading-tight line-clamp-2 text-center italic">
                    {card.description}
                  </p>
                </div>
              </div>
            ) : (
              /* Card Back Design (Draw Pile Style) */
              <div className={`w-full h-full border-[3px] border-black rounded-none bg-card-back flex flex-col justify-center items-center p-4 ${
                isFaceBActive ? "shadow-brutal" : ""
              }`}>
                <div className="w-16 h-16 rounded-full border-[3px] border-black bg-[#FFF97A] flex items-center justify-center shadow-brutal-sm rotate-[-6deg] animate-pulse">
                  <span className="text-3xl font-black text-black">?</span>
                </div>
                <div className="mt-6 border-2 border-black bg-white px-3 py-1 shadow-brutal-sm rotate-[3deg]">
                  <span className="text-[9px] font-black text-black uppercase tracking-widest">BHARAT CHRONO</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
