import assert from 'node:assert/strict';
import { createGame, createEngine } from '../../src/core/battleCore.js';
import { STATES } from '../../src/constants.js';

function runHpCostCardEnergyPreserveRegression() {
  const game = createGame();
  const engine = createEngine(game, { onRender: () => {} });
  engine.startRun();

  game.state = STATES.PLAYER_TURN;
  game.player.energy = 10;
  game.player.maxHp = 78;
  game.player.hp = 40;
  game.player.hand = ['C034'].map((id) => engine.cloneCard(id));
  game.player.discardPile = [];
  game.enemy.block = 0;
  game.enemy.hp = 200;
  game.enemy.maxHp = 200;

  const cardId = game.player.hand[0].id;
  engine.playCardAt(0, cardId);

  assert.equal(game.player.energy, 10, '체력 코스트 카드(C034)는 에너지를 소모하거나 강제로 상한으로 깎으면 안 됩니다.');
  assert.equal(game.player.hp, 49, '체력 4 지불 후 실제 피해량(13) 흡혈이 적용되어 최종 체력이 49여야 합니다.');
}

try {
  runHpCostCardEnergyPreserveRegression();
  console.log('PASS: hp-cost-card-energy-preserve');
} catch (error) {
  console.error('FAIL: hp-cost-card-energy-preserve');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
