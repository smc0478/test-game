import assert from 'node:assert/strict';
import { CARD_LIBRARY, STARTER_DECK } from '../src/data.js';

const cards = Object.values(CARD_LIBRARY);
assert.equal(cards.length, 16, 'CARD_LIBRARY should contain 16 cards');

const bySigil = cards.reduce((acc, card) => {
  acc[card.sigil] = acc[card.sigil] || [];
  acc[card.sigil].push(card);
  return acc;
}, {});

['Flame', 'Leaf', 'Gear', 'Void'].forEach((sigil) => {
  assert.equal(bySigil[sigil].length, 4, `${sigil} should have 4 cards`);
  const kinds = bySigil[sigil].flatMap((card) => card.effect.map((e) => e.kind));
  ['attack', 'block', 'draw', 'heal'].forEach((kind) => {
    assert.ok(kinds.includes(kind), `${sigil} should include ${kind}`);
  });
});

assert.equal(STARTER_DECK.length, 8, 'starter deck should contain 8 cards');
console.log('PASS: card-library-core16');
