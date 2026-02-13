import assert from 'node:assert/strict';
import { createGame, createEngine } from '../src/core/battleCore.js';
import { STATES } from '../src/constants.js';

const game = createGame();
const engine = createEngine(game, { onRender: () => {} });

const resetPlayerTurnState = (handIds) => {
  game.state = STATES.PLAYER_TURN;
  game.player.energy = 10;
  game.player.maxHp = 78;
  game.player.hp = 40;
  game.player.hand = handIds.map((id) => engine.cloneCard(id));
  game.player.drawPile = ['C009', 'C010', 'C011', 'C012', 'C013'];
  game.player.discardPile = [];
  game.player.turnFamilyCounts = {};
  game.player.turnFamiliesUsed = new Set();
  game.player.comboChain = 0;
  game.player.lastSigil = null;
  game.player.attackBuff = 0;
  game.player.vulnerable = 0;
  game.player.turnCardNameCounts = {};
  game.player.pendingNextAttackBonus = 0;
  game.player.nextAttackLifestealFromDamage = false;
  game.player.lifestealOnAttack = 0;
  game.player.healPower = 0;
  game.player.nextTurnEnergyBonus = 0;
  game.player.activeSynergies = { Flame: false, Leaf: false, Gear: false, Void: false };
  game.player.sigilCounts = { Flame: 0, Leaf: 0, Gear: 0, Void: 0 };
  game.player.block = 0;
  game.enemy.block = 0;
  game.enemy.vulnerable = 0;
  game.enemy.maxHp = 200;
  game.enemy.hp = 200;
};

engine.startRun();

resetPlayerTurnState(['C032', 'C013']);
engine.playCardAt(0);
engine.playCardAt(0);
assert.equal(game.player.hp, 52, 'C032 should lifesteal exact dealt damage on next attack');

resetPlayerTurnState(['C033', 'C016']);
engine.playCardAt(0);
engine.playCardAt(0);
assert.equal(game.player.hp, 53, 'C033 should amplify same-turn healing by +2');

resetPlayerTurnState(['C034']);
engine.playCardAt(0);
assert.equal(game.player.energy, 10, 'C034 should spend hp instead of energy');
assert.equal(game.player.hp, 40, 'C034 should pay hp and then drain hp');

resetPlayerTurnState(['C035']);
engine.playCardAt(0);
assert.equal(game.enemy.hp, 176, 'C035 should deal missing-hp based damage up to cap');

resetPlayerTurnState(['C036', 'C013']);
engine.playCardAt(0);
engine.playCardAt(0);
assert.equal(game.player.hp, 43, 'C036 should grant flat lifesteal on attack for the turn');

console.log('PASS: void-vamp-concepts');
