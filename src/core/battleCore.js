import { CARD_LIBRARY, STARTER_DECK, REGIONS, ROUTE_TABLE, ROUTE_MODIFIERS, ENEMY_ARCHETYPES } from '../data.js';
import { STATES, SIGILS, MAX_ENERGY, MAX_HAND } from '../constants.js';
import { clamp, shuffle } from '../utils.js';
import { saveRunSnapshot, loadRunSnapshot, clearRunSnapshot, addHallOfFameRecord, hasSavedRun } from '../storage.js';

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
    sigilBurstTriggered: { Flame: false, Leaf: false, Gear: false, Void: false },
    intent: '준비', intentType: 'skill', intentDamage: null, lastPlayedCardId: null,
    archetypeId: null,
    threatLevel: 1,
    extraEnergyPerTurn: 0,
    extraDrawPerTurn: 0
  };
}

export function createGame() {
  return {
    state: STATES.READY, round: 0, totalRounds: 10, activeSide: 'player',
    region: '-', score: 0, deck: [...STARTER_DECK], rewardChoices: [],
    removeChoices: [], rewardAccepted: false, removedInDeckBuild: false, discoverChoices: [],
    routeChoices: [], currentRoute: null,
    playedCardsHistory: [],
    logs: ['대기 중: 런 시작 버튼을 누르세요.'],
    player: createActor({ name: '플레이어', hp: 78, deckIds: STARTER_DECK }),
    enemy: null
  };
}

