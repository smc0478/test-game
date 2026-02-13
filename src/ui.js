import { SIGILS, STATES } from './constants.js';
import { CARD_LIBRARY, REGIONS, ENEMY_ARCHETYPES } from './data.js';

const SYNERGY_GUIDE = [
  { sigil: 'Flame', effect: '동일 문양 2회 이상 사용 시 공격 피해 +5' },
  { sigil: 'Leaf', effect: '동일 문양 2회 이상 사용 시 방어 +7' },
  { sigil: 'Gear', effect: '동일 문양 2회 이상 사용 시 드로우 +1' },
  { sigil: 'Void', effect: '동일 문양 2회 이상 사용 시 공격 +3 + 흡혈 1' },
  { sigil: 'Burst', effect: '같은 문양 4회 사용 시 해당 문양 버스트 1회 발동 (+15점)' }
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
    drawByFamilyCount: `같은 패밀리 사용 횟수만큼 드로우 x${effect.value}`,
    attackPerHandCard: `현재 손패 장수 x${effect.value} 피해`,
    redrawHandTo: `손패 전부 교체 후 ${effect.value}장 드로우`,
    gainNextTurnEnergy: `다음 턴 에너지 +${effect.value}`,
    drawThenDiscount: `카드 ${effect.value}장 드로우 후 코스트 -${effect.discount || 1}`,
    discover: `도감에서 후보 ${effect.value}장 제시`,
    rewind: '직전 사용 카드 효과 재발동',
    gamble: '무작위 결과 1개 발동'
  };
  if (effect.kind === 'ifLastTurnFamily') return `전 턴 ${effect.family}: ${effect.then.map(effectText).join(' + ')}`;
  if (effect.kind === 'ifEnemyIntent') return `적 의도(${effect.intent})일 때: ${effect.then.map(effectText).join(' + ')}`;
  if (effect.kind === 'ifEnemyHpBelow') return `적 HP ${effect.value} 이하일 때: ${effect.then.map(effectText).join(' + ')}`;
  return map[effect.kind] || effect.kind;
};

const SIGIL_LABELS = { Flame: '화염', Leaf: '리프', Gear: '기어', Void: '공허', Burst: '버스트' };
const sigilIcon = (sigil) => ({ Flame: '🔥', Leaf: '🍃', Gear: '⚙️', Void: '🌌', Burst: '💥' }[sigil] || '✨');

const updateBattleHandDensity = (ui, handCount) => {
  const maxCardWidth = 200;
  const minCardWidth = 138;
  const gap = 10;
  const containerWidth = ui.hand.clientWidth || 0;
  const requiredWidth = handCount * maxCardWidth + Math.max(0, handCount - 1) * gap;
  const shouldCompress = handCount > 0 && containerWidth > 0 && requiredWidth > containerWidth;

  ui.hand.classList.toggle('is-compressed', shouldCompress);
  if (!shouldCompress) {
    ui.hand.style.removeProperty('--battle-card-width');
    return;
  }

  const targetWidth = Math.floor((containerWidth - Math.max(0, handCount - 1) * gap) / handCount);
  const compressedWidth = Math.max(minCardWidth, Math.min(maxCardWidth, targetWidth));
  ui.hand.style.setProperty('--battle-card-width', `${compressedWidth}px`);
};

const cardTemplate = (card) => `<div class='card-top'>
  <span class='sigil-chip sigil-${card.sigil.toLowerCase()}'>${sigilIcon(card.sigil)} ${SIGIL_LABELS[card.sigil] || card.sigil}</span>
  <span class='cost-chip'>코스트 ${card.energyCost}</span>
</div>
<img class='card-art' src='${card.image}' alt='${card.name}' />
<h3>${card.name}</h3>
<p class='meta'>${card.id} · ${card.type} · ${card.family}</p>
<p><strong>효과</strong> ${card.effect.map(effectText).join(', ')}</p>
<p class='small'>${card.description || '설명 없음'}</p>`;

