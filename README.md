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

--

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
