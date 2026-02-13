import { createGame, createEngine } from './src/gameEngine.js';
import { createUiBindings, render } from './src/ui.js';

const ui = createUiBindings();
const game = createGame();

const engine = createEngine(game, {
  onRender: () => render(ui, game, engine)
});

ui.startBtn.addEventListener('click', engine.startRun);
ui.endTurnBtn.addEventListener('click', engine.endPlayerTurn);
ui.skipRewardBtn.addEventListener('click', engine.skipReward);
ui.finishDeckBuildBtn.addEventListener('click', engine.finishDeckBuild);

render(ui, game, engine);
