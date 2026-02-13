# GAME_SPEC.md

## Spec Version
- **Version:** v0.3.0
- **Project:** Synergy Turn Card Battle
- **Owner Role:** Producer (Game Designer)
- **Language:** English
- **Last Updated:** 2026-02-13

## Metadata
- **Game Type:** Turn-based card battle
- **Mode:** Single battle
- **Participants:** Player vs AI enemy
- **Deck Size:** 12 cards fixed in v0.3
- **Card Pool Size (v0.3):** 12 cards
- **Randomness:** Deck shuffle and draw order only

---

## 1) Design Goal
v0.3 focuses on "dopamine" combat pacing through chained sigil play, burst rewards, and stronger cross-sigil payoff while preserving deterministic numeric resolution.

---

## 2) Scope

### Scope In (v0.3)
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
- Momentum mechanic (+1 energy on 3rd card, once/turn).
- Card image field and in-hand visual card art rendering.
- **New:** Combo Chain system for consecutive different sigils.
- **New:** Prism Burst trigger on max chain.
- **New:** Adrenaline trigger when 2+ sigil synergies are active in one turn.
- Win/lose judgment and score output.

### Scope Out (v0.3)
- Map/shop/save/multiplayer/permanent deck editing.
- Additional enemy archetypes.
- Ambiguous or text-only effects.

---

## 3) Core Battle Rules
- Player HP: 64
- Enemy HP: 78
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
- Full-spectrum bonus score: +30 once per turn.

---

## 6) v0.3 Burst Systems

### 6.1 Momentum
- If active side resolves 3 or more cards in one turn, trigger once:
  - `+1 energy`
- Trigger limit: once per turn per side.

### 6.2 Combo Chain
- Tracks consecutive plays with different sigils.
- If current card sigil differs from previous card sigil in same turn:
  - combo +1 (max 4)
- If same sigil repeats:
  - combo resets to 1
- Combo score bonus (player only):
  - chain 3: +4 score per card
  - chain 4: +8 score per card

### 6.3 Prism Burst
- Trigger condition: reach combo chain 4 in one turn.
- Trigger effect (once per turn):
  - deal 8 damage to opponent
  - gain 8 block
  - gain +20 score (player only)

### 6.4 Adrenaline
- Trigger condition: 2 or more different sigil synergies become active in one turn.
- Effect (once per turn):
  - `+1 energy`
  - draw 1 card
  - +12 score (player only)

---

## 7) Card List (v0.3 Fixed Pool: 12)

### Attack
1. C001 Ember Strike (Flame, 1, 7)
2. C002 Blaze Rush (Flame, 1, 8)
3. C003 Thorn Jab (Leaf, 1, 6)
4. C004 Cog Shot (Gear, 1, 6)
5. C005 Null Pierce (Void, 1, 6)
6. C012 Abyss Cut (Void, 2, 12)

### Skill
7. C006 Bark Guard (Leaf, 1, 8)
8. C007 Clockwork Guard (Gear, 1, 7)
9. C008 Spark Cycle (Gear, 1, draw 2)
10. C009 Ashen Focus (Flame, 1, next attack +3)
11. C010 Void Echo (Void, 1, reduce enemy block by 3)
12. C011 Verdant Pulse (Leaf, 2, 12)

---

## 8) AI Behavior
Enemy type: Training Automaton
Priority:
1. Lethal attack
2. Highest projected immediate damage
3. Highest immediate block card if HP <= 25
4. First playable card

Projected damage must include next-attack bonus and Flame synergy potential for the selected card.

---

## 9) Scoring System (v0.3)
- Base score (player card only):
  - Attack resolve: +10
  - Skill resolve: +8
- Combo bonus:
  - chain 3: +4
  - chain 4: +8
- Adrenaline trigger bonus: +12
- Prism Burst bonus: +20
- Win bonus: +140
- Win with player HP >= 40: +50
- Full-spectrum bonus: +30 once per player turn
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

## 12) QA P0 Focus (v0.3)
1. State transition validity.
2. 12-card pool/deck integrity.
3. Hand overflow burn rule.
4. Synergy thresholds and per-card application.
5. Momentum trigger exactly once per turn.
6. Combo chain increase/reset and score bonus.
7. Prism Burst (once/turn) trigger accuracy.
8. Adrenaline trigger (2 synergy activations) accuracy.
9. Enemy score exclusion.
10. Win/lose and score bonus validation.
11. Card image render availability.

---

## Change Log

### v0.3.0 (2026-02-13)
- Added Combo Chain system (different-sigil streak, max chain 4).
- Added Prism Burst burst package (8 damage + 8 block + score).
- Added Adrenaline trigger from multi-synergy turns.
- Rebalanced core stats (HP, win bonuses, full-spectrum bonus).
- Updated card values/effects (`C002`, `C005`, `C008`, `C009`, `C010`).
- Updated AI projected damage requirement to include Flame synergy potential.

### v0.2.0 (2026-02-13)
- Expanded fixed card pool from 10 to 12 (`C011`, `C012`).
- Added card `image` field and visual card art requirement.
- Added momentum mechanic (+1 energy on 3rd card each turn, once).
- Added hand-overflow burn rule at max hand 8.
- Updated scoring: enemy resolutions excluded from score.
- Updated bonus values: win +120, high-HP +40, full-spectrum +25.

### v0.1.0 (2026-02-13)
- Initial vertical slice spec created.
