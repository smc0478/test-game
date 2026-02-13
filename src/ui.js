import { SIGILS, STATES } from './constants.js';
import { CARD_LIBRARY, REGIONS, ENEMY_ARCHETYPES } from './data.js';

const SYNERGY_GUIDE = [
  { sigil: 'Flame', effect: '동일 문양 2회 이상 사용 시 공격 피해 +6' },
  { sigil: 'Leaf', effect: '동일 문양 2회 이상 사용 시 방어 +6' },
  { sigil: 'Gear', effect: '동일 문양 2회 이상 사용 시 드로우 +1' },
  { sigil: 'Void', effect: '동일 문양 2회 이상 사용 시 공격 +4 + 흡혈 2' },
  { sigil: 'Burst', effect: '같은 문양 3회 사용 시 해당 문양 버스트 1회 발동 (+15점)' }
];

const effectText = (effect) => {
  const map = {
    attack: `공격 ${effect.value}`,
    block: `방어 ${effect.value}`,
    draw: `드로우 ${effect.value}`,
    buffAttack: `다음 공격 +${effect.value}`,
    reduceBlock: `적 방어 -${effect.value}`,
    heal: `회복 ${effect.value}`,
    gainEnergy: `에너지 +${effect.value}`,
    thorns: `가시 ${effect.value}`,
    vulnerable: `취약 ${effect.value}`,
    drain: `흡혈 ${effect.value}`,
    selfDamage: `자가 피해 ${effect.value}`,
    echoAttack: `동명 공명 +${effect.value}`,
    swapIntent: '적 의도 전환',
    convertBlockToDamage: '내 방어도 전량을 피해로 전환',
    discover: `도감에서 후보 ${effect.value}장 제시`,
    rewind: '직전 사용 카드 효과 재발동',
    gamble: '무작위 결과 1개 발동'
  };
  if (effect.kind === 'ifLastTurnFamily') return `전 턴 ${effect.family}: ${effect.then.map(effectText).join(' + ')}`;
  if (effect.kind === 'ifEnemyIntent') return `적 의도(${effect.intent})일 때: ${effect.then.map(effectText).join(' + ')}`;
  if (effect.kind === 'ifEnemyHpBelow') return `적 HP ${effect.value} 이하일 때: ${effect.then.map(effectText).join(' + ')}`;
  return map[effect.kind] || effect.kind;
};

const cardTemplate = (card) => `<img class='card-art' src='${card.image}' alt='${card.name}' />
<h3>${card.name}</h3>
<p>${card.id} | ${card.sigil} | ${card.type}</p>
<p>패밀리: ${card.family} | 코스트 ${card.energyCost}</p>
<p>효과: ${card.effect.map(effectText).join(', ')}</p>
<p class='small'>설명: ${card.description || '설명 없음'}</p>`;

export function createUiBindings() {
  return {
    startBtn: document.querySelector('#start-btn'),
    resumeBtn: document.querySelector('#resume-btn'),
    resetSaveBtn: document.querySelector('#reset-save-btn'),
    endTurnBtn: document.querySelector('#end-turn-btn'),
    playerHp: document.querySelector('#player-hp'),
    playerMaxHp: document.querySelector('#player-max-hp'),
    playerBlock: document.querySelector('#player-block'),
    playerEnergy: document.querySelector('#player-energy'),
    enemyName: document.querySelector('#enemy-name'),
    enemyHp: document.querySelector('#enemy-hp'),
    enemyMaxHp: document.querySelector('#enemy-max-hp'),
    enemyBlock: document.querySelector('#enemy-block'),
    enemyEnergy: document.querySelector('#enemy-energy'),
    enemyIntent: document.querySelector('#enemy-intent'),
    enemyThreat: document.querySelector('#enemy-threat'),
    enemyActions: document.querySelector('#enemy-actions'),
    enemyHpFill: document.querySelector('#enemy-hp-fill'),
    playerHpFill: document.querySelector('#player-hp-fill'),
    enemySprite: document.querySelector('#enemy-sprite'),
    playerSprite: document.querySelector('#player-sprite'),
    regionName: document.querySelector('#region-name'),
    roundInfo: document.querySelector('#round-info'),
    battleState: document.querySelector('#battle-state'),
    turnOwner: document.querySelector('#turn-owner'),
    score: document.querySelector('#score'),
    synergyInfo: document.querySelector('#synergy-info'),
    synergyEffects: document.querySelector('#synergy-effects'),
    goalText: document.querySelector('#goal-text'),
    hand: document.querySelector('#hand'),
    playerDraw: document.querySelector('#player-draw'),
    playerDiscard: document.querySelector('#player-discard'),
    deckSize: document.querySelector('#deck-size'),
    rewardPanel: document.querySelector('#reward-panel'),
    rewardCards: document.querySelector('#reward-cards'),
    skipRewardBtn: document.querySelector('#skip-reward-btn'),
    finishDeckBuildBtn: document.querySelector('#finish-deck-build-btn'),
    openCodexBtn: document.querySelector('#open-codex-btn'),
    openHallBtn: document.querySelector('#open-hall-btn'),
    removeDeckCards: document.querySelector('#remove-deck-cards'),
    routePanel: document.querySelector('#route-panel'),
    routeChoices: document.querySelector('#route-choices'),
    playedCards: document.querySelector('#played-cards'),
    discoverPanel: document.querySelector('#discover-panel'),
    discoverCards: document.querySelector('#discover-cards'),
    log: document.querySelector('#log')
  };
}

