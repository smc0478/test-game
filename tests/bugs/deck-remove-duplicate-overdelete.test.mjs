import assert from 'node:assert/strict';
import { createGame, createEngine } from '../../src/core/battleCore.js';
import { STATES } from '../../src/constants.js';

const countCard = (pile, cardId) => pile.filter((entry) => (typeof entry === 'string' ? entry : entry.id) === cardId).length;

function runDeckRemoveDuplicateRegression() {
  const game = createGame();
  const engine = createEngine(game, { onRender: () => {} });

  game.state = STATES.DECK_BUILD;
  game.removedInDeckBuild = false;
  game.deck = ['C001', 'C001', 'C001', 'C002', 'C005', 'C006'];
  game.removeChoices = [{ id: 'C001', deckIndex: 0 }];
  game.player.drawPile = ['C001', 'C009'];
  game.player.discardPile = ['C001', 'C010'];
  game.player.hand = [engine.cloneCard('C001'), engine.cloneCard('C013')];

  const before = {
    deck: countCard(game.deck, 'C001'),
    drawPile: countCard(game.player.drawPile, 'C001'),
    discardPile: countCard(game.player.discardPile, 'C001'),
    hand: countCard(game.player.hand, 'C001')
  };

  engine.removeDeckCard(0);

  const after = {
    deck: countCard(game.deck, 'C001'),
    drawPile: countCard(game.player.drawPile, 'C001'),
    discardPile: countCard(game.player.discardPile, 'C001'),
    hand: countCard(game.player.hand, 'C001')
  };

  assert.equal(before.deck - after.deck, 1, '덱에서는 선택한 카드 1장만 제거되어야 합니다.');
  const battlePileDecrease = (before.drawPile + before.discardPile + before.hand) - (after.drawPile + after.discardPile + after.hand);
  assert.equal(battlePileDecrease, 1, '전투 파일에서는 같은 카드가 총 1장만 동기화 제거되어야 합니다.');
}

try {
  runDeckRemoveDuplicateRegression();
  console.log('PASS: deck-remove-duplicate-overdelete');
} catch (error) {
  console.error('FAIL: deck-remove-duplicate-overdelete');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
