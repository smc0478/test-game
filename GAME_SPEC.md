# GAME_SPEC.md

## Spec Version
- **Version:** v0.1.0
- **Project:** Synergy Turn Card Battle (Vertical Slice)
- **Owner Role:** Producer (Game Designer)
- **Language:** English
- **Last Updated:** 2026-02-13

## Metadata
- **Game Type:** Turn-based card battle
- **Mode:** Single battle only (v0.1 Vertical Slice)
- **Participants:** Player vs AI enemy
- **Deck Size Limit:** Maximum 12 cards
- **Card Pool Size (v0.1):** 10 cards (fixed list in this spec)
- **Randomness:** Initial deck shuffle and draw order only
- **Target:** Stable, testable numeric combat loop with clear state transitions

---

## 1) Design Goal
Deliver one complete and replayable battle loop where:
1. The player and AI take alternating turns.
2. Cards apply only numeric effects.
3. Sigil-based synergy and multiplier logic materially changes outcomes.
4. State transitions are explicit and deterministic.

---

## 2) Scope

### Scope In (v0.1)
- One battle scene.
- Player vs one AI enemy type.
- Turn-based flow with fixed state machine:
  - `ready`
  - `playerTurn`
  - `enemyTurn`
  - `resolution`
  - `gameOver`
- Deck system (max 12 cards).
- Draw, hand play, discard, and reshuffle behavior.
- Numeric card effects only.
- Sigil synergy and score multiplier system.
- Win/lose judgment and score output.

### Scope Out (v0.1)
- No map, stage progression, or multiple encounters.
- No save/load system.
- No shop, relic, equipment, or upgrade systems.
- No card crafting, removal, or permanent deck edit.
- No multiplayer.
- No additional enemy archetypes.
- No non-numeric/ambiguous card effects.

---

## 3) Core Battle Rules

### 3.1 Combatants
- **Player HP:** 60
- **Enemy HP:** 70
- **Player Block:** starts at 0 each battle
- **Enemy Block:** starts at 0 each battle

### 3.2 Turn Economy
- **Energy per turn (player and enemy):** 3
- Unspent energy is reset at turn end.
- Each card has fixed `energyCost`.

### 3.3 Card Zones
- Draw Pile
- Hand
- Discard Pile

### 3.4 Hand/Draw Rules
- Initial draw: 5 cards.
- Start of each turn draw: 5 cards.
- Max hand size: 8.
- If draw pile is empty, shuffle discard into draw pile.

### 3.5 Block Rules
- Block absorbs incoming damage first.
- Remaining damage reduces HP.
- All block is removed at the owner’s turn start.

### 3.6 Battle End
- If enemy HP <= 0, player wins.
- If player HP <= 0, player loses.
- If both drop to <= 0 in the same resolution, result is **Defeat** (safety rule for v0.1).

---

## 4) Card Data Model
Every card object must contain the following fields:
- `id` (string)
- `name` (string)
- `type` (`attack` | `skill`)
- `energyCost` (integer)
- `baseValue` (integer)
- `sigil` (`Flame` | `Leaf` | `Gear` | `Void`)
- `effect(context)` (pure function, numeric output only)

---

## 5) Sigil Synergy & Multiplier System

### 5.1 Per-Turn Sigil Counter
Track how many cards of each sigil the active side has played in its current turn:
- `turnSigilCount.Flame`
- `turnSigilCount.Leaf`
- `turnSigilCount.Gear`
- `turnSigilCount.Void`

### 5.2 Synergy Trigger
When a card is played, check current turn counter for that card’s sigil **including that card**.
- If count is 2 or more, synergy is active for that card.

### 5.3 Numeric Synergy Effects
- **Flame synergy:** final attack damage `+3`
- **Leaf synergy:** final block gain `+3`
- **Gear synergy:** draw `+1` extra card when card resolves
- **Void synergy:** score gain from that card `x1.5` (rounded down)

### 5.4 Global Turn Multiplier
If active side has played **at least 1 card of all four sigils** within the same turn, grant:
- `turnScoreMultiplier = x2.0` for score gained by that side for the rest of that turn.
- Multiplier resets at turn end.

### 5.5 Final Score Multiplier Stack Rule
For each card resolution:
1. Start with base score gain (from card type; see Section 9).
2. Apply Void synergy multiplier if active (`x1.5`, floor).
3. Apply global turn multiplier if active (`x2.0`, floor).

All multiplier operations are numeric and deterministic.

---

## 6) Card List (v0.1 Fixed Pool: 10)

> Deck size may be configured up to 12 cards by duplicating listed cards; no new card definitions allowed in v0.1.

### 6.1 Attack Cards

1. **C001 - Ember Strike**
   - `type`: attack
   - `energyCost`: 1
   - `baseValue`: 7
   - `sigil`: Flame
   - `effect`: Deal `baseValue` damage to target.

2. **C002 - Ember Strike+**
   - `type`: attack
   - `energyCost`: 1
   - `baseValue`: 9
   - `sigil`: Flame
   - `effect`: Deal `baseValue` damage to target.

3. **C003 - Thorn Jab**
   - `type`: attack
   - `energyCost`: 1
   - `baseValue`: 6
   - `sigil`: Leaf
   - `effect`: Deal `baseValue` damage to target.

