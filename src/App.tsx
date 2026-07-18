import { useGameState } from "./hooks/useGameState";
import { CategorySelect } from "./components/CategorySelect";
import { GameBoard } from "./components/GameBoard";
import { GameOver } from "./components/GameOver";
import "./index.css";

export function App() {
  const gameState = useGameState();
  const { 
    status, 
    category, 
    score, 
    highScores, 
    allHighScores, 
    startGame, 
    resetGame, 
    restartGame,
    isLoading
  } = gameState;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm p-8 border-brutal-thick bg-[#FFF97A] text-black shadow-brutal text-center rotate-[-1.5deg]">
          <div className="inline-block p-3 border-2 border-black bg-white rounded-none mb-4 rotate-[6deg] shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)]">
            <span className="text-4xl font-black">⏳</span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-2">
            FETCHING...
          </h2>
          <p className="text-xs font-bold uppercase tracking-wider text-black bg-white border-2 border-black py-1.5 px-4 inline-block shadow-brutal-sm">
            Querying Wikidata API
          </p>
          <div className="mt-8 flex gap-4 justify-center animate-pulse">
            <div className="w-12 h-16 border-2 border-dashed border-black bg-white/40 rotate-[5deg]" />
            <div className="w-12 h-16 border-2 border-solid border-black bg-white shadow-brutal-sm rotate-[-8deg]" />
            <div className="w-12 h-16 border-2 border-dashed border-black bg-white/40 rotate-[12deg]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-8">
      {status === "landing" && (
        <CategorySelect 
          onSelect={startGame} 
          highScores={allHighScores} 
        />
      )}
      
      {status === "playing" && category && (
        <GameBoard 
          category={category} 
          gameState={gameState} 
        />
      )}
      
      {status === "gameover" && category && (
        <GameOver
          score={score}
          highScore={highScores}
          category={category}
          onRestart={restartGame}
          onHome={resetGame}
        />
      )}
    </div>
  );
}

export default App;
