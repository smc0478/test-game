import { CARD_LIBRARY, STARTER_DECK, REGIONS, ENEMY_ARCHETYPES } from './data.js';
import { STATES, SIGILS, MAX_ENERGY, MAX_HAND } from './constants.js';
import { clamp, shuffle } from './utils.js';

const cloneCard = (id) => ({ ...CARD_LIBRARY[id], effect: CARD_LIBRARY[id].effect.map((e) => ({ ...e })) });

function createActor({ name, hp, deckIds }) {
  return {
    name, hp, maxHp: hp, block: 0, energy: 0,
    hand: [], drawPile: shuffle(deckIds), discardPile: [],
    attackBuff: 0, thorns: 0, vulnerable: 0,
    turnFamilyCounts: {}, turnFamiliesUsed: new Set(), lastTurnFamilies: new Set(),
    sigilCounts: { Flame: 0, Leaf: 0, Gear: 0, Void: 0 },
    activeSynergies: { Flame: false, Leaf: false, Gear: false, Void: false },
    comboChain: 0, lastSigil: null, turnScoreMultiplier: false,
    adrenalineTriggered: false, prismBurstTriggered: false, momentumTriggered: false,
    intent: '준비', intentType: 'skill'
  };
}

export function createGame() {
  return {
    state: STATES.READY, round: 0, totalRounds: 6, activeSide: 'player',
    region: '-', score: 0, deck: [...STARTER_DECK], rewardChoices: [],
    rewardAccepted: false, removedInDeckBuild: false, discoverChoices: [],
    logs: ['대기 중: 런 시작 버튼을 누르세요.'],
    player: createActor({ name: '플레이어', hp: 72, deckIds: STARTER_DECK }),
    enemy: null
  };
}