export function createEngine(game, hooks) {
  const { onRender } = hooks;
  const log = (msg, type = 'normal') => {
    game.logs.unshift(`[${new Date().toLocaleTimeString('ko-KR')}] ${msg}::${type}`);
    game.logs = game.logs.slice(0, 48);
  };


  const toRecord = (result) => ({
    id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    result,
    score: game.score,
    round: game.round,
    totalRounds: game.totalRounds,
    finalRegion: game.region,
    finalEnemy: game.enemy?.name || '-',
    topCards: [...new Set(game.playedCardsHistory.map((c) => c.name))].slice(0, 5),
    playedCount: game.playedCardsHistory.length,
    createdAt: new Date().toISOString()
  });

  const persistGame = () => {
    if ([STATES.READY, STATES.GAME_OVER, STATES.RUN_COMPLETE].includes(game.state)) {
      clearRunSnapshot();
      return;
    }
    saveRunSnapshot(game);
  };

  const hydrateActor = (actor) => ({
    ...actor,
    turnFamiliesUsed: actor.turnFamiliesUsed instanceof Set ? actor.turnFamiliesUsed : new Set(actor.turnFamiliesUsed || []),
    lastTurnFamilies: actor.lastTurnFamilies instanceof Set ? actor.lastTurnFamilies : new Set(actor.lastTurnFamilies || [])
  });

  const renderAndPersist = () => {
    onRender();
    persistGame();
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

  const scoreAction = (card) => { game.score += card.type === 'attack' ? 9 : 7; };

  const getRouteCandidates = () => {
    const routeRegionIds = ROUTE_TABLE[Math.min(game.round, ROUTE_TABLE.length - 1)] || [];
    return routeRegionIds.map((regionId, idx) => {
      const region = REGIONS.find((r) => r.id === regionId) || REGIONS[0];
      const enemyId = region.enemies[(game.round + idx) % region.enemies.length];
      const modifier = ROUTE_MODIFIERS[(game.round + idx) % ROUTE_MODIFIERS.length];
      return { regionId: region.id, enemyId, modifier };
    });
  };

  const applyRouteModifier = (route) => {
    if (!route?.modifier) return;
    if (route.modifier.enemyHpDelta) {
      game.enemy.maxHp = Math.max(20, game.enemy.maxHp + route.modifier.enemyHpDelta);
      game.enemy.hp = Math.min(game.enemy.hp, game.enemy.maxHp);
    }
    if (route.modifier.enemyBlock) game.enemy.block += route.modifier.enemyBlock;
    if (route.modifier.bonusDraw) draw(game.player, route.modifier.bonusDraw);
    if (route.modifier.bonusBlock) game.player.block += route.modifier.bonusBlock;
    log(`경로 효과: ${route.modifier.name} - ${route.modifier.detail}`);
  };

  const beginTurn = (actor, isPlayer) => {
    if (actor.hand.length > 0) {
      actor.discardPile.push(...actor.hand.map((card) => card.id));
      actor.hand = [];
    }
    actor.block = 0;
    actor.energy = MAX_ENERGY + (isPlayer ? 0 : (actor.extraEnergyPerTurn || 0));
    actor.turnFamilyCounts = {};
    actor.turnFamiliesUsed = new Set();
    actor.comboChain = 0;
    actor.lastSigil = null;
    actor.adrenalineTriggered = false;
    actor.prismBurstTriggered = false;
    actor.momentumTriggered = false;
    actor.sigilCounts = { Flame: 0, Leaf: 0, Gear: 0, Void: 0 };
    actor.activeSynergies = { Flame: false, Leaf: false, Gear: false, Void: false };
    actor.sigilBurstTriggered = { Flame: false, Leaf: false, Gear: false, Void: false };
    actor.turnScoreMultiplier = false;
    actor.thorns = 0;
    actor.vulnerable = Math.max(0, actor.vulnerable - 1);
    draw(actor, 5 + (isPlayer ? 0 : (actor.extraDrawPerTurn || 0)));
    if (isPlayer) log('플레이어 턴 시작');
  };

  const getEnemyScaling = () => {
    const stage = Math.min(3, Math.floor(game.round / 3));
    return {
      threatLevel: 1 + stage,
      extraEnergyPerTurn: stage >= 3 ? 2 : stage,
      extraDrawPerTurn: game.round >= 6 ? 1 : 0,
    };
  };

  const applyDamage = (target, value) => {
    const blocked = Math.min(target.block, value);
    const real = Math.max(0, value - blocked);
    target.block -= blocked;
    target.hp = clamp(target.hp - real, 0, target.maxHp);
    return real;
  };

  const estimateIntentAttack = (source, target, card) => {
    const attackBase = effectListAttack(card.effect, source, target, card);
    if (attackBase === null) return null;
    const buffBonus = source.attackBuff;
    const projectedSigilCount = (source.sigilCounts?.[card.sigil] || 0) + 1;
    const flameBonus = (source.activeSynergies.Flame || (card.sigil === 'Flame' && projectedSigilCount >= 2)) ? 5 : 0;
    const voidBonus = (source.activeSynergies.Void || (card.sigil === 'Void' && projectedSigilCount >= 2)) ? 3 : 0;
    const vulnerableBonus = target.vulnerable > 0 ? 2 : 0;

    const comboChainBonus = source.lastSigil && source.lastSigil !== card.sigil
      ? Math.min(4, source.comboChain + 1)
      : source.comboChain;
    const prismBurstDamage = comboChainBonus >= 3 && !source.prismBurstTriggered ? 8 : 0;
    const sigilBurstDamage = projectedSigilCount >= 4 && !source.sigilBurstTriggered?.[card.sigil]
      ? (card.sigil === 'Flame' ? 12 : card.sigil === 'Void' ? 10 : 0)
      : 0;

    return Math.max(0, attackBase + buffBonus + flameBonus + voidBonus + vulnerableBonus + prismBurstDamage + sigilBurstDamage);
  };

  const effectListAttack = (effects, source, target, card) => {
    let total = 0;
    for (const effect of effects) {
      if (effect.kind === 'attack') total += effect.value;
      if (effect.kind === 'convertBlockToDamage') total += source.block;
      if (effect.kind === 'echoAttack' && (source.turnFamilyCounts?.[card.family] || 0) > 1) total += effect.value;
      if (effect.kind === 'ifEnemyIntent' && target.intentType === effect.intent) {
        const nested = effectListAttack(effect.then || [], source, target, card);
        if (nested === null) return null;
        total += nested;
      }
      if (effect.kind === 'ifEnemyHpBelow' && target.hp <= effect.value) {
        const nested = effectListAttack(effect.then || [], source, target, card);
        if (nested === null) return null;
        total += nested;
      }
      if (effect.kind === 'ifLastTurnFamily' && source.lastTurnFamilies?.has(effect.family)) {
        const nested = effectListAttack(effect.then || [], source, target, card);
        if (nested === null) return null;
        total += nested;
      }
      if (effect.kind === 'gamble' || effect.kind === 'rewind') return null;
    }
    return total;
  };

  const removeCardEverywhere = (cardId, { skipDeck = false } = {}) => {
    const removeOnce = (pile) => {
      const index = pile.findIndex((idOrCard) => (typeof idOrCard === 'string' ? idOrCard : idOrCard.id) === cardId);
      if (index >= 0) pile.splice(index, 1);
    };
    if (!skipDeck) removeOnce(game.deck);
    removeOnce(game.player.drawPile);
    removeOnce(game.player.discardPile);
    removeOnce(game.player.hand);
  };


  const createRandomRewardChoices = () => {
    const pool = shuffle(Object.keys(CARD_LIBRARY));
    return pool.slice(0, 3).map(cloneCard);
  };

  const createRandomRemovalChoices = () => {
    if (game.deck.length <= 5) return [];
    const indexed = game.deck.map((id, deckIndex) => ({ id, deckIndex }));
    return shuffle(indexed).slice(0, Math.min(3, indexed.length));
  };

  const removeDeckCardByIndex = (deckIndex) => {
    const cardId = game.deck[deckIndex];
    if (!cardId) return null;
    game.deck.splice(deckIndex, 1);
    removeCardEverywhere(cardId, { skipDeck: true });
    return cardId;
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
      game.score += 8;
      actor.adrenalineTriggered = true;
      log(`${actor.name} 아드레날린 발동`);
    }
    if (new Set(SIGILS.filter((s) => actor.sigilCounts[s] > 0)).size === 4) {
      actor.turnScoreMultiplier = true;
      game.score += 24;
    }
    if (actor.comboChain >= 3 && !actor.prismBurstTriggered) {
      actor.prismBurstTriggered = true;
      actor.block += 6;
      applyDamage(actor === game.player ? game.enemy : game.player, 8);
      game.score += 12;
      log(`${actor.name} 프리즘 버스트 발동`);
    }

    if (actor.sigilCounts[card.sigil] >= 4 && !actor.sigilBurstTriggered[card.sigil]) {
      actor.sigilBurstTriggered[card.sigil] = true;
      if (card.sigil === 'Flame') {
        applyDamage(actor === game.player ? game.enemy : game.player, 12);
        log(`${actor.name} 화염 폭주: 추가 피해 12`);
      }
      if (card.sigil === 'Leaf') {
        actor.block += 14;
        actor.hp = clamp(actor.hp + 6, 0, actor.maxHp);
        log(`${actor.name} 리프 개화: 방어 14 + 회복 6`);
      }
      if (card.sigil === 'Gear') {
        actor.energy += 1;
        draw(actor, 2);
        log(`${actor.name} 기어 과충전: 에너지 1 + 드로우 2`);
      }
      if (card.sigil === 'Void') {
        applyDamage(actor === game.player ? game.enemy : game.player, 10);
        const rival = actor === game.player ? game.enemy : game.player;
        rival.vulnerable += 1;
        log(`${actor.name} 공허 붕괴: 피해 10 + 취약 1`);
      }
      game.score += 15;
    }
  };

  const applyEffect = (source, target, effect, card, context = { fromRewind: false }) => {
    if (effect.kind === 'ifLastTurnFamily') {
      if (source.lastTurnFamilies.has(effect.family)) effect.then.forEach((e) => applyEffect(source, target, e, card, context));
      return;
    }
    if (effect.kind === 'ifEnemyIntent') {
      if (target.intentType === effect.intent) effect.then.forEach((e) => applyEffect(source, target, e, card, context));
      return;
    }
    if (effect.kind === 'ifEnemyHpBelow') {
      if (target.hp <= effect.value) effect.then.forEach((e) => applyEffect(source, target, e, card, context));
      return;
    }

    if (effect.kind === 'attack') {
      const buffBonus = source.attackBuff;
      const flameBonus = source.activeSynergies.Flame ? 5 : 0;
      const voidBonus = source.activeSynergies.Void ? 3 : 0;
      const vulnerableBonus = target.vulnerable > 0 ? 2 : 0;
      const damage = effect.value + buffBonus + flameBonus + voidBonus + vulnerableBonus;
      const dealt = applyDamage(target, damage);
      const formula = [
        `기본 ${effect.value}`,
        buffBonus ? `강화 +${buffBonus}` : null,
        flameBonus ? `화염시너지 +${flameBonus}` : null,
        voidBonus ? `공허시너지 +${voidBonus}` : null,
        vulnerableBonus ? `취약 +${vulnerableBonus}` : null
      ].filter(Boolean).join(', ');
      log(`${source.name} 공격 ${dealt} (계산: ${formula})`);
      if (source.activeSynergies.Void) source.hp = clamp(source.hp + 1, 0, source.maxHp);
      source.attackBuff = 0;
    }
    if (effect.kind === 'block') source.block += effect.value + (source.activeSynergies.Leaf ? 7 : 0);
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

    if (effect.kind === 'rewind') {
      if (context.fromRewind) return;
      if (!source.lastPlayedCardId) {
        log(`${source.name} 되감기 실패: 직전 카드 없음`, 'bad');
        return;
      }
      const replay = cloneCard(source.lastPlayedCardId);
      replay.effect.forEach((nested) => applyEffect(source, target, nested, replay, { fromRewind: true }));
      log(`${source.name} 되감기: ${replay.name} 효과 재발동`);
    }
    if (effect.kind === 'gamble') {
      const dominantSigil = SIGILS.reduce((best, sigil) => (source.sigilCounts[sigil] > source.sigilCounts[best] ? sigil : best), 'Flame');
      let roll = shuffle(['attack', 'block', 'tempo'])[0];
      if (source.activeSynergies[dominantSigil]) {
        if (dominantSigil === 'Flame') roll = 'attack';
        if (dominantSigil === 'Leaf') roll = 'block';
        if (dominantSigil === 'Gear') roll = 'tempo';
        if (dominantSigil === 'Void') roll = 'void';
      }
      if (roll === 'attack') {
        const dealt = applyDamage(target, 16);
        log(`${source.name} 도박 성공: 폭딜 ${dealt}`);
      }
      if (roll === 'block') {
        source.block += 14;
        source.hp = clamp(source.hp + 4, 0, source.maxHp);
        log(`${source.name} 도박 성공: 방어 14 + 회복 4`);
      }
      if (roll === 'tempo') {
        draw(source, 2);
        source.energy += 2;
        log(`${source.name} 도박 성공: 드로우 2 + 에너지 2`);
      }
      if (roll === 'void') {
        const dealt = applyDamage(target, 10);
        target.vulnerable += 1;
        log(`${source.name} 도박 성공: 공허타격 ${dealt} + 취약 1`);
      }
    }

  };

  const chooseEnemyCard = () => {
    const options = game.enemy.hand.filter((c) => c.energyCost <= game.enemy.energy);
    if (!options.length) {
      game.enemy.intent = '행동 불가';
      game.enemy.intentType = 'skill';
      game.enemy.intentDamage = 0;
      return null;
    }

    const preferType = game.enemy.intentType === 'attack' ? 'skill' : 'attack';
    const typedOptions = options.filter((c) => c.type === preferType);
    const typePool = typedOptions.length ? typedOptions : options;

    const nonRepeatPool = typePool.filter((c) => c.id !== game.enemy.lastPlayedCardId);
    const finalPool = nonRepeatPool.length ? nonRepeatPool : typePool;

    finalPool.sort((a, b) => b.baseValue - a.baseValue);
    const best = finalPool[0];
    game.enemy.intentType = best.type === 'attack' ? 'attack' : 'skill';
    const expectedDamage = estimateIntentAttack(game.enemy, game.player, best);
    game.enemy.intentDamage = expectedDamage;
    if (best.type === 'attack') {
      game.enemy.intent = expectedDamage === null
        ? `${best.name} (공격 · 피해 계산 불가)`
        : `${best.name} (공격 · 예상 피해 ${expectedDamage})`;
    } else {
      game.enemy.intent = expectedDamage && expectedDamage > 0
        ? `${best.name} (스킬 · 부가 피해 ${expectedDamage})`
        : `${best.name} (스킬)`;
    }
    return best;
  };

  const setupRound = () => {
    const route = game.currentRoute || getRouteCandidates()[0];
    const region = REGIONS.find((r) => r.id === route.regionId) || REGIONS[0];
    const enemyInfo = ENEMY_ARCHETYPES[route.enemyId];
    const scaling = getEnemyScaling();
    game.region = region.name;
    game.enemy = createActor({ name: enemyInfo.name, hp: enemyInfo.hp, deckIds: enemyInfo.deck });
    game.enemy.archetypeId = enemyInfo.id;
    game.enemy.threatLevel = scaling.threatLevel;
    game.enemy.extraEnergyPerTurn = scaling.extraEnergyPerTurn;
    game.enemy.extraDrawPerTurn = scaling.extraDrawPerTurn;
    game.rewardAccepted = false;
    game.removedInDeckBuild = false;
    beginTurn(game.player, true);
    beginTurn(game.enemy, false);
    applyRouteModifier(route);
    game.state = STATES.PLANNING;
    chooseEnemyCard();
    log(`난이도 단계 ${game.enemy.threatLevel}: 적 에너지 +${game.enemy.extraEnergyPerTurn}, 행동 규칙=에너지 소진형`);
    game.state = STATES.PLAYER_TURN;
    game.activeSide = 'player';
    renderAndPersist();
  };

  const startRun = () => {
    game.round = 0;
    game.score = 0;
    game.deck = [...STARTER_DECK];
    game.player = createActor({ name: '플레이어', hp: 78, deckIds: game.deck });
    game.enemy = null;
    game.rewardChoices = [];
    game.removeChoices = [];
    game.rewardAccepted = false;
    game.removedInDeckBuild = false;
    game.discoverChoices = [];
    game.playedCardsHistory = [];
    game.routeChoices = getRouteCandidates();
    game.currentRoute = game.routeChoices[0];
    setupRound();
    log('런 시작');
    renderAndPersist();
  };

  const resolveRoundEnd = () => {
    const playerDead = game.player.hp <= 0;
    const enemyDead = game.enemy.hp <= 0;
    if (playerDead || enemyDead) {
      if (playerDead && enemyDead) game.score = 0;
      if (playerDead) {
        game.state = STATES.GAME_OVER;
        addHallOfFameRecord(toRecord('패배'));
        clearRunSnapshot();
        log('패배', 'bad');
        renderAndPersist();
        return;
      }
      game.score += 110;
      if (game.player.hp >= 36) game.score += 25;
      game.round += 1;
      game.player.lastTurnFamilies = new Set(game.player.turnFamiliesUsed);
      if (game.round >= game.totalRounds) {
        game.state = STATES.RUN_COMPLETE;
        game.score += 200;
        addHallOfFameRecord(toRecord('승리'));
        clearRunSnapshot();
      } else {
        game.state = STATES.DECK_BUILD;
        game.rewardChoices = createRandomRewardChoices();
        game.removeChoices = createRandomRemovalChoices();
        game.rewardAccepted = false;
        game.routeChoices = getRouteCandidates();
      }
      renderAndPersist();
      return;
    }

    game.state = STATES.PLANNING;
    game.activeSide = 'player';
    chooseEnemyCard();
    beginTurn(game.player, true);
    game.state = STATES.PLAYER_TURN;
    renderAndPersist();
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
    game.playedCardsHistory.unshift({ id: card.id, name: card.name });
    game.playedCardsHistory = game.playedCardsHistory.slice(0, 12);
    game.player.lastPlayedCardId = card.id;
    renderAndPersist();
    if (game.enemy.hp <= 0 || game.player.hp <= 0) {
      game.state = STATES.RESOLUTION;
      resolveRoundEnd();
    }
  };

  const selectDiscoverCard = (cardId) => {
    if (!game.discoverChoices.length) return;
    game.player.hand.push(cloneCard(cardId));
    game.discoverChoices = [];
    if (game.state === STATES.PLANNING) game.state = STATES.PLAYER_TURN;
    log(`아카이브 스캔으로 ${CARD_LIBRARY[cardId].name} 확보`);
    renderAndPersist();
  };

  const enemyTurn = () => {
    if (game.state !== STATES.ENEMY_TURN) return;
    let actionCount = 0;
    const maxActions = 12;

    while (actionCount < maxActions) {
      const card = chooseEnemyCard();
      if (!card) break;

      const idx = game.enemy.hand.findIndex((c) => c.id === card.id);
      if (idx < 0) break;
      game.enemy.energy -= card.energyCost;
      game.enemy.hand.splice(idx, 1);
      game.enemy.discardPile.push(card.id);
      updateSynergy(game.enemy, card);
      card.effect.forEach((effect) => applyEffect(game.enemy, game.player, effect, card));
      game.enemy.lastPlayedCardId = card.id;
      actionCount += 1;
      log(`적 행동 ${actionCount}회: ${card.name} (남은 에너지 ${game.enemy.energy})`);

      if (game.player.hp <= 0 || game.enemy.hp <= 0) break;
    }

    game.enemy.lastTurnFamilies = new Set(game.enemy.turnFamiliesUsed);
    if (actionCount === 0) {
      game.state = STATES.PLAYER_TURN;
      game.activeSide = 'player';
      beginTurn(game.player, true);
      renderAndPersist();
      return;
    }

    game.state = STATES.RESOLUTION;
    renderAndPersist();
    resolveRoundEnd();
  };

  const endPlayerTurn = () => {
    if (game.state !== STATES.PLAYER_TURN) return;
    game.player.lastTurnFamilies = new Set(game.player.turnFamiliesUsed);
    game.state = STATES.PLANNING;
    game.activeSide = 'enemy';
    beginTurn(game.enemy, false);
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
    renderAndPersist();
  };

  const skipReward = () => {
    if (game.state !== STATES.DECK_BUILD || game.rewardAccepted) return;
    game.rewardAccepted = true;
    log('보상 카드를 건너뛰었습니다.');
    renderAndPersist();
  };

  const removeDeckCard = (deckIndex) => {
    if (game.state !== STATES.DECK_BUILD || game.removedInDeckBuild) return;
    if (game.deck.length <= 5) {
      log('덱이 너무 얇아 더 이상 제거할 수 없습니다.', 'bad');
      return;
    }
    const selected = game.removeChoices.find((choice) => choice.deckIndex === deckIndex);
    if (!selected) {
      log('이번 라운드 랜덤 제거 후보에 없는 카드입니다.', 'bad');
      return;
    }
    const removedCardId = removeDeckCardByIndex(deckIndex);
    if (!removedCardId) return;
    game.removedInDeckBuild = true;
    game.removeChoices = [];
    game.score += 6;
    log(`덱 정리: ${CARD_LIBRARY[removedCardId].name} 제거`);
    renderAndPersist();
  };

  const finishDeckBuild = () => {
    if (game.state !== STATES.DECK_BUILD || !game.rewardAccepted) return;
    game.state = STATES.ROUTE_SELECT;
    renderAndPersist();
  };

  const selectRoute = (index) => {
    if (game.state !== STATES.ROUTE_SELECT) return;
    const route = game.routeChoices[index];
    if (!route) return;
    game.currentRoute = route;
    log(`경로 선택: ${REGIONS.find((r) => r.id === route.regionId)?.name || '-'} / ${ENEMY_ARCHETYPES[route.enemyId]?.name || '-'}`);
    setupRound();
  };


  const resumeRun = () => {
    const snapshot = loadRunSnapshot();
    if (!snapshot) {
      log('이어할 저장 데이터가 없습니다.', 'bad');
      renderAndPersist();
      return;
    }
    Object.assign(game, snapshot);
    game.player = hydrateActor(game.player);
    if (game.enemy) game.enemy = hydrateActor(game.enemy);
    log('저장된 런을 이어합니다.');
    renderAndPersist();
  };

  const resetSavedRun = () => {
    clearRunSnapshot();
    Object.assign(game, createGame());
    game.logs.unshift(`[${new Date().toLocaleTimeString('ko-KR')}] 저장된 런을 초기화했습니다.::normal`);
    game.logs = game.logs.slice(0, 48);
    onRender();
  };

  return {
    startRun,
    resumeRun,
    resetSavedRun,
    endPlayerTurn,
    playCardAt,
    chooseReward,
    skipReward,
    removeDeckCard,
    finishDeckBuild,
    selectDiscoverCard,
    selectRoute,
    cloneCard,
    log,
    hasSavedRun
  };
}
