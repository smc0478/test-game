import assert from 'node:assert/strict';
import { createGame, createEngine } from '../../src/core/battleCore.js';
import { STATES } from '../../src/constants.js';

function runStaleIndexDoublePlayEnergyRegression() {
  const game = createGame();
  const engine = createEngine(game, { onRender: () => {} });
  engine.startRun();

  game.state = STATES.PLAYER_TURN;
  game.player.energy = 3;
  game.player.hand = ['C001', 'C005', 'C009'].map((id) => engine.cloneCard(id));
  game.player.discardPile = [];

  const clickedCardId = game.player.hand[0].id;

  engine.playCardAt(0, clickedCardId);
  engine.playCardAt(0, clickedCardId);

  assert.equal(game.player.energy, 2, '같은 클릭 이벤트의 중복 실행으로 에너지가 추가로 소모되면 안 됩니다.');
  assert.equal(game.player.discardPile.filter((id) => id === clickedCardId).length, 1, '동일 카드는 1회만 사용되어야 합니다.');
  assert.equal(game.player.hand.length, 2, '중복 클릭 이후 손패는 1장만 줄어야 합니다.');
}

try {
  runStaleIndexDoublePlayEnergyRegression();
  console.log('PASS: stale-index-double-play-energy');
} catch (error) {
  console.error('FAIL: stale-index-double-play-energy');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
