import assert from 'node:assert/strict';
import { CARD_LIBRARY, STARTER_DECK } from '../src/data.js';

const cards = Object.values(CARD_LIBRARY);
assert.equal(cards.length, 36, 'CARD_LIBRARY should contain 36 cards');

const bySigil = cards.reduce((acc, card) => {
  acc[card.sigil] = acc[card.sigil] || [];
  acc[card.sigil].push(card);
  return acc;
}, {});

assert.equal(bySigil.Flame.length, 9, 'Flame should have 9 cards');
assert.equal(bySigil.Leaf.length, 9, 'Leaf should have 9 cards');
assert.equal(bySigil.Gear.length, 9, 'Gear should have 9 cards');
assert.equal(bySigil.Void.length, 9, 'Void should have 9 cards');

const leafKinds = bySigil.Leaf.flatMap((card) => card.effect.map((e) => e.kind));
['attack', 'block', 'draw', 'heal', 'nameRepeatBlockBonus', 'attackFromBlock', 'thorns', 'retainBlockTurns'].forEach((kind) => {
  assert.ok(leafKinds.includes(kind), `Leaf should include ${kind}`);
});

['C022', 'C023', 'C024', 'C025', 'C026'].forEach((id) => {
  assert.ok(CARD_LIBRARY[id], `${id} should exist in CARD_LIBRARY`);
  assert.equal(CARD_LIBRARY[id].sigil, 'Leaf', `${id} should be a Leaf card`);
  assert.ok(CARD_LIBRARY[id].image.startsWith('data:image/svg+xml;base64,'), `${id} should include svg image`);
});

['C027', 'C028', 'C029', 'C030', 'C031'].forEach((id) => {
  assert.ok(CARD_LIBRARY[id], `${id} should exist in CARD_LIBRARY`);
  assert.equal(CARD_LIBRARY[id].sigil, 'Gear', `${id} should be a Gear card`);
  assert.ok(CARD_LIBRARY[id].image.startsWith('data:image/svg+xml;base64,'), `${id} should include svg image`);
});


['C032', 'C033', 'C034', 'C035', 'C036'].forEach((id) => {
  assert.ok(CARD_LIBRARY[id], `${id} should exist in CARD_LIBRARY`);
  assert.equal(CARD_LIBRARY[id].sigil, 'Void', `${id} should be a Void card`);
  assert.ok(CARD_LIBRARY[id].image.startsWith('data:image/svg+xml;base64,'), `${id} should include svg image`);
});

assert.equal(STARTER_DECK.length, 8, 'starter deck should contain 8 cards');
console.log('PASS: card-library-core16');
