# ARCHITECTURE.md (v1.2)

## 모듈 구성
- `src/data.js`: 카드/적/지역/경로 테이블 데이터.
- `src/gameEngine.js`: 상태 머신, 분기 선택, 전투/보상/라운드 전이, 저장/복원 트리거.
- `src/storage.js`: localStorage 기반 런 스냅샷 및 명예의 전당 기록 관리.
- `src/ui.js`: 전투/보상/분기 UI 렌더링 + 시너지 설명 패널.
- `game.js`: 엔진과 UI 이벤트 연결.
- `hall.js`: 명예의 전당 페이지 렌더링.

## 상태 머신
`ready -> planning -> playerTurn -> enemyTurn -> resolution -> deckBuild -> routeSelect -> (next round)`

## 저장/명예의 전당
- 진행 중 상태는 액션 단위로 localStorage에 저장.
- `gameOver`/`runComplete` 시 런 스냅샷은 삭제하고 결과를 명예의 전당에 기록.
- 명예의 전당은 최근 30회 결과를 유지.


## Enemy Scaling & Multi-Action Flow (v1.3)
- 라운드 인덱스를 기반으로 `threatLevel`을 계산한다.
- `beginTurn(enemy)`에서 에너지/드로우 보너스를 반영한다.
- `enemyTurn()`은 최대 행동 수(기본 1 + 보너스)를 루프로 실행하며, 매 행동마다 `chooseEnemyCard()`를 재호출한다.
- 루프 중 사망 판정이 발생하면 즉시 `resolution`으로 전이한다.
