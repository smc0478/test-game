import assert from 'node:assert/strict';
import { createGame, createEngine } from '../src/core/battleCore.js';
import { STATES } from '../src/constants.js';

const game = createGame();
const engine = createEngine(game, { onRender: () => {} });

const resetPlayerTurnState = (handIds) => {
  game.state = STATES.PLAYER_TURN;
  game.player.energy = 10;
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
  game.player.nextTurnEnergyBonus = 0;
  game.player.activeSynergies = { Flame: false, Leaf: false, Gear: false, Void: false };
  game.player.sigilCounts = { Flame: 0, Leaf: 0, Gear: 0, Void: 0 };
  game.player.block = 0;
  game.enemy.block = 0;
  game.enemy.vulnerable = 0;
  game.enemy.maxHp = 200;
  game.enemy.hp = 100;
};

engine.startRun();

resetPlayerTurnState(['C027']);
engine.playCardAt(0);
assert.equal(game.player.hand.length, 1, 'C027 should draw 1 card based on first family use');

resetPlayerTurnState(['C010', 'C028']);
engine.playCardAt(1);
assert.equal(game.enemy.hp, 97, 'C028 should deal hand-size based damage (1 card x3 after play)');

resetPlayerTurnState(['C009', 'C010', 'C029']);
engine.playCardAt(2);
assert.equal(game.player.hand.length, 5, 'C029 should redraw full hand to 5 cards');

resetPlayerTurnState(['C030']);
engine.playCardAt(0);
assert.equal(game.player.nextTurnEnergyBonus, 2, 'C030 should reserve 2 energy for next turn');

resetPlayerTurnState(['C031']);
engine.playCardAt(0);
assert.equal(game.player.hand.length, 2, 'C031 should draw 2 cards');
assert.ok(game.player.hand.every((card) => card.energyCost === 0), 'C031 should reduce drawn card costs by 1');

console.log('PASS: nebula-draw-concepts');
