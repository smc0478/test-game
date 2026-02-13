# ARCHITECTURE.md (v1.7)

## 모듈 구성
- `src/core/battleCore.js`: 상태 머신(`ready/planning/playerTurn/enemyTurn/resolution/gameOver` 포함), 카드 효과 계산, 적 AI, 라운드 전이.
- `src/phaserBattle.js`: Phaser `BootScene` → `BattleScene` 전환, 전투 스테이지 렌더, hover 상호작용.
- `src/ui.js`: DOM 카드/보상/로그/시너지 렌더 + hover 정보 패널 표시.
- `game.js`: core 상태를 scene과 dom에 동기화하는 엔트리.
- `src/storage.js`: localStorage 기반 런 저장/복원.

## 렌더링 계층
1. Phaser 캔버스 (`#game-root`)
2. DOM 오버레이 (`.battle-overlay`, pointer-events: none)
3. 클릭 가능한 덱 정비 패널 (`.canvas-deckbuild-overlay`, pointer-events: auto)

## 입력 계층
- 전투체(플레이어/적) hover: Phaser `setInteractive()`로 처리.
- 카드/보상/경로/버튼 클릭: DOM 이벤트로 처리.
- 패널 레이어는 기본 클릭 차단(`pointer-events: none`)으로 캔버스 입력을 방해하지 않음.

## 상태 동기화
- `createEngine(...onRender)`가 호출될 때마다
  - `render(ui, game, engine)`로 DOM 갱신
  - `battleScene.render(createBattleSnapshot(game))`로 Phaser Scene 갱신
