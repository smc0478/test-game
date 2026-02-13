# QA P0 Test Cases (v0.1)

This document defines **20 P0 test cases** and a **bug report template** for validating `GAME_SPEC.md` v0.1.

## Scope
- Spec baseline: `GAME_SPEC.md` v0.1
- Priority: P0 (must-pass for vertical slice sign-off)

## P0 Test Cases (20)

| ID | Title | Preconditions | Steps | Expected Result |
|---|---|---|---|---|
| P0-01 | Launch without runtime errors | Local server running (`python3 -m http.server 8000`) | 1) Open `http://localhost:8000` 2) Keep game open for 60s | No console errors for 60s; game remains responsive |
| P0-02 | Initial state is `ready` | Game page freshly loaded | 1) Load page 2) Do not press any key | State is `ready`; no enemy movement loop active; score shown as 0 |
| P0-03 | `ready -> playing` on first movement input | State is `ready` | 1) Press `ArrowLeft` once | State transitions to `playing` immediately |
| P0-04 | Arrow key movement works | State is `playing` | 1) Hold `ArrowLeft` 2) Hold `ArrowRight` 3) Hold `ArrowUp` 4) Hold `ArrowDown` | Player moves correctly on each axis |
| P0-05 | WASD movement works | State is `playing` | 1) Hold `A` 2) Hold `D` 3) Hold `W` 4) Hold `S` | Player moves correctly on each axis |
| P0-06 | Diagonal movement is allowed | State is `playing` | 1) Hold `W` + `D` together for 1s | Player moves diagonally (up-right) |
| P0-07 | Opposite keys cancel on same axis | State is `playing` | 1) Hold `A` + `D` together for 1s 2) Hold `W` + `S` together for 1s | Net movement on each tested axis is 0 |
| P0-08 | Player cannot exit canvas bounds | State is `playing` | 1) Hold left key to edge 2) Hold up key to edge 3) Hold right key to edge 4) Hold down key to edge | Player remains fully inside 480x640 canvas |
| P0-09 | Enemy spawn location and size are valid | State is `playing` | 1) Observe multiple enemy spawns | Every enemy is 28x28, spawns at `y=-28`, and x is within `[0, canvasWidth-enemySize]` |
| P0-10 | Enemy spawn interval starts at 700 ms | State is `playing` | 1) Measure spawn timing over first 10s (DevTools/perf markers) | Average interval near 700ms at initial difficulty |
| P0-11 | At least 5 enemies spawn and fall | State is `playing` | 1) Survive for at least 5s | 5+ enemies spawn and move downward visibly |
| P0-12 | Enemy despawn rule applies | State is `playing` | 1) Let enemies pass without collision 2) Track one enemy off-screen | Enemy is removed when `enemy.y > canvasHeight + enemySize` |
| P0-13 | Fall speed increases every 15s (+20 px/s) | State is `playing` | 1) Survive 30s 2) Compare enemy speed at 0s, 15s, 30s | Enemy fall speed increases stepwise by +20 px/s every 15s |
| P0-14 | Spawn interval decreases every 20s (-50 ms) with cap 400 ms | State is `playing` | 1) Survive 80s 2) Measure interval at 0s/20s/40s/60s/80s | Interval decreases by 50ms every 20s and never goes below 400ms |
| P0-15 | Collision uses AABB and triggers game over once | State is `playing` | 1) Move into an enemy square | On first overlap, state becomes `gameOver`; no duplicate transition effects |
| P0-16 | Spawning stops after game over | State changed to `gameOver` | 1) Trigger collision 2) Observe for 3s | No new enemies spawn after `gameOver` |
| P0-17 | Score formula is correct (`floor(seconds*10)`) | State is `playing` | 1) Note elapsed time at HUD 2) Compare with score | Score equals `floor(survivalTimeSeconds * 10)` |
| P0-18 | HUD positions and formats are correct | State is `playing` | 1) Observe HUD during run | Top-left shows `Score: {value}`; top-right shows `Time: {seconds.toFixed(1)}s` |
| P0-19 | Game over overlay content and restart button spec | State is `gameOver` | 1) Trigger collision 2) Inspect overlay and button dimensions | Overlay shows `Game Over`, final score, and restart button (140x40) |
| P0-20 | Full loop works and reset is clean | State is `gameOver` | 1) Click Restart 2) Verify reset 3) Start again with movement key | Transition is `gameOver -> ready`; score resets to 0; game can re-enter `playing` |

---

## Bug Report Template

```md
# Bug Report

## 1) Summary
- **Bug ID**: BUG-YYYYMMDD-XXX
- **Title**:
- **Priority**: P0 / P1 / P2
- **Severity**: Critical / Major / Minor
- **Environment**: (OS, Browser, Version)
- **Build/Commit**:
- **Spec Reference**: (e.g., GAME_SPEC.md §5.4 Collision)

## 2) Preconditions
- 

## 3) Steps to Reproduce
1. 
2. 
3. 

## 4) Expected Result
- 

## 5) Actual Result
- 

## 6) Evidence
- **Console Logs**:
- **Screenshots / Video**:
- **Timestamp**:

## 7) Reproducibility
- Always / Sometimes / Rare
- Repro Rate: X / Y

## 8) Impact Assessment
- Gameplay impact:
- User-facing risk:
- Regression risk:

## 9) Temporary Workaround (if any)
- 

## 10) Notes
- 
```
