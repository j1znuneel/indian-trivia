import { useState, useEffect, useCallback } from "react";
import { TRIVIA_DATA, TriviaCard } from "../data/trivia";

export type GameStatus = "landing" | "playing" | "gameover";
export type Category = "history" | "sports" | "cinema" | "science" | "general";

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function useGameState() {
  const [status, setStatus] = useState<GameStatus>("landing");
  const [category, setCategory] = useState<Category | null>(null);
  const [deck, setDeck] = useState<TriviaCard[]>([]);
  const [timeline, setTimeline] = useState<TriviaCard[]>([]);
  const [currentCard, setCurrentCard] = useState<TriviaCard | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load high scores from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("indian_trivia_highscores");
      if (stored) {
        setHighScores(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load high scores", e);
    }
  }, []);

  // Update high score for a category
  const updateHighScore = useCallback((cat: Category, newScore: number) => {
    setHighScores(prev => {
      const currentHigh = prev[cat] || 0;
      if (newScore > currentHigh) {
        const updated = { ...prev, [cat]: newScore };
        try {
          localStorage.setItem("indian_trivia_highscores", JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to save high score", e);
        }
        return updated;
      }
      return prev;
    });
  }, []);

  // Helper to load static local fallback
  const loadLocalFallback = useCallback((selectedCat: Category) => {
    console.warn(`[Fallback] Loading local curated trivia for category: ${selectedCat}`);
    const filtered = TRIVIA_DATA.filter(item => item.category === selectedCat);
    if (filtered.length < 2) return;

    const shuffled = shuffle(filtered);
    const initialCard = shuffled[0];
    const remainingDeck = shuffled.slice(1);
    const firstPlayable = remainingDeck[0] || null;
    const activeDeck = remainingDeck.slice(1);

    setCategory(selectedCat);
    setDeck(activeDeck);
    setTimeline([initialCard]);
    setCurrentCard(firstPlayable);
    setScore(0);
    setLives(3);
    setStatus("playing");
  }, []);

  // Initialize game for a category (fetching dynamically from Wikidata)
  const startGame = useCallback(async (selectedCat: Category) => {
    setIsLoading(true);
    setCategory(selectedCat);

    try {
      // Fetch dynamic Wikidata cards from Bun proxy
      const res = await fetch(`/api/wikidata?category=${selectedCat}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch from API: ${res.statusText}`);
      }

      const fetchedCards: TriviaCard[] = await res.json();

      if (!fetchedCards || fetchedCards.length < 2) {
        throw new Error("API returned insufficient cards");
      }

      // Initial card goes to timeline
      const initialCard = fetchedCards[0];
      // Remaining cards go to deck
      const remainingDeck = fetchedCards.slice(1);
      const firstPlayable = remainingDeck[0] || null;
      const activeDeck = remainingDeck.slice(1);

      setTimeline([initialCard]);
      setDeck(activeDeck);
      setCurrentCard(firstPlayable);
      setScore(0);
      setLives(3);
      setStatus("playing");
    } catch (err) {
      console.error("[Wikidata Fetch Error] Falling back to local dataset", err);
      // Seamless offline fallback
      loadLocalFallback(selectedCat);
    } finally {
      setIsLoading(false);
    }
  }, [loadLocalFallback]);

  // Check if placement is chronologically correct
  const checkPlacement = useCallback((card: TriviaCard, index: number, currentTimeline: TriviaCard[]): boolean => {
    if (index === 0) {
      return card.year <= currentTimeline[0].year;
    }
    if (index === currentTimeline.length) {
      return card.year >= currentTimeline[currentTimeline.length - 1].year;
    }
    return (
      currentTimeline[index - 1].year <= card.year &&
      card.year <= currentTimeline[index].year
    );
  }, []);

  // Find correct index for wrong placement
  const findCorrectIndex = useCallback((card: TriviaCard, currentTimeline: TriviaCard[]): number => {
    for (let i = 0; i < currentTimeline.length; i++) {
      if (card.year < currentTimeline[i].year) {
        return i;
      }
    }
    return currentTimeline.length;
  }, []);

  // Handle card placement action
  const placeCard = useCallback((droppedIndex: number): { success: boolean; correctIndex: number } => {
    if (!currentCard || status !== "playing") {
      return { success: false, correctIndex: -1 };
    }

    const isCorrect = checkPlacement(currentCard, droppedIndex, timeline);
    const correctIndex = findCorrectIndex(currentCard, timeline);

    if (isCorrect) {
      const newTimeline = [...timeline];
      newTimeline.splice(droppedIndex, 0, currentCard);
      setTimeline(newTimeline);

      const newScore = score + 1;
      setScore(newScore);
      if (category) {
        updateHighScore(category, newScore);
      }

      if (deck.length > 0) {
        setCurrentCard(deck[0]);
        setDeck(deck.slice(1));
      } else {
        setCurrentCard(null);
        setStatus("gameover");
      }

      return { success: true, correctIndex: droppedIndex };
    } else {
      const newLives = lives - 1;
      setLives(newLives);

      const newTimeline = [...timeline];
      newTimeline.splice(correctIndex, 0, currentCard);
      setTimeline(newTimeline);

      if (newLives <= 0) {
        setCurrentCard(null);
        setStatus("gameover");
      } else {
        if (deck.length > 0) {
          setCurrentCard(deck[0]);
          setDeck(deck.slice(1));
        } else {
          setCurrentCard(null);
          setStatus("gameover");
        }
      }

      return { success: false, correctIndex };
    }
  }, [currentCard, timeline, score, lives, deck, category, status, checkPlacement, findCorrectIndex, updateHighScore]);

  const resetGame = useCallback(() => {
    setStatus("landing");
    setCategory(null);
    setTimeline([]);
    setCurrentCard(null);
    setScore(0);
    setLives(3);
  }, []);

  const restartGame = useCallback(() => {
    if (category) {
      startGame(category);
    }
  }, [category, startGame]);

  return {
    status,
    category,
    timeline,
    currentCard,
    score,
    lives,
    isLoading,
    highScores: highScores[category || ""] || 0,
    allHighScores: highScores,
    startGame,
    placeCard,
    resetGame,
    restartGame
  };
}
