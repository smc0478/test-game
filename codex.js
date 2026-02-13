import { CARD_LIBRARY, REGIONS, ENEMY_ARCHETYPES, ENEMY_BESTIARY, DECK_GUIDES } from './src/data.js';

const effectText = (effect) => {
  const map = {
    attack: `공격 ${effect.value}`,
    block: `방어 ${effect.value}`,
    draw: `드로우 ${effect.value}`,
    buffAttack: `다음 공격 +${effect.value}`,
    reduceBlock: `적 방어 -${effect.value}`,
    heal: `회복 ${effect.value}`,
    gainEnergy: `에너지 +${effect.value}`,
    nameRepeatBlockBonus: `동일 이름 반복당 +${effect.value} 방어`,
    thorns: `가시 ${effect.value}`,
    vulnerable: `취약 ${effect.value}`,
    drain: `흡혈 ${effect.value}`,
    selfDamage: `자가 피해 ${effect.value}`,
    echoAttack: `동명 공명 +${effect.value}`,
    swapIntent: '적 의도 전환',
    convertBlockToDamage: '내 방어도 전량을 피해로 전환',
    attackFromBlock: '현재 방어도만큼 공격',
    retainBlockTurns: `방어도 유지 ${effect.value}턴`,
    discover: `도감에서 후보 ${effect.value}장 제시`,
    rewind: '직전 사용 카드 효과 재발동',
    gamble: '무작위 결과 1개 발동',
    grantNextAttackLifestealFromDamage: '다음 공격 피해량만큼 흡혈',
    increaseHealPower: `회복량 +${effect.value}`,
    payHpCost: `체력 코스트 ${effect.value}`,
    attackPerMissingHp: `잃은 체력 x${effect.value} 공격`,
    grantLifestealOnAttack: `공격마다 흡혈 +${effect.value}`
  };

  if (effect.kind === 'ifLastTurnFamily') return `전 턴 ${effect.family}: ${effect.then.map(effectText).join(' + ')}`;
  if (effect.kind === 'ifEnemyIntent') return `적 의도(${effect.intent})일 때: ${effect.then.map(effectText).join(' + ')}`;
  if (effect.kind === 'ifEnemyHpBelow') return `적 HP ${effect.value} 이하일 때: ${effect.then.map(effectText).join(' + ')}`;
  return map[effect.kind] || effect.kind;
};

const cardTemplate = (card) => `<img class='card-art' src='${card.image}' alt='${card.name}' />
<h3>${card.name}</h3>
<p>${card.id} | ${card.sigil} | ${card.type}</p>
<p>패밀리: ${card.family} | 코스트 ${card.energyCost}${card.effect.some((e) => e.kind === 'payHpCost') ? ` + 체력 ${card.effect.filter((e) => e.kind === 'payHpCost').reduce((n, e) => n + e.value, 0)}` : ''}</p>
<p>효과: ${card.effect.map(effectText).join(', ')}</p>
<p class='small'>설명: ${card.description || '설명 없음'}</p>`;

const wrap = document.querySelector('#codex-cards');
const cardCountLabel = document.querySelector('#card-count-label');
const enemyCountLabel = document.querySelector('#enemy-count-label');

const cards = Object.values(CARD_LIBRARY);
const enemies = Object.values(ENEMY_ARCHETYPES);

cardCountLabel.textContent = String(cards.length);
enemyCountLabel.textContent = String(enemies.length);
cards.forEach((card) => {
  const node = document.createElement('article');
  node.className = 'card mini';
  node.innerHTML = cardTemplate(card);
  wrap.appendChild(node);
});

const enemyWrap = document.querySelector('#enemy-codex');
enemies.forEach((enemy) => {
  const detail = ENEMY_BESTIARY[enemy.id];
  const node = document.createElement('article');
  node.className = 'guide-item';
  node.innerHTML = `
    <h3>${detail?.title || enemy.name}</h3>
    <p>컨셉: ${detail?.concept || '-'}</p>
    <p>HP: ${enemy.hp}</p>
    <p>덱: ${enemy.deck.join(', ')}</p>
    <p class='small'>패턴: ${detail?.pattern || '-'}</p>
    <p class='small'>대응 팁: ${detail?.counter || '-'}</p>
  `;
  enemyWrap.appendChild(node);
});



const regionWrap = document.querySelector('#region-codex');
REGIONS.forEach((region) => {
  const node = document.createElement('article');
  node.className = 'guide-item';
  node.innerHTML = `
    <h3>${region.name}</h3>
    <p>티어: ${region.tier}</p>
    <p class='small'>등장 적: ${region.enemies.map((id) => ENEMY_ARCHETYPES[id]?.name || id).join(', ')}</p>
  `;
  regionWrap.appendChild(node);
});

const guideWrap = document.querySelector('#deck-guides');
DECK_GUIDES.forEach((guide) => {
  const node = document.createElement('article');
  node.className = 'guide-item';
  node.innerHTML = `
    <h3>${guide.title}</h3>
    <p>핵심 카드: ${guide.coreCards.join(', ')}</p>
    <p class='small'>운용법: ${guide.play}</p>
  `;
  guideWrap.appendChild(node);
});
