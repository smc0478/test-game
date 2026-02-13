import assert from 'node:assert/strict';
import { createGame, createEngine } from '../../src/core/battleCore.js';
import { STATES } from '../../src/constants.js';

function runVampLifestealBlockedDamageRegression() {
  const game = createGame();
  const engine = createEngine(game, { onRender: () => {} });
  engine.startRun();

  game.state = STATES.PLAYER_TURN;
  game.player.energy = 10;
  game.player.maxHp = 78;
  game.player.hp = 30;
  game.player.hand = ['C036', 'C001'].map((id) => engine.cloneCard(id));
  game.player.drawPile = [];
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

  game.enemy.block = 20;
  game.enemy.maxHp = 200;
  game.enemy.hp = 200;

  engine.playCardAt(0);
  engine.playCardAt(0);

  assert.equal(game.enemy.hp, 200, '적 체력은 방어에 막혀 감소하지 않아야 합니다.');
  assert.equal(game.player.hp, 30, '흡혈은 실제 체력 피해가 0이면 회복되지 않아야 합니다.');
}

try {
  runVampLifestealBlockedDamageRegression();
  console.log('PASS: vamp-lifesteal-blocked-damage');
} catch (error) {
  console.error('FAIL: vamp-lifesteal-blocked-damage');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
