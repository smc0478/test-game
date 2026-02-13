# GAME_SPEC.md

## 1. Metadata
- **Project Name**: Square Survival
- **Spec Version**: v0.2
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
- **Max expected run (v0.2)**: 180 seconds

---

## 3. Scope (v0.2)

### In Scope
1. Player movement with keyboard input (Arrow keys + WASD)
2. Continuous enemy spawning
3. Collision-based game over
4. Score based on survival time
5. Restart button after death
6. Single screen UI (no multi-scene flow)
7. P0 QA-verifiable acceptance criteria for the vertical slice

### Out of Scope
1. Audio / BGM / SFX
2. Power-ups or weapons
3. Multiple enemy types
4. Mobile controls
5. Save system / leaderboard backend
6. Any new gameplay mechanics beyond v0.1 core loop

### v0.1 → v0.2 Scope Delta (Explicit)
- Added explicit QA acceptance criteria mapping to P0 test coverage.
- Added measurement tolerances for timing-related checks to reduce ambiguity during QA.
- No new feature mechanic was added (scope creep prevented).

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
- Spawn interval base: **700 ms**
- Fall speed base: **140 px/sec**
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
- Opposite keys on same axis cancel each other (net 0)
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

## 8. Vertical Slice Definition (Done Criteria for v0.2)
The vertical slice is complete only when all conditions are true:
1. Game opens in browser with no console error for **60 seconds** of play.
2. Player movement works for Arrow keys and WASD (including diagonal).
3. Opposite-direction key inputs cancel per axis (net 0 movement).
4. At least **5 enemies** can spawn and move.
5. Collision reliably triggers one `playing -> gameOver` transition.
6. Restart returns to `ready` state and score resets to **0**.
7. One full loop (`ready -> playing -> gameOver -> ready`) is playable.

---

## 9. QA P0 Acceptance Criteria (v0.2)
These rules align spec validation with `QA_P0_TEST_CASES.md`.

1. **State Initialization**: On page load, state is `ready`, score is `0`, and no active spawn loop before first movement input.
2. **Input Coverage**: Arrow and WASD movement must be valid and bounded by canvas edges.
3. **Enemy Validity**: Enemy size is **28 × 28**, spawn y is **-28**, spawn x is within `[0, canvasWidth - enemySize]`.
4. **Timing Validation Tolerance**:
   - Spawn interval checks use average measured interval over at least **10 seconds**.
   - Acceptable measurement tolerance: **±80 ms** per target step due to browser timer jitter.
5. **Difficulty Validation**:
   - Fall speed changes at **15s** intervals in **+20 px/sec** steps.
   - Spawn interval changes at **20s** intervals in **-50 ms** steps and never below **400 ms**.
6. **Collision & Stop Condition**: First AABB overlap triggers game over exactly once; no further enemy spawns after transition.
7. **Score Formula Validation**: HUD score must match `floor(elapsedSeconds * 10)`.
8. **HUD & Overlay Validation**: Required labels and restart button dimensions (**140 × 40**) must match the spec.

---

## 10. Run Instructions (for Engineer handoff)
1. Ensure files exist: `index.html`, `style.css`, `game.js`.
2. Open `index.html` directly in browser, or run local static server:
   - Example: `python3 -m http.server 8000`
3. Navigate to `http://localhost:8000`.
4. Start game with movement key.

---

## 11. Spec-to-Implementation Mapping Template
Engineer must report these items in PR:
- [ ] Player movement
- [ ] Enemy spawn loop
- [ ] Collision & game over
- [ ] Score system
- [ ] Restart flow
- [ ] UI/HUD requirements
- [ ] QA P0 acceptance alignment

---

## 12. Known Risks / Clarifications
1. If browser tab is inactive, `requestAnimationFrame` timing may vary; score must still derive from elapsed time, not frame count.
2. If simultaneous opposite keys are pressed (e.g., left + right), net movement on that axis is **0**.
3. No random seed control is required in v0.2.
4. Timing-related QA checks should use averaged measurements, not single-frame observations.

---

## 13. Change Log

### v0.2 (2026-02-13)
- Updated spec version from **v0.1** to **v0.2** based on QA P0 test-case feedback.
- Added explicit `v0.1 -> v0.2` scope delta section to clarify what changed.
- Added `QA P0 Acceptance Criteria` section to remove ambiguity in validation.
- Added timing measurement tolerance (**±80 ms**) for spawn-interval verification.
- Clarified input behavior (opposite keys cancel on same axis) in input rules and done criteria.
- Expanded vertical slice done criteria to map to P0-critical checks.
- **Numeric change rationale**: Added **±80 ms QA tolerance** only for measurement/verification stability under browser timer jitter; gameplay values (speed, spawn cadence, sizes, score formula) remain unchanged.

### v0.1 (2026-02-13)
- Created initial full GAME_SPEC with numeric rules.
- Defined strict v0.1 scope and out-of-scope list.
- Added vertical slice completion criteria.
- Added explicit gameplay state machine and transition rules.
