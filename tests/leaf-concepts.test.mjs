import assert from 'node:assert/strict';
import { createGame, createEngine } from '../src/core/battleCore.js';
import { STATES } from '../src/constants.js';

const game = createGame();
const engine = createEngine(game, { onRender: () => {} });

const resetPlayerTurnState = (handIds) => {
  game.state = STATES.PLAYER_TURN;
  game.player.energy = 10;
  game.player.hand = handIds.map((id) => engine.cloneCard(id));
  game.player.discardPile = [];
  game.player.turnFamilyCounts = {};
  game.player.turnFamiliesUsed = new Set();
  game.player.comboChain = 0;
  game.player.lastSigil = null;
  game.player.attackBuff = 0;
  game.player.vulnerable = 0;
  game.player.turnCardNameCounts = {};
  game.player.pendingNextAttackBonus = 0;
  game.player.blockRetainTurns = 0;
  game.player.activeSynergies = { Flame: false, Leaf: false, Gear: false, Void: false };
  game.player.sigilCounts = { Flame: 0, Leaf: 0, Gear: 0, Void: 0 };
  game.player.block = 0;
  game.player.thorns = 0;
  game.enemy.block = 0;
  game.enemy.vulnerable = 0;
  game.enemy.maxHp = 200;
  game.enemy.hp = 100;
};

engine.startRun();

resetPlayerTurnState(['C023', 'C023']);
engine.playCardAt(0);
engine.playCardAt(0);
assert.equal(game.player.block, 23, 'Repeated C023 should add repeat block and leaf synergy');

resetPlayerTurnState(['C022']);
engine.playCardAt(0);
assert.equal(game.player.block, 14, 'C022 should grant 14 block with cost 2');

resetPlayerTurnState(['C022', 'C024']);
engine.playCardAt(0);
engine.playCardAt(0);
assert.equal(game.enemy.hp, 86, 'C024 should deal damage equal to current block');

resetPlayerTurnState(['C025']);
engine.playCardAt(0);
assert.equal(game.player.block, 5, 'C025 should grant 5 block');
assert.equal(game.player.thorns, 3, 'C025 should grant 3 thorns');

resetPlayerTurnState(['C026']);
engine.playCardAt(0);
assert.equal(game.player.blockRetainTurns, 2, 'C026 should set block retain for 2 turns');
assert.equal(game.player.block, 18, 'C026 should grant 18 block');
game.enemy.hand = [];
game.enemy.drawPile = [];
game.enemy.discardPile = [];
game.enemy.energy = 0;
engine.endPlayerTurn();
assert.equal(game.player.block, 18, 'retained block should stay on the next player turn');
assert.equal(game.player.blockRetainTurns, 1, 'retain counter should decrease after one retained turn');

console.log('PASS: leaf-concepts');
