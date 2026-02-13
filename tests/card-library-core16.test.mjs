import assert from 'node:assert/strict';
import { CARD_LIBRARY, STARTER_DECK } from '../src/data.js';

const cards = Object.values(CARD_LIBRARY);
assert.equal(cards.length, 21, 'CARD_LIBRARY should contain 21 cards');

const bySigil = cards.reduce((acc, card) => {
  acc[card.sigil] = acc[card.sigil] || [];
  acc[card.sigil].push(card);
  return acc;
}, {});

assert.equal(bySigil.Flame.length, 9, 'Flame should have 9 cards');
assert.equal(bySigil.Leaf.length, 4, 'Leaf should have 4 cards');
assert.equal(bySigil.Gear.length, 4, 'Gear should have 4 cards');
assert.equal(bySigil.Void.length, 4, 'Void should have 4 cards');

const flameKinds = bySigil.Flame.flatMap((card) => card.effect.map((e) => e.kind));
['attack', 'block', 'draw', 'heal', 'bonusDamage', 'nameRepeatBonus', 'nextAttackBonus', 'gainEnergy'].forEach((kind) => {
  assert.ok(flameKinds.includes(kind), `Flame should include ${kind}`);
});

['C017', 'C018', 'C019', 'C020', 'C021'].forEach((id) => {
  assert.ok(CARD_LIBRARY[id], `${id} should exist in CARD_LIBRARY`);
  assert.equal(CARD_LIBRARY[id].sigil, 'Flame', `${id} should be a Flame card`);
  assert.ok(CARD_LIBRARY[id].image.startsWith('data:image/svg+xml;base64,'), `${id} should include svg image`);
});

assert.equal(STARTER_DECK.length, 8, 'starter deck should contain 8 cards');
console.log('PASS: card-library-core16');