const statusSummary = (actor) => {
  if (!actor) return '없음';
  const bag = [];
  if (actor.attackBuff > 0) bag.push(`공격 강화 ${actor.attackBuff}`);
  if (actor.thorns > 0) bag.push(`가시 ${actor.thorns}`);
  if (actor.vulnerable > 0) bag.push(`취약 ${actor.vulnerable}`);
  return bag.length ? bag.join(', ') : '없음';
};

const movePanelNearPointer = (panelEl, nativeEvent, side = 'right') => {
  const offset = 14;
  const panelWidth = panelEl.offsetWidth || 280;
  const panelHeight = panelEl.offsetHeight || 200;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const pointerX = nativeEvent?.clientX ?? viewportWidth * 0.5;
  const pointerY = nativeEvent?.clientY ?? viewportHeight * 0.5;
  let x = side === 'left' ? pointerX - panelWidth - offset : pointerX + offset;
  if (x < 8) x = 8;
  if (x + panelWidth > viewportWidth - 8) x = viewportWidth - panelWidth - 8;
  let y = pointerY - panelHeight * 0.5;
  if (y < 8) y = 8;
  if (y + panelHeight > viewportHeight - 8) y = viewportHeight - panelHeight - 8;
  panelEl.style.left = `${Math.round(x)}px`;
  panelEl.style.top = `${Math.round(y)}px`;
};

const createRouteChoiceNode = (route, index, actions) => {
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
  return node;
};

export function bindBattleHoverPanels(ui) {
  const show = (panel, event, side) => {
    panel.classList.add('visible');
    panel.setAttribute('aria-hidden', 'false');
    movePanelNearPointer(panel, event, side);
  };
  const hide = (panel) => {
    panel.classList.remove('visible');
    panel.setAttribute('aria-hidden', 'true');
  };

  return {
    showPlayer: (event) => show(ui.playerHoverInfo, event, 'right'),
    showEnemy: (event) => show(ui.enemyHoverInfo, event, 'left'),
    hidePlayer: () => hide(ui.playerHoverInfo),
    hideEnemy: () => hide(ui.enemyHoverInfo)
  };
}

export function createBattleSnapshot(game) {
  const player = game.player;
  const enemy = game.enemy;
  return {
    roundLabel: `${Math.min(game.round + 1, game.totalRounds)} / ${game.totalRounds}`,
    turnOwner: game.activeSide === 'player' ? '플레이어' : '적',
    stateLabel: game.state,
    enemyIntent: enemy?.intent || '-',
    handCount: player.hand.length,
    playableCount: player.hand.filter((card) => card.energyCost <= player.energy).length,
    playerHp: player.hp,
    playerMaxHp: player.maxHp,
    playerBlock: player.block,
    playerEnergy: player.energy,
    enemyHp: enemy?.hp || 0,
    enemyMaxHp: enemy?.maxHp || 0,
    enemyBlock: enemy?.block || 0,
    enemyEnergy: enemy?.energy || 0,
    enemyName: enemy?.name || '적'
  };
}

