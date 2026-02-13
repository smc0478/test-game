# Square Survival (v0.2)

Minimal browser survival game based on `GAME_SPEC.md` v0.2.

## File Structure

- `index.html`: Canvas, HUD, game-over overlay, and script/style wiring.
- `style.css`: Visual styling for layout, canvas, HUD, and restart button.
- `game.js`: requestAnimationFrame game loop, state machine, input, spawning, collision, score, and restart flow.
- `GAME_SPEC.md`: Producer-authored numeric gameplay specification.
- `QA_P0_TEST_CASES.md`: QA acceptance test coverage.

## Run Instructions

1. Ensure these files exist in the repository root:
   - `index.html`
   - `style.css`
   - `game.js`
2. Start a local static server:
   - `python3 -m http.server 8000`
3. Open:
   - `http://localhost:8000`
4. Press Arrow keys or WASD to start playing from `ready` state.

## Controls

- Move: Arrow keys + WASD
- Restart: Click `Restart` button on game over

## Definition of Done Checklist (v0.2)

- [x] Local run works
- [x] No console error during normal play
- [x] No spec mismatch identified
- [x] Core loop playable once (`ready -> playing -> gameOver -> ready`)
- [x] PR created

## Spec / Implementation Consistency

- No known mismatches with `GAME_SPEC.md` v0.2.
