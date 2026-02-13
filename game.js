const STATE_READY = "ready";
const STATE_PLAYER_TURN = "playerTurn";
const STATE_ENEMY_TURN = "enemyTurn";
const STATE_RESOLUTION = "resolution";
const STATE_GAME_OVER = "gameOver";

const SIGILS = ["Flame", "Leaf", "Gear", "Void"];
const SIGIL_STYLE = {
  Flame: { color: "#f87171", icon: "🔥" },
  Leaf: { color: "#4ade80", icon: "🍃" },
  Gear: { color: "#60a5fa", icon: "⚙️" },
  Void: { color: "#a78bfa", icon: "🜏" }
};

function makeCardImage(card) {
  const style = SIGIL_STYLE[card.sigil] || { color: "#94a3b8", icon: "❖" };
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${style.color}' stop-opacity='0.9'/>
        <stop offset='100%' stop-color='#111827' stop-opacity='0.9'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' rx='14' fill='url(#g)'/>
    <text x='22' y='50' font-size='42'>${style.icon}</text>
    <text x='22' y='90' fill='white' font-size='22' font-family='Arial'>${card.name}</text>
    <text x='22' y='120' fill='white' font-size='16' font-family='Arial'>${card.sigil} · ${card.type}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function cardDef(data) {
  return { ...data, image: makeCardImage(data) };
}

const CARD_POOL = Object.freeze([
  cardDef({ id: "C001", name: "Ember Strike", type: "attack", energyCost: 1, baseValue: 7, sigil: "Flame" }),
  cardDef({ id: "C002", name: "Blaze Rush", type: "attack", energyCost: 1, baseValue: 8, sigil: "Flame" }),
  cardDef({ id: "C003", name: "Thorn Jab", type: "attack", energyCost: 1, baseValue: 6, sigil: "Leaf" }),
  cardDef({ id: "C004", name: "Cog Shot", type: "attack", energyCost: 1, baseValue: 6, sigil: "Gear" }),
  cardDef({ id: "C005", name: "Null Pierce", type: "attack", energyCost: 1, baseValue: 6, sigil: "Void" }),
  cardDef({ id: "C006", name: "Bark Guard", type: "skill", energyCost: 1, baseValue: 8, sigil: "Leaf" }),
  cardDef({ id: "C007", name: "Clockwork Guard", type: "skill", energyCost: 1, baseValue: 7, sigil: "Gear" }),
  cardDef({ id: "C008", name: "Spark Cycle", type: "skill", energyCost: 1, baseValue: 2, sigil: "Gear" }),
  cardDef({ id: "C009", name: "Ashen Focus", type: "skill", energyCost: 1, baseValue: 3, sigil: "Flame" }),
  cardDef({ id: "C010", name: "Void Echo", type: "skill", energyCost: 1, baseValue: 3, sigil: "Void" }),
  cardDef({ id: "C011", name: "Verdant Pulse", type: "skill", energyCost: 2, baseValue: 12, sigil: "Leaf" }),
  cardDef({ id: "C012", name: "Abyss Cut", type: "attack", energyCost: 2, baseValue: 12, sigil: "Void" })
]);

const TRANSITIONS = {
  [STATE_READY]: [STATE_PLAYER_TURN],
  [STATE_PLAYER_TURN]: [STATE_ENEMY_TURN],
  [STATE_ENEMY_TURN]: [STATE_RESOLUTION],
  [STATE_RESOLUTION]: [STATE_PLAYER_TURN, STATE_GAME_OVER],
  [STATE_GAME_OVER]: []
};

const ui = {
  startBtn: document.getElementById("start-btn"),
  endTurnBtn: document.getElementById("end-turn-btn"),
  playerHp: document.getElementById("player-hp"),
  playerBlock: document.getElementById("player-block"),
  playerEnergy: document.getElementById("player-energy"),
  enemyHp: document.getElementById("enemy-hp"),
  enemyBlock: document.getElementById("enemy-block"),
  enemyEnergy: document.getElementById("enemy-energy"),
  battleState: document.getElementById("battle-state"),
  turnOwner: document.getElementById("turn-owner"),
  score: document.getElementById("score"),
  hand: document.getElementById("hand"),
  playerDraw: document.getElementById("player-draw"),
  playerDiscard: document.getElementById("player-discard"),
  log: document.getElementById("log"),
  synergyInfo: document.getElementById("synergy-info")
};

const game = {
  state: STATE_READY,
  turn: 0,
  score: 0,
  player: createActor("플레이어", 64, buildDeck(CARD_POOL.map((card) => card.id))),
  enemy: createActor("훈련 오토마톤", 78, buildDeck(CARD_POOL.map((card) => card.id))),
  activeSide: "player"
};

function createActor(name, maxHp, deck) {
  return {
    name,
    maxHp,
    hp: maxHp,
    block: 0,
    energy: 0,
    deck,
    drawPile: [],
    discardPile: [],
    hand: [],
    nextAttackBonus: 0,
    sigilCounts: makeSigilCounter(),
    activeSynergies: { Flame: false, Leaf: false, Gear: false, Void: false },
    activatedSynergiesThisTurn: new Set(),
    turnScoreMultiplier: false,
    fullSpectrumAwarded: false,
    cardsPlayedThisTurn: 0,
    momentumTriggered: false,
    adrenalineTriggered: false,
    comboChain: 0,
    lastSigil: null,
    prismBurstTriggered: false
  };
}

function makeSigilCounter() {
  return { Flame: 0, Leaf: 0, Gear: 0, Void: 0 };
}

function buildDeck(cardIds) {
  if (cardIds.length > 12) {
    throw new Error("Deck size cannot exceed 12 cards.");
  }
  return cardIds.map((id) => {
    const card = CARD_POOL.find((entry) => entry.id === id);
    if (!card) throw new Error(`Invalid card id: ${id}`);
    return structuredClone(card);
  });
}

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function log(message, type = "") {
  const row = document.createElement("p");
  row.className = `log-entry ${type}`.trim();
  row.textContent = message;
  ui.log.prepend(row);
}

function transitionTo(nextState) {
  const allowed = TRANSITIONS[game.state] || [];
  if (!allowed.includes(nextState)) {
    log(`잘못된 상태 전이 차단: ${game.state} -> ${nextState}`, "bad");
    return;
  }
  game.state = nextState;
  enterState(nextState);
  render();
}

function enterState(state) {
  if (state === STATE_PLAYER_TURN) {
    game.turn += 1;
    game.activeSide = "player";
    startTurn(game.player);
    log(`${game.turn}턴 시작: 플레이어 턴`, "good");
  } else if (state === STATE_ENEMY_TURN) {
    game.activeSide = "enemy";
    startTurn(game.enemy);
    log("적 턴 시작", "good");
    enemyLoop();
  } else if (state === STATE_RESOLUTION) {
    resolveBattleState();
  } else if (state === STATE_GAME_OVER) {
    ui.endTurnBtn.disabled = true;
    const result = game.player.hp > 0 && game.enemy.hp <= 0 ? "승리" : "패배";
    log(`전투 종료: ${result} / 최종 점수 ${game.score}`, result === "승리" ? "good" : "bad");
  }
}

function startBattle() {
  game.state = STATE_READY;
  game.turn = 0;
  game.score = 0;
  game.player = createActor("플레이어", 64, buildDeck(CARD_POOL.map((c) => c.id)));
  game.enemy = createActor("훈련 오토마톤", 78, buildDeck(CARD_POOL.map((c) => c.id)));

  [game.player, game.enemy].forEach((actor) => {
    actor.drawPile = shuffle(actor.deck);
    actor.discardPile = [];
    actor.hand = [];
  });

  ui.log.innerHTML = "";
  log("전투 초기화 완료", "good");
  transitionTo(STATE_PLAYER_TURN);
}

function startTurn(actor) {
  actor.block = 0;
  actor.energy = 3;
  actor.nextAttackBonus = 0;
  actor.sigilCounts = makeSigilCounter();
  actor.activeSynergies = { Flame: false, Leaf: false, Gear: false, Void: false };
  actor.activatedSynergiesThisTurn = new Set();
  actor.turnScoreMultiplier = false;
  actor.fullSpectrumAwarded = false;
  actor.cardsPlayedThisTurn = 0;
  actor.momentumTriggered = false;
  actor.adrenalineTriggered = false;
  actor.comboChain = 0;
  actor.lastSigil = null;
  actor.prismBurstTriggered = false;
  drawCards(actor, 5);
}

function drawCards(actor, amount) {
  for (let i = 0; i < amount; i += 1) {
    if (actor.drawPile.length === 0) {
      if (actor.discardPile.length === 0) return;
      actor.drawPile = shuffle(actor.discardPile);
      actor.discardPile = [];
      log(`${actor.name}: 버린 더미를 섞어 드로우 더미로 이동`);
    }

    const drawn = actor.drawPile.shift();
    if (actor.hand.length >= 8) {
      actor.discardPile.push(drawn);
      log(`${actor.name}: 손패 제한(8)으로 ${drawn.name} 소각`, "bad");
      continue;
    }
    actor.hand.push(drawn);
  }
}

function applyDamage(target, amount) {
  const absorbed = Math.min(target.block, amount);
  target.block -= absorbed;
  const remaining = amount - absorbed;
  target.hp = Math.max(0, target.hp - remaining);
}

function comboScoreBonus(chain) {
  if (chain >= 4) return 8;
  if (chain >= 3) return 4;
  return 0;
}

function applyScoreForCard(actor, card, synergyActiveForCard) {
  if (actor !== game.player) return;
  let gain = card.type === "attack" ? 10 : 8;
  if (card.sigil === "Void" && synergyActiveForCard) gain = Math.floor(gain * 1.5);
  if (actor.turnScoreMultiplier) gain = Math.floor(gain * 2);

  gain += comboScoreBonus(actor.comboChain);

  game.score += gain;
  log(`점수 +${gain} (${card.name})`, "good");
}

function maybeActivateSynergy(actor, sigil) {
  actor.sigilCounts[sigil] += 1;
  let newlyActivatedSigil = null;

  if (actor.sigilCounts[sigil] >= 2 && !actor.activeSynergies[sigil]) {
    actor.activeSynergies[sigil] = true;
    newlyActivatedSigil = sigil;
    actor.activatedSynergiesThisTurn.add(sigil);
    log(`${actor.name}: ${sigil} 시너지 활성화`, "good");
  }

  if (!actor.turnScoreMultiplier && SIGILS.every((name) => actor.sigilCounts[name] >= 1)) {
    actor.turnScoreMultiplier = true;
    if (!actor.fullSpectrumAwarded && actor === game.player) {
      game.score += 30;
      actor.fullSpectrumAwarded = true;
      log("풀 스펙트럼 달성: +30, 이번 턴 점수 x2", "good");
    }
  }

  return { synergyActiveForCard: actor.sigilCounts[sigil] >= 2, newlyActivatedSigil };
}

function updateCombo(actor, sigil) {
  if (!actor.lastSigil) {
    actor.comboChain = 1;
  } else if (actor.lastSigil === sigil) {
    actor.comboChain = 1;
  } else {
    actor.comboChain = Math.min(4, actor.comboChain + 1);
  }

  actor.lastSigil = sigil;
  log(`${actor.name}: 콤보 체인 ${actor.comboChain}`, "good");
}

function triggerPrismBurst(actor, target) {
  if (actor.prismBurstTriggered || actor.comboChain < 4) return;
  actor.prismBurstTriggered = true;

  applyDamage(target, 8);
  actor.block += 8;
  log(`${actor.name}: 프리즘 버스트 발동! 피해 8 + 방어 8`, "good");

  if (actor === game.player) {
    game.score += 20;
    log("프리즘 버스트 보너스: 점수 +20", "good");
  }
}

function maybeTriggerAdrenaline(actor) {
  if (actor.adrenalineTriggered || actor.activatedSynergiesThisTurn.size < 2) return;
  actor.adrenalineTriggered = true;

  actor.energy += 1;
  drawCards(actor, 1);
  log(`${actor.name}: 아드레날린 발동(+1 에너지, 1드로우)`, "good");

  if (actor === game.player) {
    game.score += 12;
    log("아드레날린 보너스: 점수 +12", "good");
  }
}

function resolveCard(actor, target, handIndex) {
  const card = actor.hand[handIndex];
  if (!card || actor.energy < card.energyCost) return false;

  actor.energy -= card.energyCost;
  actor.hand.splice(handIndex, 1);
  actor.discardPile.push(card);

  actor.cardsPlayedThisTurn += 1;
  if (!actor.momentumTriggered && actor.cardsPlayedThisTurn >= 3) {
    actor.energy += 1;
    actor.momentumTriggered = true;
    log(`${actor.name}: 모멘텀 발동(+1 에너지)`, "good");
  }

  updateCombo(actor, card.sigil);
  const { synergyActiveForCard } = maybeActivateSynergy(actor, card.sigil);

  const effect = computeCardEffect(card, actor, target, synergyActiveForCard);
  applyEffect(effect, actor, target, card);

  triggerPrismBurst(actor, target);
  maybeTriggerAdrenaline(actor);
  applyScoreForCard(actor, card, synergyActiveForCard);

  if (card.sigil === "Gear" && synergyActiveForCard) {
    drawCards(actor, 1);
    log(`${actor.name}: Gear 시너지로 1장 추가 드로우`);
  }

  return true;
}

function computeCardEffect(card, actor, target, synergyActiveForCard) {
  if (card.id === "C009") return { kind: "buffAttack", value: card.baseValue };
  if (card.id === "C008") return { kind: "draw", value: card.baseValue };
  if (card.id === "C010") return { kind: "reduceBlock", value: card.baseValue };

  if (card.type === "attack") {
    let damage = card.baseValue;
    if (actor.nextAttackBonus > 0) {
      damage += actor.nextAttackBonus;
      actor.nextAttackBonus = 0;
    }
    if (card.sigil === "Flame" && synergyActiveForCard) damage += 3;
    return { kind: "damage", value: damage };
  }

  let blockValue = card.baseValue;
  if (card.sigil === "Leaf" && synergyActiveForCard) blockValue += 3;
  return { kind: "block", value: blockValue };
}

function applyEffect(effect, actor, target, card) {
  if (effect.kind === "damage") {
    applyDamage(target, effect.value);
    log(`${actor.name} → ${card.name}: 피해 ${effect.value}`);
  } else if (effect.kind === "block") {
    actor.block += effect.value;
    log(`${actor.name} → ${card.name}: 방어 ${effect.value}`);
  } else if (effect.kind === "draw") {
    drawCards(actor, effect.value);
    log(`${actor.name} → ${card.name}: ${effect.value}장 드로우`);
  } else if (effect.kind === "buffAttack") {
    actor.nextAttackBonus += effect.value;
    log(`${actor.name} → ${card.name}: 다음 공격 +${effect.value}`);
  } else if (effect.kind === "reduceBlock") {
    target.block = Math.max(0, target.block - effect.value);
    log(`${actor.name} → ${card.name}: ${target.name} 방어 -${effect.value}`);
  }
}

function noPlayableCards(actor) {
  return actor.hand.every((card) => card.energyCost > actor.energy);
}

function playerPlayCard(index) {
  if (game.state !== STATE_PLAYER_TURN) return;
  const played = resolveCard(game.player, game.enemy, index);
  if (!played) return;

  if (game.enemy.hp <= 0) {
    transitionTo(STATE_RESOLUTION);
    return;
  }

  if (game.player.energy <= 0 || noPlayableCards(game.player)) endPlayerTurn();
  render();
}

function endPlayerTurn() {
  if (game.state !== STATE_PLAYER_TURN) return;
  game.player.discardPile.push(...game.player.hand);
  game.player.hand = [];
  transitionTo(STATE_ENEMY_TURN);
}

function getPlayableCards(actor) {
  return actor.hand.map((card, index) => ({ card, index })).filter(({ card }) => card.energyCost <= actor.energy);
}

function estimateDamage(actor, card) {
  if (card.type !== "attack") return 0;
  let damage = card.baseValue + actor.nextAttackBonus;
  const projectedCount = actor.sigilCounts[card.sigil] + 1;
  if (card.sigil === "Flame" && projectedCount >= 2) damage += 3;
  return damage;
}

function enemyChooseCard(actor, target) {
  const playable = getPlayableCards(actor);
  if (playable.length === 0) return null;

  const lethal = playable
    .filter(({ card }) => card.type === "attack")
    .sort((a, b) => estimateDamage(actor, b.card) - estimateDamage(actor, a.card))
    .find(({ card }) => estimateDamage(actor, card) >= target.hp + target.block);
  if (lethal) return lethal;

  const highestDamage = playable
    .filter(({ card }) => card.type === "attack")
    .sort((a, b) => estimateDamage(actor, b.card) - estimateDamage(actor, a.card))[0];
  if (highestDamage) return highestDamage;

  if (actor.hp <= 25) {
    const highestBlock = playable
      .filter(({ card }) => ["C006", "C007", "C011"].includes(card.id))
      .sort((a, b) => b.card.baseValue - a.card.baseValue)[0];
    if (highestBlock) return highestBlock;
  }

  return playable[0];
}

function enemyLoop() {
  while (game.state === STATE_ENEMY_TURN) {
    const choice = enemyChooseCard(game.enemy, game.player);
    if (!choice) break;

    resolveCard(game.enemy, game.player, choice.index);
    if (game.player.hp <= 0 || game.enemy.hp <= 0 || game.enemy.energy <= 0 || noPlayableCards(game.enemy)) break;
  }

  game.enemy.discardPile.push(...game.enemy.hand);
  game.enemy.hand = [];
  transitionTo(STATE_RESOLUTION);
}

function resolveBattleState() {
  const playerDead = game.player.hp <= 0;
  const enemyDead = game.enemy.hp <= 0;

  if (playerDead && enemyDead) {
    game.score = 0;
    log("동시 KO: 패배 처리", "bad");
    transitionTo(STATE_GAME_OVER);
    return;
  }

  if (playerDead) {
    game.score = 0;
    transitionTo(STATE_GAME_OVER);
    return;
  }

  if (enemyDead) {
    game.score += 140;
    if (game.player.hp >= 40) game.score += 50;
    transitionTo(STATE_GAME_OVER);
    return;
  }

  transitionTo(STATE_PLAYER_TURN);
}

function renderHand() {
  ui.hand.innerHTML = "";
  game.player.hand.forEach((card, index) => {
    const wrap = document.createElement("article");
    wrap.className = "card";
    wrap.innerHTML = `
      <img class="card-art" src="${card.image}" alt="${card.name}" />
      <h3>${card.name}</h3>
      <p>ID: ${card.id}</p>
      <p>유형: ${card.type}</p>
      <p>문양: ${card.sigil}</p>
      <p>수치: ${card.baseValue}</p>
      <p>코스트: ${card.energyCost}</p>
    `;

    const btn = document.createElement("button");
    btn.className = "play-btn";
    btn.textContent = "사용";
    btn.disabled = game.state !== STATE_PLAYER_TURN || game.player.energy < card.energyCost;
    btn.addEventListener("click", () => playerPlayCard(index));
    wrap.appendChild(btn);
    ui.hand.appendChild(wrap);
  });
}

function renderSynergy(actor) {
  ui.synergyInfo.innerHTML = "";
  SIGILS.forEach((sigil) => {
    const node = document.createElement("div");
    node.className = "synergy-badge";
    const active = actor.activeSynergies[sigil] ? "활성" : "비활성";
    node.textContent = `${sigil}: ${actor.sigilCounts[sigil]} (${active})`;
    ui.synergyInfo.appendChild(node);
  });

  const multiplier = document.createElement("div");
  multiplier.className = "synergy-badge";
  multiplier.textContent = `턴 점수 x2: ${actor.turnScoreMultiplier ? "ON" : "OFF"}`;
  ui.synergyInfo.appendChild(multiplier);

  const combo = document.createElement("div");
  combo.className = "synergy-badge";
  combo.textContent = `콤보 체인: ${actor.comboChain}`;
  ui.synergyInfo.appendChild(combo);

  const burst = document.createElement("div");
  burst.className = "synergy-badge";
  burst.textContent = `프리즘 버스트: ${actor.prismBurstTriggered ? "사용" : "대기"}`;
  ui.synergyInfo.appendChild(burst);
}

function render() {
  ui.playerHp.textContent = game.player.hp;
  ui.playerBlock.textContent = game.player.block;
  ui.playerEnergy.textContent = game.player.energy;

  ui.enemyHp.textContent = game.enemy.hp;
  ui.enemyBlock.textContent = game.enemy.block;
  ui.enemyEnergy.textContent = game.enemy.energy;

  ui.battleState.textContent = game.state;
  ui.turnOwner.textContent = game.activeSide === "player" ? "플레이어" : "적";
  ui.score.textContent = game.score;
  ui.playerDraw.textContent = game.player.drawPile.length;
  ui.playerDiscard.textContent = game.player.discardPile.length;

  ui.endTurnBtn.disabled = game.state !== STATE_PLAYER_TURN;

  renderHand();
  renderSynergy(game.activeSide === "enemy" ? game.enemy : game.player);
}

ui.startBtn.addEventListener("click", startBattle);
ui.endTurnBtn.addEventListener("click", endPlayerTurn);

render();
