const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreText = document.getElementById('scoreText');
const timeText = document.getElementById('timeText');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayScore = document.getElementById('overlayScore');
const restartButton = document.getElementById('restartButton');

const gameConfig = {
  playerSize: 32,
  playerColor: '#3498db',
  playerSpeed: 240,
  enemySize: 28,
  enemyColor: '#e74c3c',
  baseEnemySpeed: 140,
  baseSpawnIntervalMs: 700,
  minSpawnIntervalMs: 400,
  spawnIntervalReductionMs: 50,
  spawnIntervalReductionEverySec: 20,
  speedIncreaseEverySec: 15,
  speedIncreaseAmount: 20,
};

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
};

const game = {
  state: 'ready',
  player: {
    x: canvas.width / 2 - gameConfig.playerSize / 2,
    y: canvas.height - 64,
    size: gameConfig.playerSize,
  },
  enemies: [],
  score: 0,
  survivalTimeSec: 0,
  startTimeMs: 0,
  elapsedBeforeGameOverSec: 0,
  lastFrameMs: performance.now(),
  lastSpawnMs: 0,
};

function resetGame() {
  game.state = 'ready';
  game.player.x = canvas.width / 2 - gameConfig.playerSize / 2;
  game.player.y = canvas.height - 64;
  game.enemies = [];
  game.score = 0;
  game.survivalTimeSec = 0;
  game.startTimeMs = 0;
  game.elapsedBeforeGameOverSec = 0;
  game.lastSpawnMs = 0;
  updateHud();
  showReadyOverlay();
}

function showReadyOverlay() {
  overlay.classList.remove('hidden');
  overlayTitle.textContent = 'Square Survival';
  overlayScore.textContent = 'Press Arrow Keys or WASD to start';
  restartButton.textContent = 'Restart';
}

function showGameOverOverlay() {
  overlay.classList.remove('hidden');
  overlayTitle.textContent = 'Game Over';
  overlayScore.textContent = `Final Score: ${game.score}`;
  restartButton.textContent = 'Restart';
}

function startPlaying(nowMs) {
  if (game.state !== 'ready') {
    return;
  }

  game.state = 'playing';
  game.startTimeMs = nowMs;
  game.lastSpawnMs = nowMs;
  overlay.classList.add('hidden');
}

function handleKeyDown(event) {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (!(key in keys)) {
    return;
  }

  keys[key] = true;

  if (game.state === 'ready') {
    startPlaying(performance.now());
  }
}

function handleKeyUp(event) {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (!(key in keys)) {
    return;
  }

  keys[key] = false;
}

function getMovementDirection() {
  const left = keys.ArrowLeft || keys.a;
  const right = keys.ArrowRight || keys.d;
  const up = keys.ArrowUp || keys.w;
  const down = keys.ArrowDown || keys.s;

  const dx = Number(right) - Number(left);
  const dy = Number(down) - Number(up);
  return { dx, dy };
}

function clampPlayerToBounds() {
  const maxX = canvas.width - game.player.size;
  const maxY = canvas.height - game.player.size;

  game.player.x = Math.max(0, Math.min(maxX, game.player.x));
  game.player.y = Math.max(0, Math.min(maxY, game.player.y));
}

function getCurrentEnemySpeed() {
  const increments = Math.floor(game.survivalTimeSec / gameConfig.speedIncreaseEverySec);
  return gameConfig.baseEnemySpeed + increments * gameConfig.speedIncreaseAmount;
}

function getCurrentSpawnIntervalMs() {
  const reductions = Math.floor(game.survivalTimeSec / gameConfig.spawnIntervalReductionEverySec);
  const interval = gameConfig.baseSpawnIntervalMs - reductions * gameConfig.spawnIntervalReductionMs;
  return Math.max(gameConfig.minSpawnIntervalMs, interval);
}

function spawnEnemy() {
  const x = Math.random() * (canvas.width - gameConfig.enemySize);
  game.enemies.push({
    x,
    y: -gameConfig.enemySize,
    size: gameConfig.enemySize,
  });
}

function isCollidingAABB(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.size > b.x &&
    a.y < b.y + b.size &&
    a.y + a.size > b.y
  );
}

function updatePlaying(dtSec, nowMs) {
  game.survivalTimeSec = (nowMs - game.startTimeMs) / 1000;
  game.score = Math.floor(game.survivalTimeSec * 10);

  const { dx, dy } = getMovementDirection();
  if (dx !== 0 || dy !== 0) {
    const length = Math.hypot(dx, dy) || 1;
    game.player.x += (dx / length) * gameConfig.playerSpeed * dtSec;
    game.player.y += (dy / length) * gameConfig.playerSpeed * dtSec;
  }

  clampPlayerToBounds();

  const spawnIntervalMs = getCurrentSpawnIntervalMs();
  if (nowMs - game.lastSpawnMs >= spawnIntervalMs) {
    spawnEnemy();
    game.lastSpawnMs = nowMs;
  }

  const enemySpeed = getCurrentEnemySpeed();
  for (const enemy of game.enemies) {
    enemy.y += enemySpeed * dtSec;
  }

  game.enemies = game.enemies.filter((enemy) => enemy.y <= canvas.height + enemy.size);

  for (const enemy of game.enemies) {
    if (isCollidingAABB(game.player, enemy)) {
      game.state = 'gameOver';
      game.elapsedBeforeGameOverSec = game.survivalTimeSec;
      showGameOverOverlay();
      break;
    }
  }

  updateHud();
}

function updateHud() {
  const timeValue = game.state === 'gameOver' ? game.elapsedBeforeGameOverSec : game.survivalTimeSec;
  scoreText.textContent = `Score: ${game.score}`;
  timeText.textContent = `Time: ${timeValue.toFixed(1)}s`;
}

function drawRect(entity, color) {
  ctx.fillStyle = color;
  ctx.fillRect(entity.x, entity.y, entity.size, entity.size);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(game.player, gameConfig.playerColor);
  for (const enemy of game.enemies) {
    drawRect(enemy, gameConfig.enemyColor);
  }
}

function gameLoop(nowMs) {
  const dtSec = Math.min((nowMs - game.lastFrameMs) / 1000, 0.1);
  game.lastFrameMs = nowMs;

  if (game.state === 'playing') {
    updatePlaying(dtSec, nowMs);
  }

  render();
  requestAnimationFrame(gameLoop);
}

restartButton.addEventListener('click', () => {
  if (game.state === 'gameOver') {
    resetGame();
  }
});

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

resetGame();
requestAnimationFrame(gameLoop);
