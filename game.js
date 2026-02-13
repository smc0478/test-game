import { createGame, createEngine } from './src/core/battleCore.js';
import { createUiBindings, render, createBattleSnapshot, bindBattleHoverPanels } from './src/ui.js';
import { createPhaserBattle } from './src/phaserBattle.js';

const ui = createUiBindings();
const game = createGame();
const hoverPanels = bindBattleHoverPanels(ui);

const battleScene = createPhaserBattle({
  parent: ui.gameRoot,
  onHover: (target, event) => {
    if (target === 'player') hoverPanels.showPlayer(event);
    else hoverPanels.showEnemy(event);
  },
  onHoverOut: (target) => {
    if (target === 'player') hoverPanels.hidePlayer();
    else hoverPanels.hideEnemy();
  }
});

const engine = createEngine(game, {
  onRender: () => {
    render(ui, game, engine);
    battleScene.render(createBattleSnapshot(game));
  }
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
battleScene.render(createBattleSnapshot(game));
