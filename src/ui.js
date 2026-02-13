import { SIGILS, STATES } from './constants.js';

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
    swapIntent: '적 의도 전환'
  };
  if (effect.kind === 'ifLastTurnFamily') return `전 턴 ${effect.family}: ${effect.then.map(effectText).join(' + ')}`;
  if (effect.kind === 'ifEnemyIntent') return `적 의도(${effect.intent})일 때: ${effect.then.map(effectText).join(' + ')}`;
  return map[effect.kind] || effect.kind;
};

export function createUiBindings() {
  return {
    startBtn: document.querySelector('#start-btn'),
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
    regionName: document.querySelector('#region-name'),
    roundInfo: document.querySelector('#round-info'),
    battleState: document.querySelector('#battle-state'),
    turnOwner: document.querySelector('#turn-owner'),
    score: document.querySelector('#score'),
    synergyInfo: document.querySelector('#synergy-info'),
    goalText: document.querySelector('#goal-text'),
    hand: document.querySelector('#hand'),
    playerDraw: document.querySelector('#player-draw'),
    playerDiscard: document.querySelector('#player-discard'),
    deckSize: document.querySelector('#deck-size'),
    rewardPanel: document.querySelector('#reward-panel'),
    rewardCards: document.querySelector('#reward-cards'),
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
  ui.regionName.textContent = game.region;
  ui.roundInfo.textContent = `${Math.min(game.round + 1, game.totalRounds)} / ${game.totalRounds}`;
  ui.battleState.textContent = game.state;
  ui.turnOwner.textContent = game.activeSide === 'player' ? '플레이어' : '적';
  ui.score.textContent = game.score;
  ui.playerDraw.textContent = game.player.drawPile.length;
  ui.playerDiscard.textContent = game.player.discardPile.length;
  ui.deckSize.textContent = game.deck.length;
  ui.goalText.textContent = game.state === STATES.RUN_COMPLETE ? '목표 달성! 모든 지역 정복 완료' : '목표: 6라운드 클리어';
  ui.endTurnBtn.disabled = game.state !== STATES.PLAYER_TURN;

  ui.hand.innerHTML = '';
  game.player.hand.forEach((card, idx) => {
    const wrap = document.createElement('article');
    wrap.className = 'card';
    wrap.innerHTML = `<img class='card-art' src='${card.image}' alt='${card.name}' /><h3>${card.name}</h3><p>${card.id} | ${card.sigil} | ${card.type}</p><p>패밀리: ${card.family} | 코스트 ${card.energyCost}</p><p>효과: ${card.effect.map(effectText).join(', ')}</p>`;
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

  ui.rewardPanel.classList.toggle('hidden', game.state !== STATES.DECK_BUILD);
  ui.rewardCards.innerHTML = '';
  if (game.state === STATES.DECK_BUILD) {
    game.rewardChoices.forEach((card) => {
      const node = document.createElement('article');
      node.className = 'card';
      node.innerHTML = `<img class='card-art' src='${card.image}' alt='${card.name}' /><h3>${card.name}</h3><p>${card.effect.map(effectText).join(', ')}</p>`;
      const b = document.createElement('button');
      b.className = 'play-btn';
      b.textContent = '선택';
      b.addEventListener('click', () => actions.chooseReward(card.id));
      node.appendChild(b);
      ui.rewardCards.appendChild(node);
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
