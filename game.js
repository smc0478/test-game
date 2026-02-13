const STATE_READY = "ready";
const STATE_DECK_BUILD = "deckBuild";
const STATE_PLAYER_TURN = "playerTurn";
const STATE_ENEMY_TURN = "enemyTurn";
const STATE_RESOLUTION = "resolution";
const STATE_GAME_OVER = "gameOver";
const STATE_RUN_COMPLETE = "runComplete";

const SIGILS = ["Flame", "Leaf", "Gear", "Void"];

const ui = {
  startBtn: document.querySelector("#start-btn"),
  endTurnBtn: document.querySelector("#end-turn-btn"),
  playerHp: document.querySelector("#player-hp"),
  playerMaxHp: document.querySelector("#player-max-hp"),
  playerBlock: document.querySelector("#player-block"),
  playerEnergy: document.querySelector("#player-energy"),
  enemyName: document.querySelector("#enemy-name"),
  enemyHp: document.querySelector("#enemy-hp"),
  enemyMaxHp: document.querySelector("#enemy-max-hp"),
  enemyBlock: document.querySelector("#enemy-block"),
  enemyEnergy: document.querySelector("#enemy-energy"),
  regionName: document.querySelector("#region-name"),
  roundInfo: document.querySelector("#round-info"),
  battleState: document.querySelector("#battle-state"),
  turnOwner: document.querySelector("#turn-owner"),
  score: document.querySelector("#score"),
  synergyInfo: document.querySelector("#synergy-info"),
  goalText: document.querySelector("#goal-text"),
  hand: document.querySelector("#hand"),
  playerDraw: document.querySelector("#player-draw"),
  playerDiscard: document.querySelector("#player-discard"),
  deckSize: document.querySelector("#deck-size"),
  rewardPanel: document.querySelector("#reward-panel"),
  rewardCards: document.querySelector("#reward-cards"),
  log: document.querySelector("#log")
};

const REGIONS = [
  { name: "잿빛 협곡", enemies: ["emberFox", "ironShell"] },
  { name: "기계 정원", enemies: ["gearSentinel", "thornDruid"] },
  { name: "공허 성채", enemies: ["voidReaper", "prismOverlord"] }
];

const ENEMY_ARCHETYPES = {
  emberFox: { id: "emberFox", name: "잿불 여우", hp: 60, deck: ["C001", "C002", "C014", "C021", "C017"] },
  ironShell: { id: "ironShell", name: "철갑 딱정벌레", hp: 72, deck: ["C006", "C007", "C015", "C016", "C022"] },
  gearSentinel: { id: "gearSentinel", name: "기어 센티넬", hp: 76, deck: ["C004", "C008", "C015", "C017", "C022"] },
  thornDruid: { id: "thornDruid", name: "가시 드루이드", hp: 80, deck: ["C003", "C006", "C011", "C013", "C024"] },
  voidReaper: { id: "voidReaper", name: "공허 수확자", hp: 88, deck: ["C005", "C010", "C012", "C018", "C023"] },
  prismOverlord: { id: "prismOverlord", name: "프리즘 군주", hp: 102, deck: ["C001", "C011", "C012", "C021", "C023"] }
};

