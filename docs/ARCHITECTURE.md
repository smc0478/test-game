# Architecture v0.6

## 상태 머신
- `ready`
- `planning` (신규)
- `playerTurn`
- `enemyTurn`
- `resolution`
- `deckBuild`
- `gameOver`
- `runComplete`

## 모듈 구조
- `game.js`: 부트스트랩/이벤트 바인딩
- `src/constants.js`: 상태/상수 정의
- `src/data.js`: 카드/지역/적 데이터
- `src/gameEngine.js`: 전투 엔진 및 상태 전이
- `src/ui.js`: 렌더링/DOM 관리
- `src/utils.js`: 공통 유틸

## Producer ↔ Engineer 피드백 반영
- Producer 요청: “적 행동 예측을 전술 축으로 강화”
- Engineer 제안: “planning 상태에서 intent 확정 + UI 노출”
- 합의 결과: `swapIntent`, `ifEnemyIntent` 효과를 스펙/코드에 동시 반영
