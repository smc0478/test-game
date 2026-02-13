# GAME_SPEC.md

## Spec Version
- **Version:** v0.2.0
- **Project:** Synergy Turn Card Battle
- **Owner Role:** Producer (Game Designer)
- **Language:** English
- **Last Updated:** 2026-02-13

## Metadata
- **Game Type:** Turn-based card battle
- **Mode:** Single battle
- **Participants:** Player vs AI enemy
- **Deck Size:** 12 cards fixed in v0.2
- **Card Pool Size (v0.2):** 12 cards
- **Randomness:** Deck shuffle and draw order only

---

## 1) Design Goal
v0.2 expands v0.1 with larger deterministic combat depth while maintaining a strict state machine and numeric-only resolution.

---

## 2) Scope

### Scope In (v0.2)
- Single battle scene, one enemy archetype.
- State machine:
  - `ready`
  - `playerTurn`
  - `enemyTurn`
  - `resolution`
  - `gameOver`
- 12-card deck and 12-card pool.
- Numeric card effects only.
- Sigil synergy + multiplier logic.
- **New:** Momentum mechanic (energy refund trigger).
- **New:** Card image field and in-hand visual card art rendering.
- Win/lose judgment and score output.

### Scope Out (v0.2)
- Map/shop/save/multiplayer/permanent deck editing.
- Additional enemy archetypes.
- Ambiguous or text-only effects.

---

## 3) Core Battle Rules
- Player HP: 60
- Enemy HP: 70
- Energy per turn: 3
- Initial draw: 5
- Start-of-turn draw: 5
- Max hand size: 8
- Hand overflow rule: extra draws are burned to discard.
- Block resets at owner turn start.
- Simultaneous KO => Defeat.

---

## 4) Card Data Model
Each card object must include:
- `id`
- `name`
- `type` (`attack` | `skill`)
- `energyCost`
- `baseValue`
- `sigil` (`Flame` | `Leaf` | `Gear` | `Void`)
- `image` (string URL or data URI)
- `effect(context)` (pure numeric function intent)

---

## 5) Sigil Synergy & Multiplier
- Sigil counter tracked per turn.
- Synergy active when same sigil count reaches 2+ (including current card).
- Flame synergy: attack +3 (matching card).
- Leaf synergy: block +3 (matching card).
- Gear synergy: draw +1 on qualifying card resolution.
- Void synergy: card score x1.5 (floor) on qualifying card resolution.
- Full-spectrum turn (all 4 sigils in one turn): turn score x2.
- Full-spectrum bonus score: +25 once per turn.

---

## 6) New v0.2 Mechanic: Momentum
- If active side resolves 3 or more cards in one turn, trigger once:
  - `+1 energy`
- Trigger limit: once per turn per side.
- Deterministic, no RNG.

---

## 7) Card List (v0.2 Fixed Pool: 12)

### Attack
1. C001 Ember Strike (Flame, 1, 7)
2. C002 Ember Strike+ (Flame, 1, 9)
3. C003 Thorn Jab (Leaf, 1, 6)
4. C004 Cog Shot (Gear, 1, 6)
5. C005 Null Pierce (Void, 1, 5)
6. C012 Abyss Cut (Void, 2, 12)

### Skill
7. C006 Bark Guard (Leaf, 1, 8)
8. C007 Clockwork Guard (Gear, 1, 7)
9. C008 Spark Cycle (Gear, 1, draw 1)
10. C009 Ashen Focus (Flame, 1, next attack +2)
11. C010 Void Echo (Void, 1, reduce enemy block by 2)
12. C011 Verdant Pulse (Leaf, 2, 12)

---

## 8) AI Behavior
Enemy type: Training Automaton
Priority:
1. Lethal attack
2. Highest immediate damage
3. Highest immediate block card if HP <= 25
4. First playable card

---

## 9) Scoring System (v0.2)
- Base score (player card only):
  - Attack resolve: +10
  - Skill resolve: +8
- Win bonus: +120
- Win with player HP >= 40: +40
- Full-spectrum bonus: +25 once per player turn
- Defeat: final score 0
- Enemy card resolutions do not grant score.

---

## 10) Win/Lose Conditions
- Win: enemy HP <= 0
- Lose: player HP <= 0
- Simultaneous KO: Lose

---

## 11) Implementation Notes
Required files:
- `index.html`
- `style.css`
- `game.js`

State constants required:
- `STATE_READY`
- `STATE_PLAYER_TURN`
- `STATE_ENEMY_TURN`
- `STATE_RESOLUTION`
- `STATE_GAME_OVER`

---

## 12) QA P0 Focus (v0.2)
1. State transition validity.
2. 12-card pool/deck integrity.
3. Hand overflow burn rule.
4. Synergy thresholds and per-card application.
5. Momentum trigger exactly once per turn.
6. Enemy score exclusion.
7. Win/lose and score bonus validation.
8. Card image render availability.

---

## Change Log

### v0.2.0 (2026-02-13)
- Expanded fixed card pool from 10 to 12 (`C011`, `C012`).
- Added card `image` field and visual card art requirement.
- Added momentum mechanic (+1 energy on 3rd card each turn, once).
- Added hand-overflow burn rule at max hand 8.
- Updated scoring: enemy resolutions excluded from score.
- Updated bonus values: win +120, high-HP +40, full-spectrum +25.

### v0.1.0 (2026-02-13)
- Initial vertical slice spec created.
