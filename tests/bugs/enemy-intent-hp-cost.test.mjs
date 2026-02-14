import assert from 'node:assert/strict';
import { createGame, createEngine } from '../../src/core/battleCore.js';
import { ENEMY_ARCHETYPES } from '../../src/data.js';

function runEnemyIntentHpCostRegression() {
  const game = createGame();
  const engine = createEngine(game, { onRender: () => {} });

  engine.startRun();
  const enemyId = game.currentRoute.enemyId;
  const originalDeck = [...ENEMY_ARCHETYPES[enemyId].deck];
  const originalHp = ENEMY_ARCHETYPES[enemyId].hp;

  try {
    ENEMY_ARCHETYPES[enemyId].deck = Array(5).fill('C034');
    ENEMY_ARCHETYPES[enemyId].hp = 7;

    engine.startRun();

    assert.equal(game.enemy.intentPlan.length, 1, '적 의도 예측은 체력 코스트를 누적 반영해 실행 가능한 1회 행동만 포함해야 합니다.');
    assert.equal(game.enemy.intentDamage, 13, '적 의도 총 피해는 실제로 가능한 C034 1회분(13)이어야 합니다.');
  } finally {
    ENEMY_ARCHETYPES[enemyId].deck = originalDeck;
    ENEMY_ARCHETYPES[enemyId].hp = originalHp;
  }
}

try {
  runEnemyIntentHpCostRegression();
  console.log('PASS: enemy-intent-hp-cost');
} catch (error) {
  console.error('FAIL: enemy-intent-hp-cost');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