function makeCardArt(name, sigil) {
  const color = { Flame: "#f97316", Leaf: "#22c55e", Gear: "#38bdf8", Void: "#a855f7" }[sigil] || "#64748b";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 170'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='${color}'/><stop offset='1' stop-color='#0f172a'/></linearGradient></defs><rect width='300' height='170' fill='url(#g)'/><text x='20' y='85' font-size='22' fill='white' font-family='sans-serif'>${name}</text><text x='20' y='125' font-size='18' fill='white' font-family='sans-serif'>${sigil}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const CARD_LIBRARY = {
  C001: { id: "C001", name: "엠버 스트라이크", family: "emberStrike", type: "attack", energyCost: 1, baseValue: 7, sigil: "Flame", effect: [{ kind: "attack", value: 7 }] },
  C002: { id: "C002", name: "블레이즈 러시", family: "emberStrike", type: "attack", energyCost: 1, baseValue: 8, sigil: "Flame", effect: [{ kind: "attack", value: 8 }] },
  C003: { id: "C003", name: "쏜 잽", family: "thorn", type: "attack", energyCost: 1, baseValue: 6, sigil: "Leaf", effect: [{ kind: "attack", value: 6 }] },
  C004: { id: "C004", name: "코그 샷", family: "cog", type: "attack", energyCost: 1, baseValue: 6, sigil: "Gear", effect: [{ kind: "attack", value: 6 }] },
  C005: { id: "C005", name: "널 피어스", family: "voidMark", type: "attack", energyCost: 1, baseValue: 6, sigil: "Void", effect: [{ kind: "attack", value: 6 }, { kind: "drain", value: 2 }] },
  C006: { id: "C006", name: "바크 가드", family: "bark", type: "skill", energyCost: 1, baseValue: 8, sigil: "Leaf", effect: [{ kind: "block", value: 8 }] },
  C007: { id: "C007", name: "클락워크 가드", family: "clockwork", type: "skill", energyCost: 1, baseValue: 7, sigil: "Gear", effect: [{ kind: "block", value: 7 }, { kind: "draw", value: 1 }] },
  C008: { id: "C008", name: "스파크 사이클", family: "clockwork", type: "skill", energyCost: 1, baseValue: 0, sigil: "Gear", effect: [{ kind: "draw", value: 2 }] },
  C009: { id: "C009", name: "애쉬 포커스", family: "emberRitual", type: "skill", energyCost: 1, baseValue: 0, sigil: "Flame", effect: [{ kind: "buffAttack", value: 4 }] },
  C010: { id: "C010", name: "보이드 에코", family: "voidMark", type: "skill", energyCost: 1, baseValue: 0, sigil: "Void", effect: [{ kind: "reduceBlock", value: 4 }] },
  C011: { id: "C011", name: "버던트 펄스", family: "bark", type: "skill", energyCost: 2, baseValue: 12, sigil: "Leaf", effect: [{ kind: "block", value: 12 }, { kind: "heal", value: 3 }] },
  C012: { id: "C012", name: "어비스 컷", family: "voidBlade", type: "attack", energyCost: 2, baseValue: 12, sigil: "Void", effect: [{ kind: "attack", value: 12 }] },
  C013: { id: "C013", name: "숲의 의식", family: "thorn", type: "skill", energyCost: 1, baseValue: 0, sigil: "Leaf", effect: [{ kind: "heal", value: 5 }] },
  C014: { id: "C014", name: "화염 연계", family: "emberStrike", type: "attack", energyCost: 1, baseValue: 5, sigil: "Flame", effect: [{ kind: "attack", value: 5 }, { kind: "draw", value: 1 }] },
  C015: { id: "C015", name: "기어 오버클럭", family: "clockwork", type: "skill", energyCost: 1, baseValue: 0, sigil: "Gear", effect: [{ kind: "gainEnergy", value: 1 }, { kind: "draw", value: 1 }] },
  C016: { id: "C016", name: "가시 방패", family: "thorn", type: "skill", energyCost: 1, baseValue: 6, sigil: "Leaf", effect: [{ kind: "block", value: 6 }, { kind: "thorns", value: 3 }] },
  C017: { id: "C017", name: "용광로 분출", family: "emberRitual", type: "attack", energyCost: 2, baseValue: 11, sigil: "Flame", effect: [{ kind: "attack", value: 11 }, { kind: "vulnerable", value: 1 }] },
  C018: { id: "C018", name: "프리즘 스텝", family: "voidBlade", type: "skill", energyCost: 1, baseValue: 0, sigil: "Void", effect: [{ kind: "draw", value: 1 }, { kind: "gainEnergy", value: 1 }] },
  C019: { id: "C019", name: "아크 플레어", family: "cog", type: "attack", energyCost: 1, baseValue: 9, sigil: "Gear", effect: [{ kind: "attack", value: 9 }] },
  C020: { id: "C020", name: "공허 격자", family: "voidMark", type: "attack", energyCost: 2, baseValue: 10, sigil: "Void", effect: [{ kind: "attack", value: 10 }, { kind: "block", value: 8 }] },
  C021: { id: "C021", name: "혈화 강타", family: "bloodflame", type: "attack", energyCost: 2, baseValue: 14, sigil: "Flame", effect: [{ kind: "selfDamage", value: 3 }, { kind: "attack", value: 14 }] },
  C022: { id: "C022", name: "연쇄 톱니", family: "chainGear", type: "attack", energyCost: 1, baseValue: 5, sigil: "Gear", effect: [{ kind: "attack", value: 5 }, { kind: "echoAttack", value: 6 }] },
  C023: { id: "C023", name: "회귀 낙인", family: "voidMark", type: "skill", energyCost: 1, baseValue: 0, sigil: "Void", effect: [{ kind: "vulnerable", value: 1 }, { kind: "ifLastTurnFamily", family: "voidMark", then: [{ kind: "draw", value: 2 }, { kind: "gainEnergy", value: 1 }] }] },
  C024: { id: "C024", name: "재생 방진", family: "bark", type: "skill", energyCost: 1, baseValue: 6, sigil: "Leaf", effect: [{ kind: "block", value: 6 }, { kind: "ifLastTurnFamily", family: "bark", then: [{ kind: "heal", value: 4 }] }] }
};

