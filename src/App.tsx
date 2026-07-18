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
    restartGame 
  } = gameState;

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
