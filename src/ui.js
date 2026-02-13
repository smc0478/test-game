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

const SIGIL_LABELS = {
  Flame: '화염',
  Leaf: '리프',
  Gear: '기어',
  Void: '공허',
  Burst: '버스트'
};

const sigilIcon = (sigil) => {
  const icons = {
    Flame: '🔥',
    Leaf: '🍃',
    Gear: '⚙️',
    Void: '🌌',
    Burst: '💥'
  };
  return icons[sigil] || '✨';
};


const PLAYER_PORTRAIT = (() => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'>
    <defs>
      <linearGradient id='playerBg' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#60a5fa'/>
        <stop offset='1' stop-color='#1d4ed8'/>
      </linearGradient>
    </defs>
    <rect width='220' height='220' rx='28' fill='url(#playerBg)'/>
    <circle cx='110' cy='90' r='54' fill='rgba(15,23,42,0.45)' stroke='rgba(255,255,255,0.55)' stroke-width='3'/>
    <text x='110' y='108' text-anchor='middle' font-size='56'>🧙</text>
    <rect x='18' y='154' width='184' height='48' rx='12' fill='rgba(15,23,42,0.62)'/>
    <text x='110' y='184' text-anchor='middle' fill='white' font-size='18' font-weight='700' font-family='sans-serif'>플레이어</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
})();

const cardTemplate = (card) => `<div class='card-top'>
  <span class='sigil-chip sigil-${card.sigil.toLowerCase()}'>${sigilIcon(card.sigil)} ${SIGIL_LABELS[card.sigil] || card.sigil}</span>
  <span class='cost-chip'>코스트 ${card.energyCost}</span>
</div>
<img class='card-art' src='${card.image}' alt='${card.name}' />
<h3>${card.name}</h3>
<p class='meta'>${card.id} · ${card.type} · ${card.family}</p>
<p><strong>효과</strong> ${card.effect.map(effectText).join(', ')}</p>
<p class='small'>${card.description || '설명 없음'}</p>`;

class BattleCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas?.getContext('2d');
    this.time = 0;
    this.lastTs = 0;
    this.playerPulse = 0;
    this.enemyPulse = 0;
    if (this.ctx) {
      requestAnimationFrame((ts) => this.tick(ts));
    }
  }

  tick(ts) {
    const delta = this.lastTs ? (ts - this.lastTs) / 1000 : 0;
    this.lastTs = ts;
    this.time += delta;
    this.playerPulse = Math.max(0, this.playerPulse - delta * 2.2);
    this.enemyPulse = Math.max(0, this.enemyPulse - delta * 2.2);
    if (this.snapshot) {
      this.draw();
    }
    requestAnimationFrame((next) => this.tick(next));
  }

  update(snapshot) {
    if (!this.ctx) return;
    if (this.snapshot && snapshot.activeSide !== this.snapshot.activeSide) {
      if (snapshot.activeSide === 'player') this.playerPulse = 1;
      if (snapshot.activeSide === 'enemy') this.enemyPulse = 1;
    }
    this.snapshot = snapshot;
    this.resize();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.max(220, Math.floor(rect.height));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }

  drawFighter({ x, y, radius, color, hpRate, label, block, energy, pulse }) {
    const { ctx } = this;
    const bob = Math.sin(this.time * 2.4 + x * 0.001) * 6;
    const attackShift = pulse > 0 ? pulse * 18 : 0;

    ctx.save();
    ctx.translate(x + attackShift, y + bob);

    ctx.fillStyle = 'rgba(2, 6, 23, 0.58)';
    ctx.beginPath();
    ctx.ellipse(0, radius + 18, radius + 34, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(-radius * 0.25, -radius * 0.25, radius * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#dbeafe';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, 0, -radius - 24);

    const barW = radius * 2.2;
    ctx.fillStyle = '#111827';
    ctx.fillRect(-barW / 2, -radius - 14, barW, 8);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(-barW / 2, -radius - 14, barW * hpRate, 8);

    ctx.fillStyle = '#bfdbfe';
    ctx.font = '12px sans-serif';
    ctx.fillText(`방어 ${block} · 에너지 ${energy}`, 0, radius + 34);

    ctx.restore();
  }

  draw() {
    const { ctx, canvas, snapshot } = this;
    if (!ctx || !snapshot) return;

    const w = canvas.width;
    const h = canvas.height;
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, '#274690');
    gradient.addColorStop(0.48, '#0d1b3d');
    gradient.addColorStop(1, '#060b1f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(112, 193, 255, 0.14)';
    ctx.fillRect(0, h * 0.66, w, h * 0.34);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VS', w * 0.5, h * 0.42);

    this.drawFighter({
      x: w * 0.24,
      y: h * 0.54,
      radius: Math.min(56, w * 0.06),
      color: '#fb923c',
      hpRate: snapshot.enemyHpRate,
      label: snapshot.enemyName || '적',
      block: snapshot.enemyBlock,
      energy: snapshot.enemyEnergy,
      pulse: this.enemyPulse
    });

    this.drawFighter({
      x: w * 0.76,
      y: h * 0.54,
      radius: Math.min(56, w * 0.06),
      color: '#38bdf8',
      hpRate: snapshot.playerHpRate,
      label: '플레이어',
      block: snapshot.playerBlock,
      energy: snapshot.playerEnergy,
      pulse: this.playerPulse
    });

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '15px sans-serif';
    ctx.fillText(`턴: ${snapshot.turnOwner} · 상태: ${snapshot.stateLabel}`, w * 0.5, h * 0.14);

    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
    ctx.fillRect(18, 14, 260, 64);
    ctx.fillStyle = '#cfe4ff';
    ctx.font = '13px sans-serif';
    ctx.fillText(`라운드 ${snapshot.roundLabel}`, 30, 38);
    ctx.fillText(`적 의도: ${snapshot.enemyIntent}`, 30, 60);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
    ctx.fillRect(w - 278, 14, 260, 64);
    ctx.fillStyle = '#cfe4ff';
    ctx.fillText(`손패 ${snapshot.handCount}장 · 사용 가능 ${snapshot.playableCount}장`, w - 30, 38);
    ctx.fillText(snapshot.quickHint, w - 30, 60);
  }
}


const statusSummary = (actor) => {
  if (!actor) return '없음';
  const bag = [];
  if (actor.attackBuff > 0) bag.push(`공격 강화 ${actor.attackBuff}`);
  if (actor.thorns > 0) bag.push(`가시 ${actor.thorns}`);
  if (actor.vulnerable > 0) bag.push(`취약 ${actor.vulnerable}`);
  return bag.length ? bag.join(', ') : '없음';
};

const bindHoverInfoPanel = (triggerEl, panelEl, preferredSide) => {
  if (!triggerEl || !panelEl) return;
  let open = false;

  const placePanel = (event) => {
    const offset = 14;
    const panelWidth = panelEl.offsetWidth || 280;
    const panelHeight = panelEl.offsetHeight || 200;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const rect = triggerEl.getBoundingClientRect();

    const baseX = preferredSide === 'left'
      ? rect.left - panelWidth - offset
      : rect.right + offset;
    const fallbackX = preferredSide === 'left'
      ? rect.right + offset
      : rect.left - panelWidth - offset;

    let nextX = baseX;
    if (nextX < 8 || nextX + panelWidth > viewportWidth - 8) {
      nextX = fallbackX;
    }

    if (nextX < 8) nextX = 8;
    if (nextX + panelWidth > viewportWidth - 8) nextX = viewportWidth - panelWidth - 8;

    const pointerY = event?.clientY ?? (rect.top + rect.height * 0.5);
    let nextY = pointerY - panelHeight * 0.5;
    if (nextY < 8) nextY = 8;
    if (nextY + panelHeight > viewportHeight - 8) nextY = viewportHeight - panelHeight - 8;

    panelEl.style.left = `${Math.round(nextX)}px`;
    panelEl.style.top = `${Math.round(nextY)}px`;
  };

  const show = (event) => {
    if (!open) {
      panelEl.classList.add('visible');
      panelEl.setAttribute('aria-hidden', 'false');
      open = true;
    }
    placePanel(event);
  };

  const hide = () => {
    open = false;
    panelEl.classList.remove('visible');
    panelEl.setAttribute('aria-hidden', 'true');
  };

  triggerEl.addEventListener('mouseenter', show);
  triggerEl.addEventListener('mousemove', show);
  triggerEl.addEventListener('mouseleave', hide);
  window.addEventListener('resize', () => {
    if (open) placePanel();
  });
};

export function initBattleUI(ui) {
  bindHoverInfoPanel(ui.playerHitArea, ui.playerHoverInfo, 'right');
  bindHoverInfoPanel(ui.enemyHitArea, ui.enemyHoverInfo, 'left');
}

export function createUiBindings() {
  return {
    startBtn: document.querySelector('#start-btn'),
    resumeBtn: document.querySelector('#resume-btn'),
    resetSaveBtn: document.querySelector('#reset-save-btn'),
    endTurnBtn: document.querySelector('#end-turn-btn'),
    turnGuide: document.querySelector('#turn-guide'),
    battleCanvas: document.querySelector('#battle-canvas'),
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
    playerStatus: document.querySelector('#player-status'),
    enemyStatus: document.querySelector('#enemy-status'),
    enemyHpFill: document.querySelector('#enemy-hp-fill'),
    playerHpFill: document.querySelector('#player-hp-fill'),
    enemySprite: document.querySelector('#enemy-sprite'),
    playerSprite: document.querySelector('#player-sprite'),
    enemyPortrait: document.querySelector('#enemy-portrait'),
    playerPortrait: document.querySelector('#player-portrait'),
    playerHitArea: document.querySelector('#player-hit-area'),
    enemyHitArea: document.querySelector('#enemy-hit-area'),
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
    log: document.querySelector('#log'),
    battleCanvasRenderer: new BattleCanvas(document.querySelector('#battle-canvas'))
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
  ui.enemyActions.textContent = '에너지 소진형';
  ui.playerStatus.textContent = statusSummary(game.player);
  ui.enemyStatus.textContent = statusSummary(game.enemy);
  ui.regionName.textContent = game.region;
  ui.roundInfo.textContent = `${Math.min(game.round + 1, game.totalRounds)} / ${game.totalRounds}`;
  ui.battleState.textContent = game.state;
  const turnOwnerLabel = game.state === STATES.ROUTE_SELECT ? '경로 선택' : (game.activeSide === 'player' ? '플레이어' : '적');
  ui.turnOwner.textContent = turnOwnerLabel;
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

  const enemyPortrait = game.enemy?.archetypeId ? ENEMY_ARCHETYPES[game.enemy.archetypeId]?.image : null;
  ui.enemyPortrait.src = enemyPortrait || PLAYER_PORTRAIT;
  ui.enemyPortrait.alt = game.enemy ? `${game.enemy.name} 초상` : '적 초상';
  ui.playerPortrait.src = PLAYER_PORTRAIT;
  ui.playerPortrait.alt = '플레이어 초상';

  const playerHpRate = game.player.maxHp ? (game.player.hp / game.player.maxHp) * 100 : 0;
  const enemyHpRate = game.enemy?.maxHp ? ((game.enemy.hp || 0) / game.enemy.maxHp) * 100 : 0;
  ui.playerHpFill.style.width = `${Math.max(0, Math.min(100, playerHpRate))}%`;
  ui.enemyHpFill.style.width = `${Math.max(0, Math.min(100, enemyHpRate))}%`;

  ui.battleCanvasRenderer.update({
    activeSide: game.activeSide,
    turnOwner: turnOwnerLabel,
    stateLabel: game.state,
    roundLabel: `${Math.min(game.round + 1, game.totalRounds)} / ${game.totalRounds}`,
    enemyIntent: game.enemy?.intent || '-',
    handCount: game.player.hand.length,
    playableCount: game.player.hand.filter((card) => card.energyCost <= game.player.energy).length,
    quickHint: game.state === STATES.PLAYER_TURN ? '카드 선택 후 턴 종료' : '턴 처리 중',
    playerBlock: game.player.block,
    playerEnergy: game.player.energy,
    enemyBlock: game.enemy?.block || 0,
    enemyEnergy: game.enemy?.energy || 0,
    playerHpRate: Math.max(0, Math.min(1, playerHpRate / 100)),
    enemyHpRate: Math.max(0, Math.min(1, enemyHpRate / 100)),
    enemyName: game.enemy?.name || '적'
  });

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

    const removeChoices = game.removeChoices || [];
    removeChoices.forEach((choice) => {
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

    if (!removeChoices.length) {
      const empty = document.createElement('div');
      empty.className = 'history-item';
      empty.textContent = '덱이 5장 이하라 제거 후보가 생성되지 않았습니다.';
      ui.removeDeckCards.appendChild(empty);
    }

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
      node.className = `card sigil-${card.sigil.toLowerCase()}`;
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
