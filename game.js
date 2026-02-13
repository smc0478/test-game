import { createGame, createEngine } from './src/gameEngine.js';
import { createUiBindings, initBattleUI, render } from './src/ui.js';

const ui = createUiBindings();
const game = createGame();

initBattleUI(ui);

const engine = createEngine(game, {
  onRender: () => render(ui, game, engine)
});

ui.startBtn.addEventListener('click', () => engine.startRun());
ui.resumeBtn.addEventListener('click', () => engine.resumeRun());
ui.resetSaveBtn.addEventListener('click', () => engine.resetSavedRun());
ui.endTurnBtn.addEventListener('click', () => engine.endPlayerTurn());
ui.skipRewardBtn.addEventListener('click', () => engine.skipReward());
ui.finishDeckBuildBtn.addEventListener('click', () => engine.finishDeckBuild());
ui.openCodexBtn.addEventListener('click', () => window.open('./codex.html', '_blank'));
ui.openHallBtn.addEventListener('click', () => window.open('./hall.html', '_blank'));

render(ui, game, engine);