export function render(ui, game, actions) {
  ui.playerHp.textContent = game.player.hp;
  ui.playerMaxHp.textContent = game.player.maxHp;
  ui.playerBlock.textContent = game.player.block;
  ui.playerEnergy.textContent = game.player.energy;
  ui.enemyName.textContent = game.enemy?.name || '-';
  ui.enemyHp.textContent = game.enemy?.hp || 0;
  ui.enemyMaxHp.textContent = game.enemy?.maxHp || 0;
  ui.enemyBlock.textContent = game.enemy?.block || 0;
  ui.enemyEnergy.textContent = game.enemy?.energy || 0;
  ui.enemyIntent.textContent = game.enemy?.intent || '-';
  ui.enemyThreat.textContent = game.enemy?.threatLevel || 1;
  ui.enemyActions.textContent = 1 + (game.enemy?.extraActionBudget || 0);
  ui.regionName.textContent = game.region;
  ui.roundInfo.textContent = `${Math.min(game.round + 1, game.totalRounds)} / ${game.totalRounds}`;
  ui.battleState.textContent = game.state;
  ui.turnOwner.textContent = game.state === STATES.ROUTE_SELECT ? '경로 선택' : (game.activeSide === 'player' ? '플레이어' : '적');
  ui.score.textContent = game.score;
  ui.playerDraw.textContent = game.player.drawPile.length;
  ui.playerDiscard.textContent = game.player.discardPile.length;
  ui.deckSize.textContent = game.deck.length;
  ui.goalText.textContent = game.state === STATES.RUN_COMPLETE ? '목표 달성! 모든 지역 정복 완료' : `목표: ${game.totalRounds}라운드 클리어`;
  ui.endTurnBtn.disabled = game.state !== STATES.PLAYER_TURN;
  ui.resumeBtn.disabled = !actions.hasSavedRun();

  const playerHpRate = game.player.maxHp ? (game.player.hp / game.player.maxHp) * 100 : 0;
  const enemyHpRate = game.enemy?.maxHp ? ((game.enemy.hp || 0) / game.enemy.maxHp) * 100 : 0;
  ui.playerHpFill.style.width = `${Math.max(0, Math.min(100, playerHpRate))}%`;
  ui.enemyHpFill.style.width = `${Math.max(0, Math.min(100, enemyHpRate))}%`;
  ui.playerSprite.classList.toggle('attacking', game.activeSide === 'player' && game.state === STATES.PLAYER_TURN);
  ui.enemySprite.classList.toggle('attacking', game.activeSide === 'enemy' && game.state === STATES.ENEMY_TURN);

  ui.hand.innerHTML = '';
  game.player.hand.forEach((card, idx) => {
    const wrap = document.createElement('article');
    wrap.className = 'card';
    wrap.innerHTML = cardTemplate(card);
    const btn = document.createElement('button');
    btn.className = 'play-btn';
    btn.textContent = '사용';
    btn.disabled = game.state !== STATES.PLAYER_TURN || game.player.energy < card.energyCost;
    btn.addEventListener('click', () => actions.playCardAt(idx));
    wrap.appendChild(btn);
    ui.hand.appendChild(wrap);
  });

  ui.synergyInfo.innerHTML = '';
  SIGILS.forEach((sigil) => {
    const d = document.createElement('div');
    d.className = 'synergy-badge';
    d.textContent = `${sigil}: ${game.player.sigilCounts[sigil]}`;
    ui.synergyInfo.appendChild(d);
  });

  ui.synergyEffects.innerHTML = '';
  SYNERGY_GUIDE.forEach((guide) => {
    const node = document.createElement('article');
    node.className = 'guide-item';
    node.innerHTML = `<h3>${guide.sigil}</h3><p class='small'>${guide.effect}</p>`;
    ui.synergyEffects.appendChild(node);
  });

  ui.rewardPanel.classList.toggle('hidden', game.state !== STATES.DECK_BUILD);
  ui.rewardCards.innerHTML = '';
  ui.removeDeckCards.innerHTML = '';
  if (game.state === STATES.DECK_BUILD) {
    game.rewardChoices.forEach((card) => {
      const node = document.createElement('article');
      node.className = 'card';
      node.innerHTML = cardTemplate(card);
      const b = document.createElement('button');
      b.className = 'play-btn';
      b.textContent = '보상 선택';
      b.disabled = game.rewardAccepted;
      b.addEventListener('click', () => actions.chooseReward(card.id));
      node.appendChild(b);
      ui.rewardCards.appendChild(node);
    });

    const groupedDeck = game.deck.map((id, index) => ({ id, index, card: CARD_LIBRARY[id] }));
    groupedDeck.forEach(({ id, index, card }) => {
      const row = document.createElement('div');
      row.className = 'deck-row';
      row.innerHTML = `<span>${index + 1}. ${card.name} (${id})</span>`;
      const rm = document.createElement('button');
      rm.textContent = '제거';
      rm.disabled = game.removedInDeckBuild;
      rm.addEventListener('click', () => actions.removeDeckCard(id));
      row.appendChild(rm);
      ui.removeDeckCards.appendChild(row);
    });

    ui.skipRewardBtn.disabled = game.rewardAccepted;
    ui.finishDeckBuildBtn.disabled = !game.rewardAccepted;
  }

  ui.routePanel.classList.toggle('hidden', game.state !== STATES.ROUTE_SELECT);
  ui.routeChoices.innerHTML = '';
  if (game.state === STATES.ROUTE_SELECT) {
    game.routeChoices.forEach((route, index) => {
      const node = document.createElement('article');
      node.className = 'guide-item';
      const regionName = REGIONS.find((r) => r.id === route.regionId)?.name || route.regionId;
      const enemyName = ENEMY_ARCHETYPES[route.enemyId]?.name || route.enemyId;
      node.innerHTML = `<h3>${index + 1}. ${regionName}</h3><p>다음 적: ${enemyName}</p><p class='small'>효과: ${route.modifier.name} - ${route.modifier.detail}</p>`;
      const btn = document.createElement('button');
      btn.className = 'play-btn';
      btn.textContent = '이 경로로 이동';
      btn.addEventListener('click', () => actions.selectRoute(index));
      node.appendChild(btn);
      ui.routeChoices.appendChild(node);
    });
  }

  ui.playedCards.innerHTML = '';
  if (!game.playedCardsHistory.length) {
    const empty = document.createElement('div');
    empty.className = 'history-item';
    empty.textContent = '아직 사용한 카드가 없습니다.';
    ui.playedCards.appendChild(empty);
  } else {
    game.playedCardsHistory.forEach((history, index) => {
      const item = document.createElement('div');
      item.className = 'history-item';
      item.textContent = `${index + 1}. ${history.name} (${history.id})`;
      ui.playedCards.appendChild(item);
    });
  }

  const discovering = game.discoverChoices.length > 0;
  ui.discoverPanel.classList.toggle('hidden', !discovering);
  ui.discoverCards.innerHTML = '';
  if (discovering) {
    game.discoverChoices.forEach((card) => {
      const node = document.createElement('article');
      node.className = 'card';
      node.innerHTML = cardTemplate(card);
      const b = document.createElement('button');
      b.className = 'play-btn';
      b.textContent = '손패로 가져오기';
      b.addEventListener('click', () => actions.selectDiscoverCard(card.id));
      node.appendChild(b);
      ui.discoverCards.appendChild(node);
    });
  }

  ui.log.innerHTML = '';
  game.logs.forEach((line) => {
    const [text, level] = line.split('::');
    const div = document.createElement('div');
    div.className = `log-line ${level || ''}`;
    div.textContent = text;
    ui.log.appendChild(div);
  });
}
