# Plan: Fix Timeline Card Shifting Flips & Image Loss

This plan outlines the root cause and resolution for the bug where correctly placed timeline cards flip and lose their images during wrong-placement array sifting.

---

## 🔍 Root Cause Analysis

### 1. Why do timeline cards flip when another card shifts?
In `GameBoard.tsx`, the timeline cards are mapped using React:
```typescript
<TriviaCard 
  card={card} 
  revealed={true} 
  skipInitialFlip={idx === 0} 
  ...
/>
```
- The `skipInitialFlip` prop is calculated dynamically as `idx === 0`.
- When a card shifts index (e.g. from index 0 to 1, or 1 to 0) during timeline array splicing, its `skipInitialFlip` value changes.
- In `TriviaCard.tsx`, `skipInitialFlip` is listed as a dependency in the 3D flip `useEffect`:
  ```typescript
  useEffect(() => {
    ...
  }, [revealed, card.id, skipInitialFlip]);
  ```
- When `skipInitialFlip` changes, the effect triggers a full 3D flip animation (flipping the card face-down and back face-up), which is incorrect for cards already in the timeline.

### 2. Why does the flip cause the card to lose its image?
- Face A (Clue) and Face B (Year) are separate subtrees in the DOM, each rendering its own `<img />` tag.
- When the card flips face-down and then face-up, the hidden face's image mounts or becomes active. If the image is not fully cached or if the component remounts due to index changes, it triggers the `LOADING...` skeleton state.
- By preventing the flip in the first place, we eliminate the face transition entirely, preserving the loaded image.

---

## 🛠️ Proposed Solution

### 1. Remove `skipInitialFlip` from the Dependency List
In `TriviaCard.tsx`, we will remove `skipInitialFlip` from the `useEffect` dependencies:
```typescript
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
}, [revealed, card.id]); // Removed skipInitialFlip!
```
- **Result:** The flip animation runs only on initial mount (when `card.id` is first registered) or when `revealed` toggles. Subsequent changes to `skipInitialFlip` (from index sifting) will not trigger a flip.

### 2. Safeguard Image Component Caching
To ensure that both Face A and Face B share image loading state correctly and don't re-trigger loading when rotated, we will:
- Maintain the image loading state.
- Keep the `img` tags mounted on both faces so the browser retains their cached texture states.
