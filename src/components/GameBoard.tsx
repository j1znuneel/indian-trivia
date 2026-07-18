import { useState, useEffect, useRef } from "react";
import { Category, useGameState } from "../hooks/useGameState";
import { TriviaCard } from "./TriviaCard";
import { Heart, ArrowLeft, RotateCcw, Plus, ChevronRight, ChevronLeft } from "lucide-react";

interface GameBoardProps {
  category: Category;
  gameState: ReturnType<typeof useGameState>;
}

const CATEGORY_NAMES: Record<Category, string> = {
  history: "History & Politics",
  sports: "Sports & Games",
  cinema: "Cinema & Arts",
  science: "Science & Technology",
  general: "General & Culture"
};

export function GameBoard({ category, gameState }: GameBoardProps) {
  const {
    timeline,
    currentCard,
    score,
    lives,
    highScores,
    placeCard,
    resetGame,
    restartGame
  } = gameState;

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredDropzone, setHoveredDropzone] = useState<number | null>(null);

  // Click-to-place (touch/mobile accessibility) state
  const [isCardSelected, setIsCardSelected] = useState(false);

  // Validation feedback state
  const [feedbackCardId, setFeedbackCardId] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"correct" | "incorrect" | null>(null);
  const [shakeHearts, setShakeHearts] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const timelineContainerRef = useRef<HTMLDivElement>(null);

  // Scroll timeline left/right
  const scrollTimeline = (direction: "left" | "right") => {
    if (timelineContainerRef.current) {
      const scrollAmount = 300;
      timelineContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Center the timeline on updates
  useEffect(() => {
    if (timelineContainerRef.current) {
      // Smoothly scroll to the far right whenever the timeline length changes
      setTimeout(() => {
        if (timelineContainerRef.current) {
          timelineContainerRef.current.scrollTo({
            left: timelineContainerRef.current.scrollWidth,
            behavior: "smooth"
          });
        }
      }, 300);
    }
  }, [timeline.length]);

  // Handle Drag Start
  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    setIsCardSelected(false);
    // Standard dataTransfer for drag events
    e.dataTransfer.setData("text/plain", currentCard?.id || "");
    // Make the ghost image look nice
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setHoveredDropzone(null);
  };

  // Drag over dropzones
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (isAnimating) return;
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (isAnimating) return;
    setHoveredDropzone(index);
  };

  const handleDragLeave = (index: number) => {
    if (hoveredDropzone === index) {
      setHoveredDropzone(null);
    }
  };

  // Handle Drop Action
  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (isAnimating || !currentCard) return;

    setIsDragging(false);
    setHoveredDropzone(null);

    executePlacement(index);
  };

  // Triggered when a placement action is executed (via drop or click)
  const executePlacement = (index: number) => {
    if (isAnimating || !currentCard) return;

    setIsAnimating(true);
    setIsCardSelected(false);

    // Save ID of card being placed for feedback
    const activeCard = currentCard;
    const { success, correctIndex } = placeCard(index);

    if (success) {
      setFeedbackCardId(activeCard.id);
      setFeedbackType("correct");
      
      // Clear after animation duration
      setTimeout(() => {
        setFeedbackCardId(null);
        setFeedbackType(null);
        setIsAnimating(false);
      }, 1000);
    } else {
      setFeedbackCardId(activeCard.id);
      setFeedbackType("incorrect");
      setShakeHearts(true);

      setTimeout(() => {
        setShakeHearts(false);
      }, 600);

      setTimeout(() => {
        setFeedbackCardId(null);
        setFeedbackType(null);
        setIsAnimating(false);
      }, 1600);
    }
  };

  const handleCardClick = () => {
    if (isAnimating) return;
    setIsCardSelected(prev => !prev);
  };

  const handleDropzoneClick = (index: number) => {
    if (!isCardSelected || isAnimating) return;
    executePlacement(index);
  };

  // Heart rendering helper
  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < 3; i++) {
      if (i < lives) {
        hearts.push(
          <Heart
            key={i}
            className="w-6 h-6 text-red-500 fill-red-500 transition-transform duration-300 hover:scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
          />
        );
      } else {
        // Lost heart
        hearts.push(
          <Heart
            key={i}
            className="w-6 h-6 text-slate-700 transition-all duration-500 scale-90"
          />
        );
      }
    }
    return hearts;
  };

  return (
    <div className="w-full flex flex-col items-center justify-between min-h-[85vh] py-4 px-2 select-none">
      {/* Top Navigation / Stats bar */}
      <header className="w-full max-w-5xl flex items-center justify-between px-4 py-2 bg-slate-900/40 border border-slate-800/40 rounded-2xl backdrop-blur-md mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={resetGame}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Go to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-100">{CATEGORY_NAMES[category]}</h2>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider">CHRONOLOGY MATCH</p>
          </div>
        </div>

        {/* Lives (Hearts Panel) */}
        <div 
          className={`flex items-center gap-1.5 bg-slate-950/60 border border-slate-850 px-4 py-2 rounded-xl ${
            shakeHearts ? "animate-shake border-red-500/50" : ""
          }`}
        >
          {renderHearts()}
        </div>

        {/* Scores Panel */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Score</span>
            <span className="text-xl font-black text-white">{score}</span>
          </div>
          <div className="text-right border-l border-slate-800 pl-6">
            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Best</span>
            <span className="text-xl font-black text-amber-400">{highScores}</span>
          </div>
        </div>
      </header>

      {/* Main Workspace: Timeline Container & Scrolling */}
      <main className="w-full flex flex-col items-center justify-center flex-1 my-4">
        {/* Timeline Row */}
        <div className="relative w-full flex items-center justify-center mb-12">
          {/* Scroll Buttons */}
          <button
            onClick={() => scrollTimeline("left")}
            className="absolute left-2 z-20 p-3 rounded-full border border-slate-800 bg-slate-950/80 hover:bg-slate-900 text-slate-400 hover:text-white backdrop-blur shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Horizontal Scrolling Timeline viewport */}
          <div
            ref={timelineContainerRef}
            className="w-full max-w-5xl overflow-x-auto no-scrollbar py-6 flex items-center px-8 snap-x"
          >
            {/* Iterative Timeline Render (Cards and Dropzones) */}
            {timeline.map((card, idx) => {
              const isCorrectFeedback = feedbackCardId === card.id && feedbackType === "correct";
              const isIncorrectFeedback = feedbackCardId === card.id && feedbackType === "incorrect";

              return (
                <div key={`timeline-item-${card.id}`} className="flex items-center flex-shrink-0 snap-center">
                  
                  {/* Dropzone before current card */}
                  <div
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnter={(e) => handleDragEnter(e, idx)}
                    onDragLeave={() => handleDragLeave(idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    onClick={() => handleDropzoneClick(idx)}
                    className={`
                      dropzone-active h-56 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed
                      ${hoveredDropzone === idx
                        ? "w-40 border-green-500/80 bg-green-950/15 glow-green mx-4"
                        : isCardSelected
                        ? "w-40 border-amber-500/40 bg-amber-500/5 mx-4 hover:border-amber-400/80 cursor-pointer animate-pulse"
                        : isDragging
                        ? "w-16 border-slate-700/60 bg-slate-800/5 mx-2"
                        : "w-4 border-transparent mx-1"
                      }
                    `}
                  >
                    {(hoveredDropzone === idx || isCardSelected) && (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Plus className={`w-6 h-6 ${isCardSelected ? "text-amber-400" : "text-green-400"}`} />
                        <span className="text-[10px] font-bold tracking-wider uppercase">Place here</span>
                      </div>
                    )}
                  </div>

                  {/* The Timeline Card */}
                  <div 
                    className={`
                      relative rounded-2xl transition-all duration-300
                      ${isCorrectFeedback ? "animate-bounce glow-green bg-green-950/20" : ""}
                      ${isIncorrectFeedback ? "animate-shake glow-red bg-red-950/20" : ""}
                    `}
                  >
                    <TriviaCard card={card} revealed={true} />
                  </div>
                </div>
              );
            })}

            {/* Final Dropzone at the end of the timeline */}
            <div className="flex items-center flex-shrink-0 snap-center">
              <div
                onDragOver={(e) => handleDragOver(e, timeline.length)}
                onDragEnter={(e) => handleDragEnter(e, timeline.length)}
                onDragLeave={() => handleDragLeave(timeline.length)}
                onDrop={(e) => handleDrop(e, timeline.length)}
                onClick={() => handleDropzoneClick(timeline.length)}
                className={`
                  dropzone-active h-56 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed
                  ${hoveredDropzone === timeline.length
                    ? "w-40 border-green-500/80 bg-green-950/15 glow-green mx-4"
                    : isCardSelected
                    ? "w-40 border-amber-500/40 bg-amber-500/5 mx-4 hover:border-amber-400/80 cursor-pointer animate-pulse"
                    : isDragging
                    ? "w-16 border-slate-700/60 bg-slate-800/5 mx-2"
                    : "w-4 border-transparent mx-1"
                  }
                `}
              >
                {(hoveredDropzone === timeline.length || isCardSelected) && (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Plus className={`w-6 h-6 ${isCardSelected ? "text-amber-400" : "text-green-400"}`} />
                    <span className="text-[10px] font-bold tracking-wider uppercase">Place here</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => scrollTimeline("right")}
            className="absolute right-2 z-20 p-3 rounded-full border border-slate-800 bg-slate-950/80 hover:bg-slate-900 text-slate-400 hover:text-white backdrop-blur shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Current Card Drawer (The event to sort) */}
        {currentCard && (
          <div className="flex flex-col items-center gap-4">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest animate-pulse">
              Next Event to Sort
            </span>
            <div className="relative">
              {/* Highlight selection glow */}
              {isCardSelected && (
                <div className="absolute inset-0 -m-1.5 rounded-[22px] bg-amber-400/20 blur-md animate-pulse" />
              )}
              <TriviaCard
                card={currentCard}
                revealed={false}
                isCurrent={!isAnimating}
                isDragging={isDragging}
                isSelected={isCardSelected}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onClick={handleCardClick}
              />
            </div>
            
            {/* Guide Hint */}
            <p className="text-[10px] text-slate-500 max-w-xs text-center leading-relaxed">
              {isCardSelected 
                ? "Click on any highlighted slot (+) on the timeline to place this card."
                : "Drag this card onto the timeline, or click it to select it for keyboard/tap placement."
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
