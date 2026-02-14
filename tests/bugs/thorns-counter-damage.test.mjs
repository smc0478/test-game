import assert from 'node:assert/strict';
import { createGame, createEngine } from '../../src/core/battleCore.js';
import { STATES } from '../../src/constants.js';

const game = createGame();
const engine = createEngine(game, { onRender: () => {} });
engine.startRun();

game.state = STATES.PLAYER_TURN;
game.player.energy = 10;
game.player.hand = [engine.cloneCard('C025')];
game.player.discardPile = [];
game.player.block = 0;
game.player.thorns = 0;
game.player.hp = 78;

game.enemy.hp = 20;
game.enemy.maxHp = 20;
game.enemy.block = 0;
game.enemy.hand = [engine.cloneCard('C001')];
game.enemy.drawPile = [];
game.enemy.discardPile = [];
game.enemy.energy = 1;

engine.playCardAt(0);
assert.equal(game.player.thorns, 3, 'C025 should grant 3 thorns before enemy turn');

engine.endPlayerTurn();

assert.equal(game.enemy.hp, 17, 'enemy should take thorn damage when attacking into thorns');

console.log('PASS: thorns-counter-damage');
