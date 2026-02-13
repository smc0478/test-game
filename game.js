const STATE_READY = "ready";
const STATE_PLAYER_TURN = "playerTurn";
const STATE_ENEMY_TURN = "enemyTurn";
const STATE_RESOLUTION = "resolution";
const STATE_GAME_OVER = "gameOver";

const SIGILS = ["Flame", "Leaf", "Gear", "Void"];

const CARD_POOL = Object.freeze([
  { id: "C001", name: "Ember Strike", type: "attack", energyCost: 1, baseValue: 7, sigil: "Flame" },
  { id: "C002", name: "Ember Strike+", type: "attack", energyCost: 1, baseValue: 9, sigil: "Flame" },
  { id: "C003", name: "Thorn Jab", type: "attack", energyCost: 1, baseValue: 6, sigil: "Leaf" },
  { id: "C004", name: "Cog Shot", type: "attack", energyCost: 1, baseValue: 6, sigil: "Gear" },
  { id: "C005", name: "Null Pierce", type: "attack", energyCost: 1, baseValue: 5, sigil: "Void" },
  { id: "C006", name: "Bark Guard", type: "skill", energyCost: 1, baseValue: 8, sigil: "Leaf" },
  { id: "C007", name: "Clockwork Guard", type: "skill", energyCost: 1, baseValue: 7, sigil: "Gear" },
  { id: "C008", name: "Spark Cycle", type: "skill", energyCost: 1, baseValue: 1, sigil: "Gear" },
  { id: "C009", name: "Ashen Focus", type: "skill", energyCost: 1, baseValue: 2, sigil: "Flame" },
  { id: "C010", name: "Void Echo", type: "skill", energyCost: 1, baseValue: 2, sigil: "Void" }
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
  player: createActor("Player", 50, buildDeck(CARD_POOL.map((card) => card.id))),
  enemy: createActor("Training Automaton", 55, buildDeck(CARD_POOL.map((card) => card.id))),
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
    turnScoreMultiplier: false,
    fullSpectrumAwarded: false
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
    log(`Invalid transition blocked: ${game.state} -> ${nextState}`, "bad");
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
    log(`Turn ${game.turn}: Player turn started.`, "good");
  } else if (state === STATE_ENEMY_TURN) {
    game.activeSide = "enemy";
    startTurn(game.enemy);
    log(`Enemy turn started.`, "good");
    enemyLoop();
  } else if (state === STATE_RESOLUTION) {
    resolveBattleState();
  } else if (state === STATE_GAME_OVER) {
    ui.endTurnBtn.disabled = true;
    const result = game.player.hp > 0 && game.enemy.hp <= 0 ? "Victory" : "Defeat";
    log(`Game Over: ${result}. Final Score: ${game.score}`, result === "Victory" ? "good" : "bad");
  }
}

function startBattle() {
  game.state = STATE_READY;
  game.turn = 0;
  game.score = 0;
  game.player = createActor("Player", 50, buildDeck(CARD_POOL.map((c) => c.id)));
  game.enemy = createActor("Training Automaton", 55, buildDeck(CARD_POOL.map((c) => c.id)));

  [game.player, game.enemy].forEach((actor) => {
    actor.drawPile = shuffle(actor.deck);
    actor.discardPile = [];
    actor.hand = [];
  });

  ui.log.innerHTML = "";
  log("Battle initialized.", "good");
  transitionTo(STATE_PLAYER_TURN);
}

function startTurn(actor) {
  actor.energy = 3;
  actor.nextAttackBonus = 0;
  actor.sigilCounts = makeSigilCounter();
  actor.activeSynergies = { Flame: false, Leaf: false, Gear: false, Void: false };
  actor.turnScoreMultiplier = false;
  actor.fullSpectrumAwarded = false;
  drawCards(actor, 5);
}

function drawCards(actor, amount) {
  for (let i = 0; i < amount; i += 1) {
    if (actor.drawPile.length === 0) {
      if (actor.discardPile.length === 0) return;
      actor.drawPile = shuffle(actor.discardPile);
      actor.discardPile = [];
      log(`${actor.name} reshuffled discard into draw pile.`);
    }
    actor.hand.push(actor.drawPile.shift());
  }
}

function applyDamage(target, amount) {
  const absorbed = Math.min(target.block, amount);
  target.block -= absorbed;
  const remaining = amount - absorbed;
  target.hp = Math.max(0, target.hp - remaining);
}

function applyScoreForCard(actor, card) {
  let gain = card.type === "attack" ? 10 : 8;
  if (actor.activeSynergies.Void) gain = Math.floor(gain * 1.5);
  if (actor.turnScoreMultiplier) gain = Math.floor(gain * 2);
  game.score += gain;
  log(`${actor.name} gained ${gain} score from ${card.name}.`);
}

function maybeActivateSynergy(actor, sigil) {
  actor.sigilCounts[sigil] += 1;
  if (actor.sigilCounts[sigil] >= 2 && !actor.activeSynergies[sigil]) {
    actor.activeSynergies[sigil] = true;
    if (sigil === "Flame") {
      actor.nextAttackBonus += 2;
      log(`${actor.name} activated Flame synergy: next attack +2.`);
    } else if (sigil === "Leaf") {
      actor.block += 3;
      log(`${actor.name} activated Leaf synergy: +3 block.`);
    } else if (sigil === "Gear") {
      log(`${actor.name} activated Gear synergy: +1 draw on each card resolve.`);
    } else if (sigil === "Void") {
      log(`${actor.name} activated Void synergy: score x1.5.`);
    }
  }

  if (!actor.turnScoreMultiplier && SIGILS.every((name) => actor.sigilCounts[name] >= 1)) {
    actor.turnScoreMultiplier = true;
    if (!actor.fullSpectrumAwarded) {
      game.score += 20;
      actor.fullSpectrumAwarded = true;
      log(`${actor.name} achieved full-spectrum turn: +20 bonus, turn score x2.`, "good");
    }
  }
}

