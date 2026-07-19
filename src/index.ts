import { serve } from "bun";
import index from "./index.html";
import { maskSpoilers } from "./lib/utils";

interface TriviaCard {
  id: string;
  title: string;
  description: string;
  year: number;
  category: string;
}

interface CacheEntry {
  timestamp: number;
  cards: TriviaCard[];
}

// In-memory cache for Wikidata query results (expires after 10 minutes)
const cache: Record<string, CacheEntry> = {};
const CACHE_TTL = 10 * 60 * 1000;

function parseWikidataDate(dateStr: string): number | null {
  if (!dateStr) return null;
  // Match standard ISO year format, handles BCE negative signs (-2500) and CE positive signs
  const match = dateStr.match(/^([+-]?\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
}

function getSPARQLQuery(category: string): string {
  switch (category) {
    case "sports":
      return `SELECT ?item ?itemLabel ?itemDescription ?date ?image WHERE {
        {
          SELECT DISTINCT ?item ?date WHERE {
            ?item wdt:P17 wd:Q668.
            ?item wdt:P641 ?sport.
            ?item wdt:P585 ?date.
          } LIMIT 50
        }
        OPTIONAL { ?item wdt:P18 ?image }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }`;
    case "history":
      return `SELECT ?item ?itemLabel ?itemDescription ?date ?image WHERE {
        {
          SELECT DISTINCT ?item ?date WHERE {
            {
              ?item wdt:P31 wd:Q5981504. # general elections in India
              ?item wdt:P585 ?date.
            } UNION {
              ?item wdt:P31 wd:Q178561. # battle
              ?item wdt:P276 ?loc.      # location
              ?loc wdt:P17 wd:Q668.     # country: India
              ?item wdt:P585 ?date.
            }
          } LIMIT 50
        }
        OPTIONAL { ?item wdt:P18 ?image }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }`;
    case "cinema":
      return `SELECT ?item ?itemLabel ?itemDescription ?date ?image WHERE {
        {
          SELECT DISTINCT ?item ?date WHERE {
            ?item wdt:P31 wd:Q11424.
            ?item wdt:P495 wd:Q668.
            ?item wdt:P577 ?date.
          } LIMIT 50
        }
        OPTIONAL { ?item wdt:P18 ?image }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }`;
    case "science":
      return `SELECT ?item ?itemLabel ?itemDescription ?date ?image WHERE {
        {
          SELECT DISTINCT ?item ?date WHERE {
            ?item wdt:P31 ?type.
            VALUES ?type { wd:Q3918 wd:Q1205341 wd:Q35257 } # university, research institute, observatory
            ?item wdt:P17 wd:Q668.
            ?item wdt:P571 ?date.
          } LIMIT 50
        }
        OPTIONAL { ?item wdt:P18 ?image }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }`;
    default: // general
      return `SELECT ?item ?itemLabel ?itemDescription ?date ?image WHERE {
        {
          SELECT DISTINCT ?item ?date WHERE {
            ?item wdt:P17 wd:Q668.
            ?item wdt:P31 ?type.
            VALUES ?type { wd:Q44539 wd:Q12280 } # temple, bridge
            ?item wdt:P571 ?date.
          } LIMIT 50
        }
        OPTIONAL { ?item wdt:P18 ?image }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }`;
  }
}

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    // Fast local API endpoint powered by pre-ingested JSON shards
    "/api/wikidata": async req => {
      const url = new URL(req.url);
      const category = url.searchParams.get("category") || "general";

      try {
        let cards: TriviaCard[] = [];
        const shardPath = `./src/data/shards/${category}.json`;
        const shardFile = Bun.file(shardPath);

        // 1. Try reading from pre-ingested static JSON shard
        if (await shardFile.exists()) {
          const shardData = await shardFile.json();
          if (Array.isArray(shardData) && shardData.length >= 2) {
            cards = shardData.map((card: any) => ({
              ...card,
              title: maskSpoilers(card.title || ""),
              description: maskSpoilers(card.description || "")
            }));
            console.log(`[Shard Hit] Served ${cards.length} cards from shard: ${shardPath}`);
          }
        }

        // 2. Fallback to live query or cache if shard is not present
        if (cards.length < 2) {
          const now = Date.now();
          if (cache[category] && now - cache[category].timestamp < CACHE_TTL) {
            cards = cache[category].cards;
          } else {
            console.log(`[Shard Miss] Fetching live from Wikidata for category: ${category}`);
            const sparql = getSPARQLQuery(category);
            const wikidataUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
            
            const response = await fetch(wikidataUrl, {
              headers: {
                "User-Agent": "BharatChrono/1.0 (contact@bharatchrono.org)",
                "Accept": "application/sparql-results+json",
              },
            });

            if (response.ok) {
              const json = await response.json();
              const bindings = json.results?.bindings || [];

              cards = bindings
                .map((b: any, idx: number) => {
                  const dateStr = b.date?.value;
                  const year = parseWikidataDate(dateStr);
                  const id = `wiki_${category}_${idx}_${Date.now()}`;
                  const title = maskSpoilers(b.itemLabel?.value || "");
                  const description = maskSpoilers(b.itemDescription?.value || "Historical milestone in India.");
                  const image = b.image?.value ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(b.image.value.split("/").pop())}?width=400` : null;

                  if (year === null || !title || /^Q\d+$/.test(title)) return null;

                  return { id, title, description, year, category, image };
                })
                .filter((card: any) => card !== null) as TriviaCard[];

              if (cards.length >= 2) {
                cache[category] = { timestamp: now, cards };
              }
            }
          }
        }

        if (cards.length < 2) {
          throw new Error("Insufficient cards available");
        }

        // Shuffle and select 10 random cards for the game session
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 10);

        return Response.json(selected);
      } catch (err: any) {
        console.error(`[Card Fetch Error]`, err);
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
