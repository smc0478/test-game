# ARCHITECTURE.md (v0.7)

## 모듈 구성
- `src/data.js`: 카드/적/지역 데이터와 카드 아트 생성.
- `src/gameEngine.js`: 상태 머신, 전투 로직, 보상/덱정리/도감 선택 처리.
- `src/ui.js`: DOM 바인딩 및 렌더링.
- `game.js`: 엔진과 UI 이벤트 연결.

## 상태 머신
`ready -> planning -> playerTurn -> enemyTurn -> resolution -> deckBuild -> (next round)`

### v0.7 보강 포인트
- `deckBuild`에서 `rewardAccepted`/`removedInDeckBuild` 플래그로 보상-정리 절차를 분리.
- `discover` 효과는 `discoverChoices` 패널을 통해 playerTurn 중 임시 선택 흐름을 제공.

## 데이터 일관성
- 덱 제거 시 `deck`, `drawPile`, `discardPile`, `hand`에서 동일 ID를 동시 제거.
- 카드 필드는 `description`을 포함해 UI 설명 품질을 보장.
