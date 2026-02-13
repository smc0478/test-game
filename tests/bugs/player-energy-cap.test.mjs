import assert from 'node:assert/strict';
import { createGame, createEngine } from '../../src/core/battleCore.js';
import { STATES, MAX_ENERGY } from '../../src/constants.js';

function runPlayerEnergyCapRegression() {
  const game = createGame();
  const engine = createEngine(game, { onRender: () => {} });
  engine.startRun();

  game.state = STATES.PLAYER_TURN;
  game.player.nextTurnEnergyBonus = 2;

  engine.endPlayerTurn();

  assert.equal(game.state, STATES.PLAYER_TURN, '한 턴 순환 후 다시 플레이어 턴이어야 합니다.');
  assert.equal(game.player.energy, MAX_ENERGY, '플레이어 에너지는 최대값(3)을 넘으면 안 됩니다.');
}

try {
  runPlayerEnergyCapRegression();
  console.log('PASS: player-energy-cap');
} catch (error) {
  console.error('FAIL: player-energy-cap');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
