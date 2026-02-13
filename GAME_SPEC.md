# GAME_SPEC.md

## 1. Metadata
- **Project Name**: Square Survival
- **Spec Version**: v0.1
- **Owner Role**: Producer (Game Designer)
- **Last Updated**: 2026-02-13
- **Target Build**: Vertical Slice (Single playable loop)

---

## 2. Game Concept
A minimal 2D survival game played in the browser. The player controls a blue square and avoids red enemy squares that spawn from the top and move downward.

### Core Fantasy
- Survive as long as possible.
- Beat your previous score.

### Session Length Target
- **Average run**: 30–90 seconds
- **Max expected run (v0.1)**: 180 seconds

---

## 3. Scope (v0.1)

### In Scope
1. Player movement with keyboard input (Arrow keys + WASD)
2. Continuous enemy spawning
3. Collision-based game over
4. Score based on survival time
5. Restart button after death
6. Single screen UI (no multi-scene flow)

### Out of Scope
1. Audio / BGM / SFX
2. Power-ups or weapons
3. Multiple enemy types
4. Mobile controls
5. Save system / leaderboard backend

---

## 4. Platform & Technical Constraints
- **Platform**: Desktop browser
- **Tech**: HTML, CSS, JavaScript (no framework)
- **Required file split**:
  - `index.html`
  - `style.css`
  - `game.js`
- **Rendering**: HTML5 Canvas
- **Target FPS**: 60

---

## 5. Gameplay Rules (Numeric)

### 5.1 Player
- Shape: square
- Color: `#3498db`
- Size: **32 px × 32 px**
- Start position: canvas center-bottom at **(canvasWidth/2, canvasHeight - 64)**
- Move speed: **240 px/sec**
- Boundary: player cannot move outside canvas

### 5.2 Enemies
- Shape: square
- Color: `#e74c3c`
- Size: **28 px × 28 px**
- Spawn area X-range: **0 to (canvasWidth - enemySize)**
- Spawn Y: **-enemySize**
- Spawn interval: **every 700 ms**
- Fall speed: **140 px/sec**
- Despawn condition: `enemy.y > canvasHeight + enemySize`

### 5.3 Difficulty
- Every **15 seconds**, enemy fall speed increases by **+20 px/sec**
- Minimum spawn interval cap: **400 ms**
- Spawn interval reduction: **-50 ms every 20 seconds** (until cap)

### 5.4 Collision
- Rule: Axis-Aligned Bounding Box (AABB)
- On first collision:
  - state changes to `gameOver`
  - enemy spawn stops
  - final score shown

### 5.5 Score
- Score unit: integer points
- Formula: `floor(survivalTimeSeconds * 10)`
- Update cadence: every frame
- Display:
  - top-left: current score during play
  - center panel: final score on game over

---

## 6. UI/UX Specification

### 6.1 Layout
- Canvas size: **480 × 640 px**
- HUD:
  - Top-left: `Score: {value}`
  - Top-right: `Time: {seconds.toFixed(1)}s`
- Game Over overlay:
  - Title: `Game Over`
  - Final score text
  - Restart button

### 6.2 Visual Rules
- Background color: `#111827`
- Canvas border: `2 px solid #374151`
- Text color: `#f9fafb`
- Restart button height: **40 px**, width: **140 px**

### 6.3 Input Rules
- Movement keys: Arrow keys + WASD
- Simultaneous diagonal movement allowed
- Restart action: mouse click on button

---

## 7. Game States
The game must implement exactly these states:
1. `ready` – initial screen, waiting for first movement input
2. `playing` – active gameplay loop
3. `gameOver` – collision occurred, waiting for restart

### State Transitions
- `ready -> playing`: when movement key is pressed
- `playing -> gameOver`: on collision
- `gameOver -> ready`: when restart is clicked

---

## 8. Vertical Slice Definition (Done Criteria for v0.1)
The vertical slice is complete only when all conditions are true:
1. Game opens in browser with no console error for **60 seconds** of play.
2. Player movement works for all required keys.
3. At least **5 enemies** can spawn and move.
4. Collision reliably triggers game over.
5. Restart returns to ready state and score resets to **0**.
6. One full loop (`ready -> playing -> gameOver -> ready`) is playable.

---

## 9. Run Instructions (for Engineer handoff)
1. Ensure files exist: `index.html`, `style.css`, `game.js`.
2. Open `index.html` directly in browser, or run local static server:
   - Example: `python3 -m http.server 8000`
3. Navigate to `http://localhost:8000`.
4. Start game with movement key.

---

## 10. Spec-to-Implementation Mapping Template
Engineer must report these items in PR:
- [ ] Player movement
- [ ] Enemy spawn loop
- [ ] Collision & game over
- [ ] Score system
- [ ] Restart flow
- [ ] UI/HUD requirements

---

## 11. Known Risks / Clarifications
1. If browser tab is inactive, `requestAnimationFrame` timing may vary; score must still derive from elapsed time, not frame count.
2. If simultaneous opposite keys are pressed (e.g., left + right), net movement on that axis is **0**.
3. No random seed control is required in v0.1.

---

## 12. Change Log

### v0.1 (2026-02-13)
- Created initial full GAME_SPEC with numeric rules.
- Defined strict v0.1 scope and out-of-scope list.
- Added vertical slice completion criteria.
- Added explicit gameplay state machine and transition rules.
