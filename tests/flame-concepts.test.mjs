import assert from 'node:assert/strict';
import { createGame, createEngine } from '../src/core/battleCore.js';
import { STATES, SIGILS } from '../src/constants.js';

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
  game.player.activeSynergies = { Flame: false, Leaf: false, Gear: false, Void: false };
  game.player.sigilCounts = { Flame: 0, Leaf: 0, Gear: 0, Void: 0 };
  game.enemy.block = 0;
  game.enemy.vulnerable = 0;
  game.enemy.maxHp = 200;
  game.enemy.hp = 100;
};

engine.startRun();

resetPlayerTurnState(['C017']);
engine.playCardAt(0);
assert.equal(game.enemy.hp, 91, 'C017 should deal 9 total damage (attack + bonusDamage)');

resetPlayerTurnState(['C019', 'C020']);
engine.playCardAt(0);
engine.playCardAt(0);
assert.equal(game.enemy.hp, 78, 'C019 + C020 should deal 22 due to nextAttackBonus + flame synergy');

resetPlayerTurnState(['C018', 'C018']);
engine.playCardAt(0);
engine.playCardAt(0);
assert.equal(game.enemy.hp, 77, 'Repeated C018 should deal 23 total with repeat bonus on second use');

SIGILS.forEach((sigil) => assert.ok(game.player.activeSynergies[sigil] !== undefined));
console.log('PASS: flame-concepts');
