let hoverHooks = { onHover: null, onHoverOut: null };

const safeRate = (value, max) => (max ? Math.max(0, Math.min(1, value / max)) : 0);

class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }
  create() { this.scene.start('BattleScene'); }
}

class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  create() {
    this.bg = this.add.graphics();
    this.floor = this.add.rectangle(0, 0, 0, 0, 0x70c1ff, 0.12).setOrigin(0);
    this.vsText = this.add.text(0, 0, 'VS', { fontSize: '34px', color: '#fef08a', fontStyle: 'bold' }).setOrigin(0.5).setDepth(4);
    this.infoLeft = this.add.text(0, 0, '', { fontSize: '14px', color: '#cfe4ff' }).setDepth(5);
    this.infoRight = this.add.text(0, 0, '', { fontSize: '14px', color: '#cfe4ff', align: 'right' }).setOrigin(1, 0).setDepth(5);

    this.player = this.createFighter(0x38bdf8, 'player', '플레이어');
    this.enemy = this.createFighter(0xfb923c, 'enemy', '적');

    this.scale.on('resize', (gameSize) => this.layout(gameSize.width, gameSize.height));
    this.layout(this.scale.width, this.scale.height);
  }

  createFighter(color, actorKey, fallbackName) {
    const container = this.add.container(0, 0).setDepth(6);
    const shadow = this.add.ellipse(0, 84, 170, 30, 0x020617, 0.58);
    const body = this.add.circle(0, 0, 56, color, 1);
    const shine = this.add.circle(-16, -14, 20, 0xffffff, 0.28);
    const ring = this.add.circle(0, 0, 56).setStrokeStyle(2, 0xdbeafe, 1);
    const label = this.add.text(0, -84, fallbackName, { fontSize: '18px', color: '#f8fafc', fontStyle: 'bold' }).setOrigin(0.5);
    const hpBg = this.add.rectangle(0, -62, 126, 10, 0x111827, 1).setOrigin(0.5);
    const hpFill = this.add.rectangle(-63, -62, 126, 10, 0x22c55e, 1).setOrigin(0, 0.5);
    const stat = this.add.text(0, 92, '방어 0 · 에너지 0', { fontSize: '13px', color: '#bfdbfe' }).setOrigin(0.5);

    const hitArea = this.add.zone(0, 0, 180, 190).setOrigin(0.5).setInteractive({ useHandCursor: true });
    hitArea.on('pointerover', (pointer) => hoverHooks.onHover?.(actorKey, pointer?.event));
    hitArea.on('pointermove', (pointer) => hoverHooks.onHover?.(actorKey, pointer?.event));
    hitArea.on('pointerout', () => hoverHooks.onHoverOut?.(actorKey));

    container.add([shadow, body, shine, ring, label, hpBg, hpFill, stat, hitArea]);
    return { container, label, hpFill, stat };
  }

  layout(width, height) {
    this.bg.clear();
    const c1 = Phaser.Display.Color.HexStringToColor('#274690').color;
    const c2 = Phaser.Display.Color.HexStringToColor('#0d1b3d').color;
    const c3 = Phaser.Display.Color.HexStringToColor('#060b1f').color;
    this.bg.fillGradientStyle(c1, c1, c2, c3, 1);
    this.bg.fillRect(0, 0, width, height);
    this.floor.setSize(width, height * 0.34);
    this.floor.setPosition(0, height * 0.66);

    this.vsText.setPosition(width * 0.5, height * 0.42);
    this.player.container.setPosition(width * 0.24, height * 0.54);
    this.enemy.container.setPosition(width * 0.76, height * 0.54);
    this.infoLeft.setPosition(24, 18);
    this.infoRight.setPosition(width - 24, 18);
  }

  applySnapshot(snapshot) {
    if (!snapshot) return;
    this.player.label.setText('플레이어');
    this.player.hpFill.displayWidth = 126 * safeRate(snapshot.playerHp, snapshot.playerMaxHp);
    this.player.stat.setText(`방어 ${snapshot.playerBlock} · 에너지 ${snapshot.playerEnergy}`);

    this.enemy.label.setText(snapshot.enemyName || '적');
    this.enemy.hpFill.displayWidth = 126 * safeRate(snapshot.enemyHp, snapshot.enemyMaxHp);
    this.enemy.stat.setText(`방어 ${snapshot.enemyBlock} · 에너지 ${snapshot.enemyEnergy}`);

    this.infoLeft.setText(`라운드 ${snapshot.roundLabel}\n적 의도: ${snapshot.enemyIntent}`);
    this.infoRight.setText(`손패 ${snapshot.handCount}장 · 사용 가능 ${snapshot.playableCount}장\n턴: ${snapshot.turnOwner} / ${snapshot.stateLabel}`);
  }
}

export function createPhaserBattle({ parent, onHover, onHoverOut }) {
  hoverHooks = { onHover, onHoverOut };

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 960,
    height: 330,
    backgroundColor: '#060b1f',
    scene: [BootScene, BattleScene],
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: '100%',
      height: 330
    }
  });

  return {
    render(snapshot) {
      const scene = game.scene.getScene('BattleScene');
      if (scene?.scene?.isActive()) scene.applySnapshot(snapshot);
    }
  };
}
