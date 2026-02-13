import assert from 'node:assert/strict';
import { CARD_LIBRARY, ENEMY_ARCHETYPES } from '../src/data.js';

const validCards = new Set(Object.keys(CARD_LIBRARY));

assert.equal(ENEMY_ARCHETYPES.emberFox.deck.length, 16, '첫 적은 16장 덱이어야 한다');
assert.deepEqual(
  ENEMY_ARCHETYPES.emberFox.deck,
  ['C001', 'C002', 'C003', 'C004', 'C005', 'C006', 'C007', 'C008', 'C009', 'C010', 'C011', 'C012', 'C013', 'C014', 'C015', 'C016'],
  '첫 적은 기본 카드 16장(C001~C016)으로 구성되어야 한다'
);

const basicEnemyIds = ['ironShell', 'sandBandit', 'thornDruid', 'mistArcher'];
basicEnemyIds.forEach((id) => {
  assert.equal(ENEMY_ARCHETYPES[id].deck.length, 8, `${id} 는 기본 카드 8장 덱이어야 한다`);
  ENEMY_ARCHETYPES[id].deck.forEach((cardId) => {
    assert.ok(Number(cardId.slice(1)) <= 16, `${id} 는 기본 카드(C001~C016)만 사용해야 한다`);
  });
});

const conceptEnemyIds = ['vineGiant', 'gearSentinel', 'steamKnight', 'arcSniper'];
conceptEnemyIds.forEach((id) => {
  assert.equal(ENEMY_ARCHETYPES[id].deck.length, 8, `${id} 는 컨셉 조합 8장 덱이어야 한다`);
  assert.ok(
    ENEMY_ARCHETYPES[id].deck.some((cardId) => Number(cardId.slice(1)) >= 17),
    `${id} 는 컨셉 카드(C017~C036)를 최소 1장 포함해야 한다`
  );
});

Object.entries(ENEMY_ARCHETYPES).forEach(([enemyId, enemy]) => {
  enemy.deck.forEach((cardId) => {
    assert.ok(validCards.has(cardId), `${enemyId} 덱 카드 ${cardId} 는 유효 카드여야 한다`);
  });
});

console.log('PASS: enemy-deck-plan');
