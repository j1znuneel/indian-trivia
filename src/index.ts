import { serve } from "bun";
import index from "./index.html";
import { TRIVIA_DATA, TriviaCard } from "./data/trivia";
import { maskSpoilers } from "./lib/utils";

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes
    "/*": index,

    // Fast local API endpoint serving curated, image-verified trivia cards
    "/api/wikidata": async req => {
      const url = new URL(req.url);
      const category = url.searchParams.get("category") || "general";

      try {
        let matchingCards = TRIVIA_DATA.filter(card => card.category === category);
        
        // If category requested is general or unsupported, mix across all categories
        if (category === "general" || matchingCards.length < 2) {
          matchingCards = [...TRIVIA_DATA];
        }

        const sanitized = matchingCards.map(card => ({
          ...card,
          title: maskSpoilers(card.title || ""),
          description: maskSpoilers(card.description || "")
        }));

        const shuffled = shuffle(sanitized);
        const selected = shuffled.slice(0, 10);

        return Response.json(selected);
      } catch (err: any) {
        console.error(`[API Error]`, err);
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