export function createEngine(game, hooks) {
  const { onRender } = hooks;
  const log = (msg, type = 'normal') => {
    game.logs.unshift(`[${new Date().toLocaleTimeString('ko-KR')}] ${msg}::${type}`);
    game.logs = game.logs.slice(0, 48);
  };

  const draw = (actor, n) => {
    for (let i = 0; i < n; i += 1) {
      if (actor.hand.length >= MAX_HAND) break;
      if (actor.drawPile.length === 0) {
        if (actor.discardPile.length === 0) return;
        actor.drawPile = shuffle(actor.discardPile);
        actor.discardPile = [];
      }
      actor.hand.push(cloneCard(actor.drawPile.shift()));
    }
  };

  const scoreAction = (card) => { game.score += card.type === 'attack' ? 10 : 8; };

  const beginTurn = (actor, isPlayer) => {
    actor.block = 0;
    actor.energy = MAX_ENERGY;
    actor.turnFamilyCounts = {};
    actor.turnFamiliesUsed = new Set();
    actor.comboChain = 0;
    actor.lastSigil = null;
    actor.adrenalineTriggered = false;
    actor.prismBurstTriggered = false;
    actor.momentumTriggered = false;
    actor.sigilCounts = { Flame: 0, Leaf: 0, Gear: 0, Void: 0 };
    actor.activeSynergies = { Flame: false, Leaf: false, Gear: false, Void: false };
    actor.turnScoreMultiplier = false;
    actor.thorns = 0;
    actor.vulnerable = Math.max(0, actor.vulnerable - 1);
    draw(actor, 5);
    if (isPlayer) log('플레이어 턴 시작');
  };

  const applyDamage = (target, value) => {
    const blocked = Math.min(target.block, value);
    const real = Math.max(0, value - blocked);
    target.block -= blocked;
    target.hp = clamp(target.hp - real, 0, target.maxHp);
    return real;
  };

  const removeCardEverywhere = (cardId) => {
    const removeOnce = (pile) => {
      const index = pile.findIndex((idOrCard) => (typeof idOrCard === 'string' ? idOrCard : idOrCard.id) === cardId);
      if (index >= 0) pile.splice(index, 1);
    };
    removeOnce(game.deck);
    removeOnce(game.player.drawPile);
    removeOnce(game.player.discardPile);
    removeOnce(game.player.hand);
  };

  const updateSynergy = (actor, card) => {
    actor.sigilCounts[card.sigil] += 1;
    actor.turnFamiliesUsed.add(card.family);
    actor.turnFamilyCounts[card.family] = (actor.turnFamilyCounts[card.family] || 0) + 1;
    if (actor.lastSigil && actor.lastSigil !== card.sigil) actor.comboChain = Math.min(4, actor.comboChain + 1);
    actor.lastSigil = card.sigil;

    SIGILS.forEach((sigil) => { actor.activeSynergies[sigil] = actor.sigilCounts[sigil] >= 2; });
    const activeCount = SIGILS.filter((s) => actor.activeSynergies[s]).length;
    if (activeCount >= 2 && !actor.adrenalineTriggered) {
      actor.energy += 1;
      draw(actor, 1);
      game.score += 12;
      actor.adrenalineTriggered = true;
      log(`${actor.name} 아드레날린 발동`);
    }
    if (new Set(SIGILS.filter((s) => actor.sigilCounts[s] > 0)).size === 4) {
      actor.turnScoreMultiplier = true;
      game.score += 40;
    }
    if (actor.comboChain >= 4 && !actor.prismBurstTriggered) {
      actor.prismBurstTriggered = true;
      actor.block += 8;
      applyDamage(actor === game.player ? game.enemy : game.player, 8);
      game.score += 20;
      log(`${actor.name} 프리즘 버스트 발동`);
    }
  };

  const applyEffect = (source, target, effect, card) => {
    if (effect.kind === 'ifLastTurnFamily') {
      if (source.lastTurnFamilies.has(effect.family)) effect.then.forEach((e) => applyEffect(source, target, e, card));
      return;
    }
    if (effect.kind === 'ifEnemyIntent') {
      if (target.intentType === effect.intent) effect.then.forEach((e) => applyEffect(source, target, e, card));
      return;
    }
    if (effect.kind === 'ifEnemyHpBelow') {
      if (target.hp <= effect.value) effect.then.forEach((e) => applyEffect(source, target, e, card));
      return;
    }

    if (effect.kind === 'attack') {
      let damage = effect.value + source.attackBuff + (source.activeSynergies.Flame ? 3 : 0);
      if (target.vulnerable > 0) damage += 2;
      const dealt = applyDamage(target, damage);
      log(`${source.name} 공격 ${dealt}`);
      source.attackBuff = 0;
    }
    if (effect.kind === 'block') source.block += effect.value + (source.activeSynergies.Leaf ? 3 : 0);
    if (effect.kind === 'draw') draw(source, effect.value + (source.activeSynergies.Gear ? 1 : 0));
    if (effect.kind === 'heal') source.hp = clamp(source.hp + effect.value, 0, source.maxHp);
    if (effect.kind === 'gainEnergy') source.energy += effect.value;
    if (effect.kind === 'buffAttack') source.attackBuff += effect.value;
    if (effect.kind === 'reduceBlock') target.block = Math.max(0, target.block - effect.value);
    if (effect.kind === 'vulnerable') target.vulnerable += effect.value;
    if (effect.kind === 'drain') source.hp = clamp(source.hp + effect.value, 0, source.maxHp);
    if (effect.kind === 'thorns') source.thorns += effect.value;
    if (effect.kind === 'selfDamage') applyDamage(source, effect.value);
    if (effect.kind === 'echoAttack' && source.turnFamilyCounts[card.family] > 1) applyDamage(target, effect.value);
    if (effect.kind === 'swapIntent') {
      target.intentType = target.intentType === 'attack' ? 'skill' : 'attack';
      target.intent = target.intentType === 'attack' ? '공격 준비' : '방어 준비';
    }
    if (effect.kind === 'convertBlockToDamage') {
      const burst = source.block;
      source.block = 0;
      if (burst > 0) {
        applyDamage(target, burst);
        log(`${source.name} 방어 전환 ${burst} 피해`);
      }
    }
    if (effect.kind === 'discover') {
      const pool = shuffle(Object.keys(CARD_LIBRARY).filter((id) => id !== card.id)).slice(0, effect.value || 3);
      game.discoverChoices = pool.map(cloneCard);
      game.state = STATES.PLANNING;
      log('아카이브 스캔: 도감에서 임시 카드 선택');
    }
  };

  const chooseEnemyCard = () => {
    const options = game.enemy.hand.filter((c) => c.energyCost <= game.enemy.energy);
    if (!options.length) return null;
    options.sort((a, b) => b.baseValue - a.baseValue);
    const best = options[0];
    game.enemy.intentType = best.type === 'attack' ? 'attack' : 'skill';
    game.enemy.intent = best.type === 'attack' ? `${best.name} (공격)` : `${best.name} (스킬)`;
    return best;
  };

  const setupRound = () => {
    const regionIndex = Math.floor(game.round / 2);
    const region = REGIONS[Math.min(regionIndex, REGIONS.length - 1)];
    const enemyId = region.enemies[game.round % 2];
    const enemyInfo = ENEMY_ARCHETYPES[enemyId];
    game.region = region.name;
    game.enemy = createActor({ name: enemyInfo.name, hp: enemyInfo.hp, deckIds: enemyInfo.deck });
    game.rewardAccepted = false;
    game.removedInDeckBuild = false;
    beginTurn(game.player, true);
    beginTurn(game.enemy, false);
    game.state = STATES.PLANNING;
    chooseEnemyCard();
    game.state = STATES.PLAYER_TURN;
    game.activeSide = 'player';
    onRender();
  };

  const startRun = () => {
    game.round = 0;
    game.score = 0;
    game.deck = [...STARTER_DECK];
    game.player = createActor({ name: '플레이어', hp: 72, deckIds: game.deck });
    game.discoverChoices = [];
    setupRound();
    log('런 시작');
    onRender();
  };

  const resolveState = () => {
    const playerDead = game.player.hp <= 0;
    const enemyDead = game.enemy.hp <= 0;
    if (playerDead || enemyDead) {
      if (playerDead && enemyDead) game.score = 0;
      if (playerDead) {
        game.state = STATES.GAME_OVER;
        log('패배', 'bad');
        onRender();
        return;
      }
      game.score += 100;
      if (game.player.hp >= 40) game.score += 30;
      game.round += 1;
      game.player.lastTurnFamilies = new Set(game.player.turnFamiliesUsed);
      if (game.round >= game.totalRounds) {
        game.state = STATES.RUN_COMPLETE;
        game.score += 200;
      } else {
        game.state = STATES.DECK_BUILD;
        const pool = shuffle(Object.keys(CARD_LIBRARY)).slice(0, 3);
        game.rewardChoices = pool.map(cloneCard);
        game.rewardAccepted = false;
      }
      onRender();
      return;
    }
    game.state = STATES.PLANNING;
    game.activeSide = 'enemy';
    chooseEnemyCard();
    game.state = STATES.ENEMY_TURN;
    enemyTurn();
  };

  const playCardAt = (idx) => {
    if (game.state !== STATES.PLAYER_TURN) return;
    const card = game.player.hand[idx];
    if (!card || card.energyCost > game.player.energy) return;
    game.player.energy -= card.energyCost;
    game.player.hand.splice(idx, 1);
    game.player.discardPile.push(card.id);
    scoreAction(card);
    if (game.player.turnFamiliesUsed.size >= 2 && !game.player.momentumTriggered && game.player.hand.length <= 2) {
      game.player.energy += 1;
      game.player.momentumTriggered = true;
    }
    updateSynergy(game.player, card);
    card.effect.forEach((effect) => applyEffect(game.player, game.enemy, effect, card));
    onRender();
    if (game.enemy.hp <= 0) {
      game.state = STATES.RESOLUTION;
      resolveState();
    }
  };

  const selectDiscoverCard = (cardId) => {
    if (!game.discoverChoices.length) return;
    game.player.hand.push(cloneCard(cardId));
    game.discoverChoices = [];
    if (game.state === STATES.PLANNING) game.state = STATES.PLAYER_TURN;
    log(`아카이브 스캔으로 ${CARD_LIBRARY[cardId].name} 확보`);
    onRender();
  };

  const enemyTurn = () => {
    if (game.state !== STATES.ENEMY_TURN) return;
    const card = chooseEnemyCard();
    if (!card) {
      game.state = STATES.PLAYER_TURN;
      game.activeSide = 'player';
      beginTurn(game.player, true);
      onRender();
      return;
    }
    const idx = game.enemy.hand.findIndex((c) => c.id === card.id);
    game.enemy.energy -= card.energyCost;
    game.enemy.hand.splice(idx, 1);
    game.enemy.discardPile.push(card.id);
    updateSynergy(game.enemy, card);
    card.effect.forEach((effect) => applyEffect(game.enemy, game.player, effect, card));
    game.enemy.lastTurnFamilies = new Set(game.enemy.turnFamiliesUsed);
    game.state = STATES.RESOLUTION;
    onRender();
    resolveState();
    if ([STATES.ENEMY_TURN, STATES.PLAYER_TURN, STATES.RESOLUTION, STATES.GAME_OVER, STATES.RUN_COMPLETE, STATES.DECK_BUILD].includes(game.state)) return;
    beginTurn(game.player, true);
    game.state = STATES.PLAYER_TURN;
    game.activeSide = 'player';
    onRender();
  };

  const endPlayerTurn = () => {
    if (game.state !== STATES.PLAYER_TURN) return;
    game.player.lastTurnFamilies = new Set(game.player.turnFamiliesUsed);
    game.state = STATES.PLANNING;
    game.activeSide = 'enemy';
    chooseEnemyCard();
    game.state = STATES.ENEMY_TURN;
    enemyTurn();
  };

  const chooseReward = (cardId) => {
    if (game.state !== STATES.DECK_BUILD || game.rewardAccepted) return;
    game.deck.push(cardId);
    game.player.drawPile.push(cardId);
    game.rewardAccepted = true;
    log(`덱 강화: ${CARD_LIBRARY[cardId].name}`);
    onRender();
  };

  const skipReward = () => {
    if (game.state !== STATES.DECK_BUILD || game.rewardAccepted) return;
    game.rewardAccepted = true;
    log('보상 카드를 건너뛰었습니다.');
    onRender();
  };

  const removeDeckCard = (cardId) => {
    if (game.state !== STATES.DECK_BUILD || game.removedInDeckBuild) return;
    if (game.deck.length <= 5) {
      log('덱이 너무 얇아 더 이상 제거할 수 없습니다.', 'bad');
      return;
    }
    removeCardEverywhere(cardId);
    game.removedInDeckBuild = true;
    game.score += 6;
    log(`덱 정리: ${CARD_LIBRARY[cardId].name} 제거`);
    onRender();
  };

  const finishDeckBuild = () => {
    if (game.state !== STATES.DECK_BUILD || !game.rewardAccepted) return;
    setupRound();
  };

  return {
    startRun,
    endPlayerTurn,
    playCardAt,
    chooseReward,
    skipReward,
    removeDeckCard,
    finishDeckBuild,
    selectDiscoverCard,
    cloneCard,
    log
  };
}
