import assert from 'node:assert/strict';
import { createGame, createEngine } from '../../src/core/battleCore.js';
import { STATES } from '../../src/constants.js';

function runVampLifestealOverkillRegression() {
  const game = createGame();
  const engine = createEngine(game, { onRender: () => {} });
  engine.startRun();

  game.state = STATES.PLAYER_TURN;
  game.player.energy = 10;
  game.player.maxHp = 78;
  game.player.hp = 30;
  game.player.hand = ['C032', 'C001'].map((id) => engine.cloneCard(id));
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

  game.enemy.block = 0;
  game.enemy.maxHp = 200;
  game.enemy.hp = 5;

  engine.playCardAt(0);
  engine.playCardAt(0);

  assert.equal(game.enemy.hp, 0, '적은 정확히 처치되어야 합니다.');
  assert.equal(game.player.hp, 35, '흡혈은 오버킬 피해가 아닌 실제 입힌 피해(5)만큼만 회복해야 합니다.');
}

try {
  runVampLifestealOverkillRegression();
  console.log('PASS: vamp-lifesteal-overkill');
} catch (error) {
  console.error('FAIL: vamp-lifesteal-overkill');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
