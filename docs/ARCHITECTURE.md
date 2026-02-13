# ARCHITECTURE.md (v1.1)

## 모듈 구성
- `src/data.js`: 카드/적/지역/경로 테이블 데이터.
- `src/gameEngine.js`: 상태 머신, 분기 선택, 전투/보상/라운드 전이.
- `src/ui.js`: 전투/보상/분기 UI 렌더링.
- `game.js`: 엔진과 UI 이벤트 연결.

## 상태 머신
`ready -> planning -> playerTurn -> enemyTurn -> resolution -> deckBuild -> routeSelect -> (next round)`

## 분기 시스템
- 라운드 종료 후 보상 단계를 끝내면 `routeSelect`로 이동.
- 매 라운드 3개 경로 후보를 제시.
- 경로는 `지역 + 적 + 모디파이어` 조합으로 구성.