export function createUiBindings() {
  return {
    startBtn: document.querySelector('#start-btn'),
    resumeBtn: document.querySelector('#resume-btn'),
    resetSaveBtn: document.querySelector('#reset-save-btn'),
    endTurnBtn: document.querySelector('#end-turn-btn'),
    turnGuide: document.querySelector('#turn-guide'),
    gameRoot: document.querySelector('#game-root'),
    playerHp: document.querySelector('#player-hp'),
    playerMaxHp: document.querySelector('#player-max-hp'),
    playerHpMain: document.querySelector('#player-hp-main'),
    playerMaxHpMain: document.querySelector('#player-max-hp-main'),
    playerBlock: document.querySelector('#player-block'),
    playerEnergy: document.querySelector('#player-energy'),
    enemyName: document.querySelector('#enemy-name'),
    enemyHp: document.querySelector('#enemy-hp'),
    enemyMaxHp: document.querySelector('#enemy-max-hp'),
    enemyHpMain: document.querySelector('#enemy-hp-main'),
    enemyMaxHpMain: document.querySelector('#enemy-max-hp-main'),
    enemyBlock: document.querySelector('#enemy-block'),
    enemyEnergy: document.querySelector('#enemy-energy'),
    enemyIntent: document.querySelector('#enemy-intent'),
    enemyThreat: document.querySelector('#enemy-threat'),
    enemyActions: document.querySelector('#enemy-actions'),
    playerStatus: document.querySelector('#player-status'),
    enemyStatus: document.querySelector('#enemy-status'),
    playerHoverInfo: document.querySelector('#player-hover-info'),
    enemyHoverInfo: document.querySelector('#enemy-hover-info'),
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
    canvasDeckBuildOverlay: document.querySelector('#canvas-deckbuild-overlay'),
    canvasRouteOverlay: document.querySelector('#canvas-route-overlay'),
    canvasRouteChoices: document.querySelector('#canvas-route-choices'),
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
  ui.playerHpMain.textContent = game.player.hp;
  ui.playerMaxHpMain.textContent = game.player.maxHp;
  ui.playerBlock.textContent = game.player.block;
  ui.playerEnergy.textContent = game.player.energy;
  ui.enemyName.textContent = game.enemy?.name || '-';
  ui.enemyHp.textContent = game.enemy?.hp || 0;
  ui.enemyMaxHp.textContent = game.enemy?.maxHp || 0;
  ui.enemyHpMain.textContent = game.enemy?.hp || 0;
  ui.enemyMaxHpMain.textContent = game.enemy?.maxHp || 0;
  ui.enemyBlock.textContent = game.enemy?.block || 0;
  ui.enemyEnergy.textContent = game.enemy?.energy || 0;
  ui.enemyIntent.textContent = game.enemy?.intent || '-';
  ui.enemyThreat.textContent = game.enemy?.threatLevel || 1;
  const intentDamage = game.enemy?.intentDamage;
  const intentPlan = game.enemy?.intentPlan || [];
  const intentPlanText = intentPlan.length
    ? ` · 예상 카드 ${intentPlan.map((step) => `${step.name}${step.damage === null ? '(계산 불가)' : `(${step.damage})`}`).join(' → ')}`
    : '';
  ui.enemyActions.textContent = intentDamage === null || intentDamage === undefined
    ? `에너지 소진형${intentPlanText}`
    : `에너지 소진형 · 예상 공격 ${intentDamage}${intentPlanText}`;
  ui.playerStatus.textContent = statusSummary(game.player);
  ui.enemyStatus.textContent = statusSummary(game.enemy);
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
  ui.turnGuide.textContent = game.state === STATES.PLAYER_TURN
    ? '카드를 고르고 턴 종료 버튼으로 적 턴을 진행하세요.'
    : game.state === STATES.ENEMY_TURN
      ? '적 행동 처리 중입니다. 잠시 기다려 주세요.'
      : '상태에 맞는 진행 버튼을 선택해 전투를 이어가세요.';

  ui.hand.innerHTML = '';
  game.player.hand.forEach((card, idx) => {
    const wrap = document.createElement('article');
    wrap.className = `card sigil-${card.sigil.toLowerCase()}`;
    wrap.innerHTML = cardTemplate(card);
    const btn = document.createElement('button');
    btn.className = 'play-btn';
    btn.textContent = '사용';
    btn.disabled = game.state !== STATES.PLAYER_TURN || game.player.energy < card.energyCost;
    btn.addEventListener('click', () => actions.playCardAt(idx));
    wrap.appendChild(btn);
    ui.hand.appendChild(wrap);
  });
  updateBattleHandDensity(ui, game.player.hand.length);

  ui.synergyInfo.innerHTML = '';
  SIGILS.forEach((sigil) => {
    const d = document.createElement('div');
    d.className = 'synergy-badge';
    d.textContent = `${sigilIcon(sigil)} ${SIGIL_LABELS[sigil] || sigil}: ${game.player.sigilCounts[sigil]}`;
    ui.synergyInfo.appendChild(d);
  });

  ui.synergyEffects.innerHTML = '';
  SYNERGY_GUIDE.forEach((guide) => {
    const node = document.createElement('article');
    node.className = 'guide-item';
    node.innerHTML = `<h3>${sigilIcon(guide.sigil)} ${SIGIL_LABELS[guide.sigil] || guide.sigil}</h3><p class='small'>${guide.effect}</p>`;
    ui.synergyEffects.appendChild(node);
  });

  ui.canvasDeckBuildOverlay.classList.toggle('hidden', game.state !== STATES.DECK_BUILD);
  ui.rewardCards.innerHTML = '';
  ui.removeDeckCards.innerHTML = '';
  if (game.state === STATES.DECK_BUILD) {
    game.rewardChoices.forEach((card) => {
      const node = document.createElement('article');
      node.className = `card sigil-${card.sigil.toLowerCase()}`;
      node.innerHTML = cardTemplate(card);
      const b = document.createElement('button');
      b.className = 'play-btn';
      b.textContent = '보상 선택';
      b.disabled = game.rewardAccepted;
      b.addEventListener('click', () => actions.chooseReward(card.id));
      node.appendChild(b);
      ui.rewardCards.appendChild(node);
    });

    (game.removeChoices || []).forEach((choice) => {
      const card = CARD_LIBRARY[choice.id];
      if (!card) return;
      const node = document.createElement('article');
      node.className = `card mini sigil-${card.sigil.toLowerCase()}`;
      node.innerHTML = cardTemplate(card);
      const rm = document.createElement('button');
      rm.className = 'play-btn';
      rm.textContent = '이 카드 제거';
      rm.disabled = game.removedInDeckBuild || game.deck.length <= 5;
      rm.addEventListener('click', () => actions.removeDeckCard(choice.deckIndex));
      node.appendChild(rm);
      ui.removeDeckCards.appendChild(node);
    });

    ui.skipRewardBtn.disabled = game.rewardAccepted;
    ui.finishDeckBuildBtn.disabled = !game.rewardAccepted;
  }

  ui.routePanel.classList.toggle('hidden', game.state !== STATES.ROUTE_SELECT);
  ui.canvasRouteOverlay.classList.toggle('hidden', game.state !== STATES.ROUTE_SELECT);
  ui.routeChoices.innerHTML = '';
  ui.canvasRouteChoices.innerHTML = '';
  if (game.state === STATES.ROUTE_SELECT) {
    game.routeChoices.forEach((route, index) => {
      ui.routeChoices.appendChild(createRouteChoiceNode(route, index, actions));
      ui.canvasRouteChoices.appendChild(createRouteChoiceNode(route, index, actions));
    });
  }

  ui.playedCards.innerHTML = '';
  (game.playedCardsHistory.length ? game.playedCardsHistory : [{ name: '아직 사용한 카드가 없습니다.', id: '-' }]).forEach((history, index) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.textContent = history.id === '-' ? history.name : `${index + 1}. ${history.name} (${history.id})`;
    ui.playedCards.appendChild(item);
  });

  ui.discoverPanel.classList.toggle('hidden', game.discoverChoices.length === 0);
  ui.discoverCards.innerHTML = '';
  game.discoverChoices.forEach((card) => {
    const node = document.createElement('article');
    node.className = `card sigil-${card.sigil.toLowerCase()}`;
    node.innerHTML = cardTemplate(card);
    const b = document.createElement('button');
    b.className = 'play-btn';
    b.textContent = '손패로 가져오기';
    b.addEventListener('click', () => actions.selectDiscoverCard(card.id));
    node.appendChild(b);
    ui.discoverCards.appendChild(node);
  });

  ui.log.innerHTML = '';
  game.logs.forEach((line) => {
    const [text, level] = line.split('::');
    const div = document.createElement('div');
    div.className = `log-line ${level || ''}`;
    div.textContent = text;
    ui.log.appendChild(div);
  });
}
