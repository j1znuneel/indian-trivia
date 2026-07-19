import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

export interface TriviaCard {
  id: string;
  title: string;
  description: string;
  year: number;
  category: "history" | "sports" | "cinema" | "science" | "general";
  image?: string;
  wikidataId?: string;
  sourceUrl?: string;
}

const SHARDS_DIR = join(process.cwd(), "src", "data", "shards");

function parseWikidataDate(dateStr: string): number | null {
  if (!dateStr) return null;
  const match = dateStr.match(/^([+-]?\d+)/);
  if (match) {
    const year = parseInt(match[1], 10);
    // Ignore invalid or extreme dates outside human history timeline
    if (isNaN(year) || year < -3000 || year > 2026) return null;
    return year;
  }
  return null;
}

function getWikimediaImageUrl(imagePropValue: string): string | undefined {
  if (!imagePropValue) return undefined;
  // If full URI is provided, extract filename
  let filename = imagePropValue;
  if (filename.includes("Special:FilePath/")) {
    filename = filename.split("Special:FilePath/").pop() || filename;
  } else if (filename.includes("http")) {
    filename = decodeURIComponent(filename.split("/").pop() || filename);
  }
  
  filename = decodeURIComponent(filename).replace(/ /g, "_");
  if (!filename) return undefined;

  // Use Wikimedia Commons Special:FilePath with width parameter for fast thumbnail delivery
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=400`;
}

interface CategoryConfig {
  category: "history" | "sports" | "cinema" | "science" | "general";
  queries: string[];
}

const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    category: "history",
    queries: [
      // Battles & military conflicts in India
      `SELECT ?item ?itemLabel ?itemDescription ?date ?image WHERE {
        ?item wdt:P31 wd:Q178561.
        ?item wdt:P276 ?loc.
        ?loc wdt:P17 wd:Q668.
        ?item wdt:P585 ?date.
        OPTIONAL { ?item wdt:P18 ?image. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }`,
      // Indian elections & constitutional milestones
      `SELECT ?item ?itemLabel ?itemDescription ?date ?image WHERE {
        ?item wdt:P31 ?type.
        VALUES ?type { wd:Q5981504 wd:Q40231 wd:Q1076465 }
        ?item wdt:P17 wd:Q668.
        ?item wdt:P585 ?date.
        OPTIONAL { ?item wdt:P18 ?image. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }`,
      // Indian Independence / Historical events
      `SELECT ?item ?itemLabel ?itemDescription ?date ?image WHERE {
        ?item wdt:P17 wd:Q668.
        ?item wdt:P31 wd:Q1190554. # historical event
        ?item wdt:P585 ?date.
        OPTIONAL { ?item wdt:P18 ?image. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }`
    ]
  },
  {
    category: "sports",
    queries: [
      // Sports events / competitions involving India
      `SELECT ?item ?itemLabel ?itemDescription ?date ?image WHERE {
        ?item wdt:P17 wd:Q668.
        ?item wdt:P641 ?sport.
        ?item wdt:P585 ?date.
        OPTIONAL { ?item wdt:P18 ?image. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }`,
      // Indian sports trophies, leagues & achievements
      `SELECT ?item ?itemLabel ?itemDescription ?date ?image WHERE {
        ?item wdt:P31 ?type.
        VALUES ?type { wd:Q13406554 wd:Q1656682 wd:Q535480 } # cricket tournament, sports league, championship
        ?item wdt:P17 wd:Q668.
        { ?item wdt:P585 ?date. } UNION { ?item wdt:P571 ?date. }
        OPTIONAL { ?item wdt:P18 ?image. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }`
    ]
  },
  {
    category: "cinema",
    queries: [
      // Indian Cinema films
      `SELECT ?item ?itemLabel ?itemDescription ?date ?image WHERE {
        ?item wdt:P31 wd:Q11424.
        ?item wdt:P495 wd:Q668.
        ?item wdt:P577 ?date.
        OPTIONAL { ?item wdt:P18 ?image. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }`
    ]
  },
  {
    category: "science",
    queries: [
      // Science & Tech institutes, space missions, observatories
      `SELECT ?item ?itemLabel ?itemDescription ?date ?image WHERE {
        ?item wdt:P31 ?type.
        VALUES ?type { wd:Q3918 wd:Q1205341 wd:Q35257 wd:Q26540 wd:Q223799 } # university, research inst, observatory, space mission, satellite
        ?item wdt:P17 wd:Q668.
        { ?item wdt:P571 ?date. } UNION { ?item wdt:P585 ?date. } UNION { ?item wdt:P619 ?date. }
        OPTIONAL { ?item wdt:P18 ?image. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }`
    ]
  },
  {
    category: "general",
    queries: [
      // Monuments, bridges, UNESCO heritage sites, transport milestones in India
      `SELECT ?item ?itemLabel ?itemDescription ?date ?image WHERE {
        ?item wdt:P17 wd:Q668.
        ?item wdt:P31 ?type.
        VALUES ?type { wd:Q44539 wd:Q12280 wd:Q839954 wd:Q928830 wd:Q570116 } # temple, bridge, archaeological site, monument, railway line
        { ?item wdt:P571 ?date. } UNION { ?item wdt:P1619 ?date. } UNION { ?item wdt:P585 ?date. }
        OPTIONAL { ?item wdt:P18 ?image. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }`
    ]
  }
];

async function fetchWikidataBatch(sparqlQuery: string, limit = 500, offset = 0): Promise<any[]> {
  const queryWithPagination = `${sparqlQuery} LIMIT ${limit} OFFSET ${offset}`;
  const wikidataUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(queryWithPagination)}&format=json`;

  try {
    const response = await fetch(wikidataUrl, {
      headers: {
        "User-Agent": "BharatChronoIngest/2.0 (contact@bharatchrono.org)",
        "Accept": "application/sparql-results+json",
      },
    });

    if (!response.ok) {
      console.warn(`[SPARQL Warn] ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.results?.bindings || [];
  } catch (err) {
    console.error("[SPARQL Error]", err);
    return [];
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runIngestion() {
  console.log("🚀 Starting BharatChrono 5,000+ Trivia Card Ingestion Pipeline...");

  if (!existsSync(SHARDS_DIR)) {
    mkdirSync(SHARDS_DIR, { recursive: true });
  }

  const allCards: TriviaCard[] = [];
  const seenTitles = new Set<string>();
  const seenQIDs = new Set<string>();

  for (const config of CATEGORY_CONFIGS) {
    const categoryCards: TriviaCard[] = [];
    console.log(`\n📥 Ingesting Category: [${config.category.toUpperCase()}]`);

    for (let qIdx = 0; qIdx < config.queries.length; qIdx++) {
      const baseQuery = config.queries[qIdx];
      let offset = 0;
      const limit = 500;
      let hasMore = true;

      while (hasMore) {
        console.log(` Fetching query #${qIdx + 1} (Limit: ${limit}, Offset: ${offset})...`);
        const bindings = await fetchWikidataBatch(baseQuery, limit, offset);
        
        if (bindings.length === 0) {
          hasMore = false;
          break;
        }

        let addedInBatch = 0;

        for (const b of bindings) {
          const itemUri = b.item?.value || "";
          const qid = itemUri.split("/").pop() || "";
          const title = (b.itemLabel?.value || "").trim();
          const description = (b.itemDescription?.value || "Historical event in India.").trim();
          const dateStr = b.date?.value || "";
          const year = parseWikidataDate(dateStr);
          const image = getWikimediaImageUrl(b.image?.value);

          // Validation filters
          if (!qid || !title || /^Q\d+$/.test(title) || year === null) continue;
          
          // Deduplication check
          const normalizedTitle = title.toLowerCase();
          if (seenTitles.has(normalizedTitle) || seenQIDs.has(qid)) continue;

          seenTitles.add(normalizedTitle);
          seenQIDs.add(qid);

          const card: TriviaCard = {
            id: `card_${config.category}_${qid}`,
            title,
            description,
            year,
            category: config.category,
            ...(image ? { image } : {}),
            wikidataId: qid,
            sourceUrl: itemUri
          };

          categoryCards.push(card);
          allCards.push(card);
          addedInBatch++;
        }

        console.log(`    + Added ${addedInBatch} valid cards (Total for category: ${categoryCards.length})`);

        if (bindings.length < limit || offset >= 3000) {
          hasMore = false;
        } else {
          offset += limit;
          // Rate-limiting delay to respect Wikidata limits
          await sleep(1500);
        }
      }
    }

    // Save category shard
    const shardPath = join(SHARDS_DIR, `${config.category}.json`);
    writeFileSync(shardPath, JSON.stringify(categoryCards, null, 2), "utf-8");
    console.log(`✅ Category [${config.category}] saved to ${shardPath} (${categoryCards.length} cards)`);
  }

  // Save all cards master dataset
  const masterPath = join(SHARDS_DIR, "all.json");
  writeFileSync(masterPath, JSON.stringify(allCards, null, 2), "utf-8");

  // Save manifest summary
  const manifest = {
    generatedAt: new Date().toISOString(),
    totalCards: allCards.length,
    categories: CATEGORY_CONFIGS.map(c => ({
      name: c.category,
      count: allCards.filter(card => card.category === c.category).length
    }))
  };

  const manifestPath = join(SHARDS_DIR, "manifest.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");

  console.log(`\n🎉 Ingestion Complete!`);
  console.log(`📊 Total Ingested Cards: ${allCards.length}`);
  console.log(`📁 Files written to: ${SHARDS_DIR}`);
}

// Run ingestion if invoked directly
runIngestion().catch(console.error);
