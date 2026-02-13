import assert from 'node:assert/strict';
import { createGame, createEngine } from '../../src/core/battleCore.js';
import { STATES } from '../../src/constants.js';

function runNoFreeFourthPlayRegression() {
  const game = createGame();
  const engine = createEngine(game, { onRender: () => {} });
  engine.startRun();

  game.state = STATES.PLAYER_TURN;
  game.player.energy = 3;
  game.player.hand = ['C001', 'C005', 'C009', 'C013'].map((id) => engine.cloneCard(id));
  game.player.discardPile = [];

  const first = game.player.hand[0].id;
  engine.playCardAt(0, first);

  const second = game.player.hand[0].id;
  engine.playCardAt(0, second);

  const third = game.player.hand[0].id;
  engine.playCardAt(0, third);

  const fourth = game.player.hand[0]?.id;
  if (fourth) engine.playCardAt(0, fourth);

  assert.equal(game.player.energy, 0, '에너지 회복 효과 카드 없이 코스트 1 카드는 3장까지만 사용 가능해야 합니다.');
  assert.equal(game.player.discardPile.length, 3, '4번째 카드는 에너지 부족으로 사용되면 안 됩니다.');
  assert.equal(game.player.hand.length, 1, '에너지 부족 시 4번째 카드는 손패에 남아야 합니다.');
}

try {
  runNoFreeFourthPlayRegression();
  console.log('PASS: no-free-fourth-play');
} catch (error) {
  console.error('FAIL: no-free-fourth-play');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
