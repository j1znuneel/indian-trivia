# 🇮🇳 WIKINDIA TRIVIA: Neubrutalist Indian Trivia Timeline Game

A visually stunning, Neubrutalist-themed chronological sorting game where players arrange historical, cultural, scientific, cinematic, and sporting events of India on an interactive timeline. The game features an infinite "Higher or Lower" loop that runs until all lives are lost, complete with dynamic scoring titles and real-time image prefetching.

---

## 🎮 Game Rules & Mechanics

1. **The Board:** The game starts with one baseline card placed in the center of the timeline with its year revealed (e.g., *Battle of Hydaspes, 325 BCE*).
2. **Sorting:** You draw a card from the deck showing a title and an image, but no year (Face A). You must drag-and-drop or click-select to place it at the chronologically correct position on the timeline relative to other cards.
3. **Lives & Feedback:**
   * **Correct Placement:** The card flips to reveal its year and description (Face B) and flashes green. Your score increments by 1.
   * **Incorrect Placement:** The card flashes red, you lose 1 life (out of 3), and all cards in the timeline slide smoothly to make room as the card glides into its correct position.
4. **Infinite Mode:** The game goes on infinitely. The deck contains up to 150 unique cards per category, and the session ends when you lose all 3 lives.

---

## 🏗️ Architecture & Technology Stack

The application is built as a single-repository React + TypeScript web app served by a high-performance backend API proxy:

### 1. Frontend Client
* **Framework:** React 18 + TypeScript + Vite.
* **Styling:** Vanilla Tailwind CSS with custom Neubrutalist utility classes (thick black borders, harsh shadows, flat saturated colors, retro dot-pattern background, and monospace text).
### 2. Backend API Proxy Server
* **Engine:** Powered by Bun, running a lightweight HTTP server in `src/index.ts`.
* **Role:** Serves as a secure proxy (`/api/wikidata`) to execute Wikidata SPARQL queries, bypassing client-side CORS restrictions, mapping data schemas, and resolving third-party assets.

---

## 📡 Data Resolution Pipeline (Where & How Data is Queried)

When a player selects a category, the server resolves cards using a multi-tiered fallback architecture:

```
                  Category Selected
                         │
                         ▼
           ┌───────────────────────────┐
           │ 1. Static Shard exists?   │── Yes (Fast Local File Load) ──> [ Serve Cards ]
           └───────────────────────────┘
                         │ No
                         ▼
           ┌───────────────────────────┐
           │ 2. In-Memory Cache valid? │── Yes (Cached JSON Response) ──> [ Serve Cards ]
           └───────────────────────────┘
                         │ No
                         ▼
           ┌───────────────────────────┐
           │ 3. Query Wikidata SPARQL  │── Yes (Fetch Live Wikidata API)
           └───────────────────────────┘
                         │
                         ▼
           ┌───────────────────────────┐
           │ 4. Resolve Movie Posters  │ (If Category is Cinema/Movies)
           │    via Wikipedia API      │
           └───────────────────────────┘
                         │
                         ▼
           ┌───────────────────────────┐
           │ 5. Filter & Deduplicate   │──> [ Cache & Serve Shuffled Cards ]
           └───────────────────────────┘
```

### 1. Static Shards (Primary)
The server first checks if a static JSON shard is available at `./src/data/shards/<category>.json`. Sharding provides near-instant loading times and offline development capabilities.

### 2. Live Wikidata SPARQL Queries (Secondary)
If no static shard exists, the server queries the official **Wikidata Query Service** (`https://query.wikidata.org/sparql`) with custom SPARQL queries. 
* To restrict events strictly to India, queries leverage properties like `wdt:P17 wd:Q668` (Country: India) or `wdt:P495 wd:Q668` (Country of Origin: India).
* Queries are capped to retrieve up to **150 unique results** per category to support long-lasting sessions.
* Wikidata queries are cached in-memory (`CACHE_TTL` = 10 minutes) to respect Wikimedia rate limits.

### 3. Wikipedia PageImages API (Fair-Use Poster Resolution)
In the **Cinema & Arts** category, standard Wikidata image properties (`wdt:P18`) are missing for most Indian films due to copyright rules on Wikimedia Commons. 
* To display the actual **movie posters**, the server queries Wikidata for the film's English Wikipedia article link (`?articleTitle`).
* The server then queries Wikipedia's public **PageImages API** in parallel:
  `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=400&titles=<articleTitle>&origin=*`
* Because English Wikipedia hosts movie posters under fair-use guidelines, this API returns the actual movie poster for almost 100% of notable films.

### 4. Client-Side Offline Curation Fallback (Tertiary)
If the server is offline or the Wikidata queries fail, the client (`useGameState.ts`) catches the error and falls back to a locally curated dataset of ~100 high-quality historical events stored in `src/data/trivia.ts`.

---

## 🛠️ Performance & UX Optimizations

* **Image Prefetching:** All images and Wikipedia posters are prefetched and cached by the browser as soon as the game begins. This eliminates layout shifts (CLS) and guarantees that skeletons are rarely visible.
* **React Image Load Cache Failsafe:** A custom React `ref` callback checks `el.complete` on all images. If an image is served instantly from the browser cache, we bypass the `onLoad` trigger (which sometimes fails to fire for cached elements), ensuring that the card's loading skeleton is cleared immediately.
* **Dynamic End-of-Game Screen:** Renders dynamic score-based headers (`Game Over`, `Good Effort!`, `Impressive!`, `Wiki Legend!`) and awards Wiki-themed editor ranks (e.g. *Anonymous IP Editor*, *Stub Creator*, *Wiki Citation Editor*, *Sysop*, up to *Jimmy Wales Envoy*).

---

## 🚀 Running the Project

### Installation
Install dependencies using Bun:
```bash
bun install
```

### Run Development Server
Launches the Bun proxy server and client hot-reloading:
```bash
bun dev
```

### Build for Production
Compiles the React bundle:
```bash
bun run build
```