function resolveCard(actor, target, handIndex) {
  const card = actor.hand[handIndex];
  if (!card || actor.energy < card.energyCost) return false;

  actor.energy -= card.energyCost;
  actor.hand.splice(handIndex, 1);
  actor.discardPile.push(card);

  maybeActivateSynergy(actor, card.sigil);

  const effect = computeCardEffect(card, actor, target);
  applyEffect(effect, actor, target, card);
  applyScoreForCard(actor, card);

  if (actor.activeSynergies.Gear) {
    drawCards(actor, 1);
    log(`${actor.name} drew +1 from Gear synergy.`);
  }

  return true;
}

function computeCardEffect(card, actor, target) {
  if (card.id === "C009") {
    return { kind: "buffAttack", value: card.baseValue };
  }
  if (card.id === "C008") {
    return { kind: "draw", value: card.baseValue };
  }
  if (card.id === "C010") {
    return { kind: "reduceBlock", value: card.baseValue };
  }
  if (card.type === "attack") {
    let damage = card.baseValue;
    if (actor.nextAttackBonus > 0) {
      damage += actor.nextAttackBonus;
      actor.nextAttackBonus = 0;
    }
    return { kind: "damage", value: damage };
  }
  return { kind: "block", value: card.baseValue };
}

function applyEffect(effect, actor, target, card) {
  if (effect.kind === "damage") {
    applyDamage(target, effect.value);
    log(`${actor.name} used ${card.name}: dealt ${effect.value} damage.`);
  } else if (effect.kind === "block") {
    actor.block += effect.value;
    log(`${actor.name} used ${card.name}: gained ${effect.value} block.`);
  } else if (effect.kind === "draw") {
    drawCards(actor, effect.value);
    log(`${actor.name} used ${card.name}: drew ${effect.value} card(s).`);
  } else if (effect.kind === "buffAttack") {
    actor.nextAttackBonus += effect.value;
    log(`${actor.name} used ${card.name}: next attack +${effect.value} this turn.`);
  } else if (effect.kind === "reduceBlock") {
    target.block = Math.max(0, target.block - effect.value);
    log(`${actor.name} used ${card.name}: reduced ${target.name} block by ${effect.value}.`);
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

  if (game.player.energy <= 0 || noPlayableCards(game.player)) {
    endPlayerTurn();
  }
  render();
}

function endPlayerTurn() {
  if (game.state !== STATE_PLAYER_TURN) return;
  game.player.discardPile.push(...game.player.hand);
  game.player.hand = [];
  transitionTo(STATE_ENEMY_TURN);
}

function getPlayableCards(actor) {
  return actor.hand
    .map((card, index) => ({ card, index }))
    .filter(({ card }) => card.energyCost <= actor.energy);
}

function estimateDamage(actor, card) {
  if (card.type !== "attack") return 0;
  return card.baseValue + actor.nextAttackBonus;
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
      .filter(({ card }) => ["C006", "C007"].includes(card.id))
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
    if (game.player.hp <= 0 || game.enemy.hp <= 0 || game.enemy.energy <= 0 || noPlayableCards(game.enemy)) {
      break;
    }
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
    log("Simultaneous KO: strict defeat rule applied.", "bad");
    transitionTo(STATE_GAME_OVER);
    return;
  }

  if (playerDead) {
    game.score = 0;
    transitionTo(STATE_GAME_OVER);
    return;
  }

  if (enemyDead) {
    game.score += 100;
    if (game.player.hp >= 40) game.score += 30;
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
      <h3>${card.name}</h3>
      <p>ID: ${card.id}</p>
      <p>Type: ${card.type}</p>
      <p>Sigil: ${card.sigil}</p>
      <p>Value: ${card.baseValue}</p>
      <p>Cost: ${card.energyCost}</p>
    `;

    const btn = document.createElement("button");
    btn.className = "play-btn";
    btn.textContent = "Play";
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
    const active = actor.activeSynergies[sigil] ? "active" : "inactive";
    node.textContent = `${sigil}: count ${actor.sigilCounts[sigil]} (${active})`;
    ui.synergyInfo.appendChild(node);
  });
  const multiplier = document.createElement("div");
  multiplier.className = "synergy-badge";
  multiplier.textContent = `Turn score x2: ${actor.turnScoreMultiplier ? "ON" : "OFF"}`;
  ui.synergyInfo.appendChild(multiplier);
}

function render() {
  ui.playerHp.textContent = game.player.hp;
  ui.playerBlock.textContent = game.player.block;
  ui.playerEnergy.textContent = game.player.energy;

  ui.enemyHp.textContent = game.enemy.hp;
  ui.enemyBlock.textContent = game.enemy.block;
  ui.enemyEnergy.textContent = game.enemy.energy;

  ui.battleState.textContent = game.state;
  ui.turnOwner.textContent = game.activeSide;
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