Object.values(CARD_LIBRARY).forEach((card) => {
  card.image = makeCardArt(card.name, card.sigil);
});

const STARTER_DECK = ["C001", "C003", "C004", "C005", "C006", "C007", "C008", "C009", "C010", "C011", "C014", "C015"];

const game = {
  state: STATE_READY,
  score: 0,
  round: 0,
  totalRounds: REGIONS.reduce((acc, region) => acc + region.enemies.length, 0),
  deck: [],
  rewardChoices: [],
  activeSide: "player",
  player: null,
  enemy: null
};

function cloneCard(id) {
  return JSON.parse(JSON.stringify(CARD_LIBRARY[id]));
}

function createFighter(name, maxHp, deckIds) {
  return {
    name,
    maxHp,
    hp: maxHp,
    block: 0,
    energy: 0,
    drawPile: shuffle(deckIds.map(cloneCard)),
    hand: [],
    discardPile: [],
    deckIds: [...deckIds],
    nextAttackBonus: 0,
    thorns: 0,
    vulnerable: 0,
    turnPlayed: 0,
    sigilCounts: Object.fromEntries(SIGILS.map((sigil) => [sigil, 0])),
    activeSynergies: Object.fromEntries(SIGILS.map((sigil) => [sigil, false])),
    activatedSynergySet: new Set(),
    turnScoreMultiplier: false,
    comboChain: 0,
    lastSigil: null,
    prismBurstTriggered: false,
    adrenalineTriggered: false,
    momentumTriggered: false,
    turnFamilyCounts: {},
    turnFamiliesUsed: new Set(),
    lastTurnFamilies: new Set()
  };
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function log(message, tone = "normal") {
  const el = document.createElement("div");
  el.className = `log-line ${tone === "normal" ? "" : tone}`;
  el.textContent = message;
  ui.log.prepend(el);
}

function drawCards(actor, count) {
  for (let i = 0; i < count; i += 1) {
    if (actor.hand.length >= 8) {
      if (actor.drawPile.length === 0 && actor.discardPile.length > 0) actor.drawPile = shuffle(actor.discardPile.splice(0));
      const burned = actor.drawPile.shift();
      if (burned) actor.discardPile.push(burned);
      continue;
    }
    if (actor.drawPile.length === 0) {
      if (actor.discardPile.length === 0) break;
      actor.drawPile = shuffle(actor.discardPile.splice(0));
    }
    const card = actor.drawPile.shift();
    if (card) actor.hand.push(card);
  }
}

function resetTurnState(actor) {
  actor.block = 0;
  actor.energy = 3;
  actor.turnPlayed = 0;
  actor.sigilCounts = Object.fromEntries(SIGILS.map((sigil) => [sigil, 0]));
  actor.activeSynergies = Object.fromEntries(SIGILS.map((sigil) => [sigil, false]));
  actor.activatedSynergySet = new Set();
  actor.turnScoreMultiplier = false;
  actor.comboChain = 0;
  actor.lastSigil = null;
  actor.prismBurstTriggered = false;
  actor.adrenalineTriggered = false;
  actor.momentumTriggered = false;
  actor.thorns = 0;
  actor.turnFamilyCounts = {};
  actor.turnFamiliesUsed = new Set();
  actor.vulnerable = Math.max(0, actor.vulnerable - 1);
}

function setupRound() {
  const roundIdx = game.round;
  const region = REGIONS.find((r, idx) => roundIdx >= REGIONS.slice(0, idx).reduce((a, b) => a + b.enemies.length, 0) && roundIdx < REGIONS.slice(0, idx + 1).reduce((a, b) => a + b.enemies.length, 0));
  const withinRegion = roundIdx - REGIONS.slice(0, REGIONS.indexOf(region)).reduce((a, b) => a + b.enemies.length, 0);
  const enemyId = region.enemies[withinRegion];
  const enemySpec = ENEMY_ARCHETYPES[enemyId];

  const carryHp = game.prevPlayerHp ?? 72;
  game.player = createFighter("플레이어", 72, game.deck);
  game.player.hp = Math.min(game.player.maxHp, carryHp);
  game.player.lastTurnFamilies = game.prevPlayerFamilies ? new Set(game.prevPlayerFamilies) : new Set();

  game.enemy = createFighter(enemySpec.name, enemySpec.hp, enemySpec.deck);
  game.enemy.id = enemySpec.id;
  game.region = region.name;

  transitionTo(STATE_PLAYER_TURN);
  log(`라운드 ${game.round + 1}: ${region.name} - ${enemySpec.name} 등장!`, "good");
}

function startRun() {
  game.score = 0;
  game.round = 0;
  game.deck = [...STARTER_DECK];
  game.prevPlayerHp = 72;
  game.prevPlayerFamilies = [];
  ui.log.innerHTML = "";
  setupRound();
  render();
}

function transitionTo(next) {
  game.state = next;
  if (next === STATE_PLAYER_TURN) {
    game.activeSide = "player";
    resetTurnState(game.player);
    drawCards(game.player, 5);
  } else if (next === STATE_ENEMY_TURN) {
    game.activeSide = "enemy";
    resetTurnState(game.enemy);
    drawCards(game.enemy, 5);
    window.setTimeout(enemyLoop, 240);
  } else if (next === STATE_RESOLUTION) {
    resolveBattleState();
  } else if (next === STATE_DECK_BUILD) {
    openRewardSelection();
  }
  render();
}

function targetOf(actor) {
  return actor === game.player ? game.enemy : game.player;
}

function applyCardEffect(actor, target, effect, card) {
  if (effect.kind === "attack") {
    let damage = effect.value + actor.nextAttackBonus;
    if (target.vulnerable > 0) damage = Math.floor(damage * 1.5);
    const absorbed = Math.min(target.block, damage);
    target.block -= absorbed;
    target.hp -= Math.max(0, damage - absorbed);
    if (actor.activeSynergies.Flame && card.sigil === "Flame") {
      target.hp -= 3;
      log("Flame 시너지: 추가 피해 +3");
    }
    if (target.thorns > 0) {
      actor.hp -= target.thorns;
      log(`${target.name}의 가시 반격 ${target.thorns}`);
    }
  }

  if (effect.kind === "block") actor.block += effect.value + (actor.activeSynergies.Leaf ? 3 : 0);
  if (effect.kind === "draw") drawCards(actor, effect.value + (actor.activeSynergies.Gear ? 1 : 0));
  if (effect.kind === "buffAttack") actor.nextAttackBonus += effect.value;
  if (effect.kind === "reduceBlock") target.block = Math.max(0, target.block - effect.value);
  if (effect.kind === "heal") actor.hp = Math.min(actor.maxHp, actor.hp + effect.value);
  if (effect.kind === "gainEnergy") actor.energy += effect.value;
  if (effect.kind === "thorns") actor.thorns += effect.value;
  if (effect.kind === "vulnerable") target.vulnerable += effect.value;
  if (effect.kind === "drain") actor.hp = Math.min(actor.maxHp, actor.hp + effect.value);
  if (effect.kind === "selfDamage") {
    actor.hp = Math.max(0, actor.hp - effect.value);
    log(`${actor.name}: 반동 피해 ${effect.value}`, "bad");
  }

  if (effect.kind === "echoAttack") {
    if ((actor.turnFamilyCounts[card.family] || 0) >= 2) {
      applyCardEffect(actor, target, { kind: "attack", value: effect.value }, card);
      log(`${card.name}: 동명 카드 공명 발동 (+${effect.value} 공격)`, "good");
    }
  }

  if (effect.kind === "ifLastTurnFamily") {
    if (actor.lastTurnFamilies.has(effect.family)) {
      effect.then.forEach((nested) => applyCardEffect(actor, target, nested, card));
      log(`${card.name}: 전 턴 기억 발동 (${effect.family})`, "good");
    }
  }
}

function updateSynergy(actor, card, isPlayer) {
  actor.sigilCounts[card.sigil] += 1;

  if (actor.lastSigil && actor.lastSigil !== card.sigil) actor.comboChain = Math.min(4, actor.comboChain + 1);
  else actor.comboChain = 1;
  actor.lastSigil = card.sigil;

  if (actor.sigilCounts[card.sigil] >= 2 && !actor.activeSynergies[card.sigil]) {
    actor.activeSynergies[card.sigil] = true;
    actor.activatedSynergySet.add(card.sigil);
    log(`${actor.name}: ${card.sigil} 시너지 활성화`, "good");
  }

  const fullSpectrum = SIGILS.every((sigil) => actor.sigilCounts[sigil] >= 1);
  if (fullSpectrum && !actor.turnScoreMultiplier) {
    actor.turnScoreMultiplier = true;
    if (isPlayer) game.score += 40;
    log(`${actor.name}: 풀 스펙트럼 완성!`, "good");
  }

  if (actor.comboChain === 4 && !actor.prismBurstTriggered) {
    actor.prismBurstTriggered = true;
    targetOf(actor).hp -= 8;
    actor.block += 8;
    if (isPlayer) game.score += 20;
    log(`${actor.name}: 프리즘 버스트 발동`, "good");
  }

  if (actor.activatedSynergySet.size >= 2 && !actor.adrenalineTriggered) {
    actor.adrenalineTriggered = true;
    actor.energy += 1;
    drawCards(actor, 1);
    if (isPlayer) game.score += 12;
    log(`${actor.name}: 아드레날린 발동 (+1 에너지, 1드로우)`, "good");
  }
}

function resolveCard(actor, target, cardIndex) {
  const card = actor.hand[cardIndex];
  if (!card || card.energyCost > actor.energy) return false;

  actor.energy -= card.energyCost;
  actor.turnPlayed += 1;
  actor.turnFamilyCounts[card.family] = (actor.turnFamilyCounts[card.family] || 0) + 1;
  actor.turnFamiliesUsed.add(card.family);

  updateSynergy(actor, card, actor === game.player);
  card.effect.forEach((effect) => applyCardEffect(actor, target, effect, card));

  if (actor.turnPlayed >= 3 && !actor.momentumTriggered) {
    actor.momentumTriggered = true;
    actor.energy += 1;
    log(`${actor.name}: 모멘텀 발동 (+1 에너지)`);
  }

  if (actor === game.player) {
    let gain = card.type === "attack" ? 10 : 8;
    if (actor.comboChain === 3) gain += 4;
    if (actor.comboChain >= 4) gain += 8;
    if (actor.turnScoreMultiplier) gain *= 2;
    if (actor.activeSynergies.Void && card.sigil === "Void") gain = Math.floor(gain * 1.5);
    game.score += gain;
  }

  actor.hand.splice(cardIndex, 1);
  actor.discardPile.push(card);

  const targetDead = target.hp <= 0;
  const actorDead = actor.hp <= 0;
  if (targetDead || actorDead) {
    transitionTo(STATE_RESOLUTION);
    return true;
  }

  if (actor.energy <= 0 || actor.hand.every((c) => c.energyCost > actor.energy)) {
    if (actor === game.player) endPlayerTurn();
  }

  render();
  return true;
}

function endPlayerTurn() {
  if (game.state !== STATE_PLAYER_TURN) return;
  game.player.lastTurnFamilies = new Set(game.player.turnFamiliesUsed);
  game.player.discardPile.push(...game.player.hand);
  game.player.hand = [];
  transitionTo(STATE_ENEMY_TURN);
}

function enemyChooseCard() {
  const playable = game.enemy.hand.map((card, index) => ({ card, index })).filter(({ card }) => card.energyCost <= game.enemy.energy);
  if (playable.length === 0) return null;
  const lethal = playable.find(({ card }) => card.type === "attack" && card.baseValue + game.enemy.nextAttackBonus >= game.player.hp + game.player.block);
  if (lethal) return lethal.index;
  const skillIfLow = playable.find(({ card }) => card.type === "skill" && game.enemy.hp <= 30);
  if (skillIfLow) return skillIfLow.index;
  return playable.sort((a, b) => b.card.baseValue - a.card.baseValue)[0].index;
}

function enemyLoop() {
  while (game.state === STATE_ENEMY_TURN) {
    const pick = enemyChooseCard();
    if (pick === null || pick === undefined) break;
    resolveCard(game.enemy, game.player, pick);
    if (game.state !== STATE_ENEMY_TURN) return;
    if (game.enemy.energy <= 0 || game.enemy.hand.every((c) => c.energyCost > game.enemy.energy)) break;
  }
  game.enemy.lastTurnFamilies = new Set(game.enemy.turnFamiliesUsed);
  game.enemy.discardPile.push(...game.enemy.hand);
  game.enemy.hand = [];
  transitionTo(STATE_RESOLUTION);
}

function openRewardSelection() {
  const pool = Object.keys(CARD_LIBRARY).filter((id) => !game.deck.includes(id) || Math.random() > 0.5);
  game.rewardChoices = shuffle(pool).slice(0, 3).map(cloneCard);
  ui.rewardPanel.classList.remove("hidden");
  renderRewards();
}

function chooseReward(cardId) {
  game.deck.push(cardId);
  log(`덱 강화: ${CARD_LIBRARY[cardId].name} 추가`, "good");
  ui.rewardPanel.classList.add("hidden");
  if (game.round >= game.totalRounds) {
    game.state = STATE_RUN_COMPLETE;
    game.score += 200;
    log("모든 지역 돌파 성공! 런 클리어", "good");
    render();
    return;
  }
  setupRound();
}

function resolveBattleState() {
  const playerDead = game.player.hp <= 0;
  const enemyDead = game.enemy.hp <= 0;

  if (playerDead && enemyDead) {
    game.score = 0;
    game.state = STATE_GAME_OVER;
    log("동시 KO. 런 실패", "bad");
    render();
    return;
  }

  if (playerDead) {
    game.score = 0;
    game.state = STATE_GAME_OVER;
    log("플레이어 패배", "bad");
    render();
    return;
  }

  if (enemyDead) {
    game.score += 100;
    if (game.player.hp >= 40) game.score += 30;
    game.prevPlayerHp = game.player.hp;
    game.prevPlayerFamilies = [...game.player.lastTurnFamilies];
    game.round += 1;
    transitionTo(STATE_DECK_BUILD);
  }
}

function describeEffect(effect) {
  const dict = {
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
    echoAttack: `동명 공명 시 추가 공격 ${effect.value}`
  };
  if (effect.kind === "ifLastTurnFamily") return `전 턴 ${effect.family} 사용 시: ${effect.then.map(describeEffect).join(" + ")}`;
  return dict[effect.kind] || `${effect.kind}:${effect.value ?? ""}`;
}

function renderRewards() {
  ui.rewardCards.innerHTML = "";
  game.rewardChoices.forEach((card) => {
    const node = cardNode(card, `선택: ${card.name}`);
    const btn = node.querySelector("button");
    btn.textContent = "선택";
    btn.disabled = false;
    btn.addEventListener("click", () => chooseReward(card.id));
    ui.rewardCards.appendChild(node);
  });
}

function cardNode(card, title = "사용") {
  const wrap = document.createElement("article");
  wrap.className = "card";
  wrap.innerHTML = `
    <img class="card-art" src="${card.image}" alt="${card.name}" />
    <h3>${card.name}</h3>
    <p>${card.id} | ${card.sigil} | ${card.type}</p>
    <p>패밀리: ${card.family} | 코스트 ${card.energyCost} / 수치 ${card.baseValue}</p>
    <p>효과: ${card.effect.map(describeEffect).join(", ")}</p>
  `;
  const btn = document.createElement("button");
  btn.className = "play-btn";
  btn.textContent = title;
  wrap.appendChild(btn);
  return wrap;
}

function renderHand() {
  ui.hand.innerHTML = "";
  game.player?.hand.forEach((card, index) => {
    const node = cardNode(card);
    const btn = node.querySelector("button");
    btn.disabled = game.state !== STATE_PLAYER_TURN || game.player.energy < card.energyCost;
    btn.addEventListener("click", () => resolveCard(game.player, game.enemy, index));
    ui.hand.appendChild(node);
  });
}

function renderSynergy() {
  const actor = game.activeSide === "enemy" ? game.enemy : game.player;
  ui.synergyInfo.innerHTML = "";
  if (!actor) return;
  SIGILS.forEach((sigil) => {
    const tag = document.createElement("div");
    tag.className = "synergy-badge";
    tag.textContent = `${sigil}: ${actor.sigilCounts[sigil]} (${actor.activeSynergies[sigil] ? "활성" : "대기"})`;
    ui.synergyInfo.appendChild(tag);
  });
  [
    `콤보 ${actor.comboChain}`,
    `아드레날린 ${actor.adrenalineTriggered ? "ON" : "OFF"}`,
    `프리즘 버스트 ${actor.prismBurstTriggered ? "사용" : "대기"}`,
    `풀스펙트럼 ${actor.turnScoreMultiplier ? "ON" : "OFF"}`,
    `전 턴 패밀리 ${[...actor.lastTurnFamilies].join("/") || "없음"}`
  ].forEach((text) => {
    const tag = document.createElement("div");
    tag.className = "synergy-badge";
    tag.textContent = text;
    ui.synergyInfo.appendChild(tag);
  });
}

function render() {
  ui.playerHp.textContent = game.player?.hp ?? 72;
  ui.playerMaxHp.textContent = game.player?.maxHp ?? 72;
  ui.playerBlock.textContent = game.player?.block ?? 0;
  ui.playerEnergy.textContent = game.player?.energy ?? 0;

  ui.enemyName.textContent = game.enemy?.name ?? "-";
  ui.enemyHp.textContent = game.enemy?.hp ?? 0;
  ui.enemyMaxHp.textContent = game.enemy?.maxHp ?? 0;
  ui.enemyBlock.textContent = game.enemy?.block ?? 0;
  ui.enemyEnergy.textContent = game.enemy?.energy ?? 0;

  ui.regionName.textContent = game.region ?? "-";
  const currentRound = game.state === STATE_READY ? 0 : Math.min(game.round + 1, game.totalRounds);
  ui.roundInfo.textContent = `${currentRound} / ${game.totalRounds}`;
  ui.battleState.textContent = game.state;
  ui.turnOwner.textContent = game.activeSide === "player" ? "플레이어" : "적";
  ui.score.textContent = game.score;
  ui.playerDraw.textContent = game.player?.drawPile.length ?? 0;
  ui.playerDiscard.textContent = game.player?.discardPile.length ?? 0;
  ui.deckSize.textContent = game.deck.length;

  ui.goalText.textContent = game.state === STATE_RUN_COMPLETE
    ? "목표 달성! 모든 지역을 정복했습니다."
    : "목표: 3개 지역을 돌파하고 최종 보스를 처치하세요.";

  ui.endTurnBtn.disabled = game.state !== STATE_PLAYER_TURN;

  renderHand();
  renderSynergy();
}

ui.startBtn.addEventListener("click", startRun);
ui.endTurnBtn.addEventListener("click", endPlayerTurn);

render();
