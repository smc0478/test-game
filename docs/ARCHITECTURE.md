# Architecture v0.5

## 상태 머신
- `ready`: 대기
- `playerTurn`: 플레이어 행동
- `enemyTurn`: 적 행동
- `resolution`: 승패 판정
- `deckBuild`: 보상 카드 선택
- `gameOver`: 런 실패
- `runComplete`: 런 성공

## 라운드 흐름
1. 라운드 시작 시 지역/적 로드
2. 전투 진행
3. 승리 시 `deckBuild`에서 3장 중 1장 선택
4. 다음 라운드 진입
5. 최종 라운드 승리 시 `runComplete`

## 데이터 구조
- 카드 라이브러리: `CARD_LIBRARY`
  - 필수 키: `id`, `name`, `family`, `type`, `energyCost`, `baseValue`, `sigil`, `effect`
- 지역 정의: `REGIONS`
- 적 아키타입: `ENEMY_ARCHETYPES`
- 런 상태: `game`

## 턴 메모리 아키텍처
- `turnFamilyCounts`: 현재 턴 패밀리 사용 횟수
- `turnFamiliesUsed`: 현재 턴에 사용한 패밀리 집합
- `lastTurnFamilies`: 직전 턴 패밀리 기억 집합
- 조건 효과:
  - `echoAttack`: 같은 턴 동명 패밀리 재사용 조건
  - `ifLastTurnFamily`: 전 턴 패밀리 기억 조건
