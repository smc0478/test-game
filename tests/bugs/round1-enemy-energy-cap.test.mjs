import assert from 'node:assert/strict';
import { createGame, createEngine } from '../../src/core/battleCore.js';
import { STATES } from '../../src/constants.js';

function runRound1EnemyEnergyCapRegression() {
  const game = createGame();
  const engine = createEngine(game, { onRender: () => {} });

  engine.startRun();

  assert.equal(game.round, 0, '런 시작 직후 라운드는 0이어야 합니다.');
  assert.equal(game.state, STATES.PLAYER_TURN, '런 시작 직후 플레이어 턴이어야 합니다.');
  assert.ok(game.enemy, '런 시작 시 적 정보가 생성되어야 합니다.');
  assert.ok(game.enemy.energy <= 1, '1라운드 적 시작 에너지는 1 이하여야 합니다.');
}

try {
  runRound1EnemyEnergyCapRegression();
  console.log('PASS: round1-enemy-energy-cap');
} catch (error) {
  console.error('FAIL: round1-enemy-energy-cap');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