4. **C004 - Cog Shot**
   - `type`: attack
   - `energyCost`: 1
   - `baseValue`: 6
   - `sigil`: Gear
   - `effect`: Deal `baseValue` damage to target.

5. **C005 - Null Pierce**
   - `type`: attack
   - `energyCost`: 1
   - `baseValue`: 5
   - `sigil`: Void
   - `effect`: Deal `baseValue` damage to target.

### 6.2 Skill Cards

6. **C006 - Bark Guard**
   - `type`: skill
   - `energyCost`: 1
   - `baseValue`: 8
   - `sigil`: Leaf
   - `effect`: Gain `baseValue` block.

7. **C007 - Clockwork Guard**
   - `type`: skill
   - `energyCost`: 1
   - `baseValue`: 7
   - `sigil`: Gear
   - `effect`: Gain `baseValue` block.

8. **C008 - Spark Cycle**
   - `type`: skill
   - `energyCost`: 1
   - `baseValue`: 1
   - `sigil`: Gear
   - `effect`: Draw `baseValue` card.

9. **C009 - Ashen Focus**
   - `type`: skill
   - `energyCost`: 1
   - `baseValue`: 2
   - `sigil`: Flame
   - `effect`: Increase next attack card damage this turn by `baseValue`.

10. **C010 - Void Echo**
    - `type`: skill
    - `energyCost`: 1
    - `baseValue`: 2
    - `sigil`: Void
    - `effect`: Reduce enemy block by `baseValue` (minimum 0).

---

## 7) AI Behavior (Single Enemy Type)
Enemy type: **Training Automaton**

### 7.1 Enemy Deck
- Uses same 10-card pool.
- Enemy deck size: 10 fixed in v0.1.

### 7.2 Enemy Decision Rule
During `enemyTurn`, while energy > 0:
1. Evaluate playable cards in hand (`energyCost <= currentEnergy`).
2. Priority order:
   - Lethal attack (highest damage) if can defeat player.
   - Highest immediate damage card.
   - Highest immediate block card if HP <= 25.
   - Otherwise first playable card in hand order.
3. Play exactly 1 card per decision cycle until no playable card.

No hidden modifiers; all decisions deterministic from visible state.

---

## 8) State Machine Specification

## 8.1 State List
- `ready`
- `playerTurn`
- `enemyTurn`
- `resolution`
- `gameOver`

## 8.2 Transition Rules
1. `ready` -> `playerTurn`
   - Trigger: battle initialization complete.
2. `playerTurn` -> `enemyTurn`
   - Trigger: player ends turn or no playable actions remain.
3. `enemyTurn` -> `resolution`
   - Trigger: enemy action loop ends.
4. `resolution` -> `playerTurn`
   - Trigger: no game-over condition met.
5. `resolution` -> `gameOver`
   - Trigger: player HP <= 0 or enemy HP <= 0.

## 8.3 Execution Constraints
- Only one active state at any time.
- Transition function must reject invalid jumps.
- State entry effects execute once per transition.
- No duplicate end-turn execution.

---

## 9) Scoring System

### 9.1 Base Score by Card Resolution
- Attack card successfully resolved: `+10`
- Skill card successfully resolved: `+8`

### 9.2 Bonus Score Events
- Defeat enemy (win): `+100`
- End battle with HP >= 40: `+30`
- Full-spectrum turn (all 4 sigils played in one turn): additional `+20` once per turn

### 9.3 Penalty Rules
- Player defeat: final score `0`

### 9.4 Score Calculation Timing
- Score is updated per resolved card/event, not per frame.
- Multipliers from Section 5 are applied immediately on each relevant score event.
- Round all multiplied values down to integer.

---

## 10) Win/Lose Conditions

### Win
- Enemy HP <= 0 at resolution check.

### Lose
- Player HP <= 0 at resolution check.
- Simultaneous KO (both HP <= 0): Lose (v0.1 strict rule).

---

## 11) Implementation Notes (Engineer Mapping)

### Required file separation
- `index.html`
- `style.css`
- `game.js`

### Required constants
- State strings must be constants, e.g.:
  - `STATE_READY`
  - `STATE_PLAYER_TURN`
  - `STATE_ENEMY_TURN`
  - `STATE_RESOLUTION`
  - `STATE_GAME_OVER`

### Spec Mapping Checklist
- [ ] Card logic implemented as numeric-only effects.
- [ ] Deck max 12 enforced.
- [ ] State machine transitions match Section 8.
- [ ] Synergy rules match Section 5.
- [ ] Score system matches Section 9.
- [ ] Win/lose conditions match Section 10.

---

## 12) QA Priority Test Cases (P0)
1. State transitions occur only in allowed order.
2. Deck reshuffle works when draw pile empty.
3. Flame/Leaf/Gear/Void synergy triggers exactly at count >= 2.
4. Full-spectrum turn activates x2.0 turn multiplier and +20 once.
5. Damage/block interactions are correct with block depletion.
6. Simultaneous KO returns defeat.
7. Score updates only on card/event resolution.

---

## Change Log

### v0.1.0 (2026-02-13)
- Initial vertical slice spec created.
- Defined single-battle scope and exclusions.
- Defined 10-card numeric-only card pool.
- Defined sigil synergy and multiplier stack rules.
- Defined deterministic state machine and transitions.
- Defined AI behavior for single enemy type.
- Defined win/lose and score system.
