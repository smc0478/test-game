# QA Report (P0 Validation) - v0.1

## Header: P0 Test Cases

| ID | Priority | Area | Test Case | Expected (Spec) | Actual (Implementation) | Result |
|---|---|---|---|---|---|---|
| P0-01 | P0 | File Structure | Verify required file separation exists (`index.html`, `style.css`, `game.js`). | All 3 files exist separately. | Present and separated. | PASS |
| P0-02 | P0 | State Machine | Validate defined state constants and transition map coverage. | `ready`, `playerTurn`, `enemyTurn`, `resolution`, `gameOver` and allowed transitions only. | Constants and transition table match required states/order. | PASS |
| P0-03 | P0 | Transition Guard | Attempt invalid jump (e.g., `playerTurn -> gameOver` directly) through transition function. | Invalid jump rejected. | `transitionTo` blocks and logs invalid transition. | PASS |
| P0-04 | P0 | Initial Battle Stats | Start battle and verify initial HP values. | Player 60, Enemy 70. | Player 50, Enemy 55. | FAIL |
| P0-05 | P0 | Turn Economy | Verify energy at turn start. | 3 energy for active side each turn. | `startTurn` sets energy to 3. | PASS |
| P0-06 | P0 | Draw Rules | Verify start-of-turn draw count. | Draw 5 at turn start. | `startTurn` draws 5. | PASS |
| P0-07 | P0 | Hand Limit | Verify hand cannot exceed max size 8. | Max hand size 8 enforced. | No hand-size cap in `drawCards`; can exceed 8. | FAIL |
| P0-08 | P0 | Reshuffle | Empty draw pile with non-empty discard and draw again. | Discard reshuffled into draw pile. | Reshuffle implemented and logged. | PASS |
| P0-09 | P0 | Block Lifecycle | Start new owner turn after having block. | Owner block cleared at turn start. | Block is NOT reset in `startTurn`. | FAIL |
| P0-10 | P0 | Damage/Block | Incoming damage consumed by block first, then HP. | Block absorption then HP reduction. | `applyDamage` follows rule. | PASS |
| P0-11 | P0 | Flame Synergy Value | Play second Flame card and resolve attack. | Flame synergy adds +3 final attack damage. | Implementation grants +2 attack bonus. | FAIL |
| P0-12 | P0 | Leaf Synergy Semantics | Resolve Leaf synergy on qualifying card. | Qualifying block card gains +3 final block. | Adds one-time +3 block on trigger instead of per qualifying resolution. | FAIL |
| P0-13 | P0 | Gear Synergy Scope | Trigger Gear synergy then play non-Gear card. | +1 draw should apply only when synergy is active for that card context. | Persistent global `activeSynergies.Gear` makes all later cards draw +1. | FAIL |
| P0-14 | P0 | Void Synergy Scope | Trigger Void synergy then resolve non-Void card score. | x1.5 applies when synergy active for that card context. | Persistent `activeSynergies.Void` applies x1.5 to all subsequent cards that turn. | FAIL |
| P0-15 | P0 | Full-Spectrum Bonus | Play all 4 sigils in one turn once. | +20 granted once that turn, x2 turn multiplier turns ON. | Implemented and guarded by `fullSpectrumAwarded`. | PASS |
| P0-16 | P0 | Score Base Values | Resolve attack and skill without multipliers. | Attack +10, Skill +8. | Implemented in `applyScoreForCard`. | PASS |
| P0-17 | P0 | Win Bonus | Win battle with player HP >= 40. | +100 win bonus, +30 high-HP bonus. | Implemented in resolution. | PASS |
| P0-18 | P0 | Defeat Penalty | Lose battle. | Final score forced to 0. | Implemented for player death and simultaneous KO. | PASS |
| P0-19 | P0 | Simultaneous KO Rule | Both HP <= 0 at same resolution. | Defeat (strict safety rule). | Implemented as defeat + score 0. | PASS |
| P0-20 | P0 | AI Determinism | Enemy decision follows deterministic priority chain. | Lethal > highest damage > highest block if HP<=25 > first playable. | Implemented deterministically in chooser function. | PASS |

---

## Header: Bug Report Template

### Bug ID
`BUG-YYYYMMDD-XXX`

### Title
Short, specific defect summary.

### Severity / Priority
- Severity: `Blocker | Critical | Major | Minor`
- Priority: `P0 | P1 | P2`

### Environment
- Branch/Commit:
- Browser:
- OS:
- Build/Run command:

### Preconditions
List required setup state.

### Steps to Reproduce
1.
2.
3.

### Expected Result
Behavior required by `GAME_SPEC.md`.

### Actual Result
Observed behavior in current implementation.

### Evidence
- Console logs:
- Screenshot/video:
- Relevant state snapshot:

### Spec Reference
Section and line reference from `GAME_SPEC.md`.

### Suspected Root Cause (Optional)
Code location and hypothesis.

### Regression Risk
`Low | Medium | High` + short reason.

### Suggested Fix
One actionable correction direction.

---

## Header: Spec Ambiguities

1. **Deck size wording conflict**  
   Metadata states deck limit 12, while AI section fixes enemy deck to 10 and card pool is 10; duplication policy exists but exact required player deck size for v0.1 battle start is not explicitly fixed.

2. **Synergy scope interpretation**  
   Section 5.2 says synergy is active “for that card,” but implementation could interpret effects as persistent turn buffs. The intended scope (single-card vs turn-persistent) should be explicit for each sigil.

3. **Leaf/Flame timing definition**  
   “Final attack damage +3” and “final block gain +3” should explicitly state whether bonus applies only to cards with matching sigil or to any card after activation.

4. **Turn owner score policy**  
   Global score is shared; spec should clarify whether enemy card resolutions are intended to increase player-visible score (currently they do).

5. **Hand limit enforcement timing**  
   Max hand size 8 is specified, but behavior on overflow (burn/discard/deny draw) is undefined.

6. **Block reset interaction with enemy turn**  
   “All block is removed at owner turn start” is clear, but no examples exist for edge timing around resolution/game-over transitions.

---

## Header: Improvement Suggestions

1. **Create an executable QA checklist in-repo**  
   Add a machine-readable test matrix (e.g., `qa/p0-cases.json`) and bind each case to spec section IDs.

2. **Add deterministic test hooks in `game.js`**  
   Expose pure helpers for card resolution and scoring so QA can run automated assertions without browser UI interactions.

3. **Introduce seedable RNG for reproducible QA**  
   Replace direct `Math.random()` with injectable seeded RNG to support stable regression tests.

4. **Implement runtime spec assertions in development mode**  
   Guardrails for HP defaults, hand-size cap, and synergy values can fail fast when implementation drifts.

5. **Add turn-state telemetry panel**  
   Show sigil counts, active multipliers, and per-card score contribution to improve failure diagnosis.

6. **Define a strict “Spec Mapping” report per PR**  
   Require engineer PRs to include exact mapping rows for Sections 5, 8, 9, 10 before QA sign-off.
