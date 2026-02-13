# GAME_SPEC.md

## Spec Version
- **Version:** v0.7.0
- **Project:** Synergy Turn Card Battle
- **Owner Role:** Producer (Game Designer)
- **Language:** Korean
- **Last Updated:** 2026-02-13

## 1) Design Goal
v0.7은 v0.6의 의도 대응 전투를 확장해 **덱 최적화 루프와 정보 루프**를 강화한다.
핵심은 라운드 보상 단계에서의 카드 제거, 카드 도감 기반 정보 제공, 특이 효과 카드 확장이다.

## 2) Scope

### Scope In (v0.7)
- 상태 머신:
  - `ready`
  - `planning`
  - `playerTurn`
  - `enemyTurn`
  - `resolution`
  - `deckBuild`
  - `gameOver`
  - `runComplete`
- 라운드 보상 단계에서 다음 기능 추가:
  - 보상 카드 선택 또는 건너뛰기.
  - 덱에서 카드 1장 제거(선택).
- 카드 도감 UI(전체 카드 리스트/효과/설명 표시).
- 카드 풀 31장(기존 26 + 신규 5).
- 특이 효과 추가:
  - `ifEnemyHpBelow`
  - `convertBlockToDamage`
  - `discover`

### Scope Out (v0.7)
- 저장/상점/맵 분기/멀티플레이.
- 영구 메타 성장.
- 카드 업그레이드 단계.

## 3) Core Battle Rules
- 플레이어 HP: 72
- 에너지: 턴당 3
- 드로우: 턴 시작 5
- 손패 최대: 8
- 방어도: 턴 시작 시 0
- 취약(`vulnerable`)은 턴 시작 시 1 감소
- 동시 KO: 패배

## 4) Card System
카드 필수 필드:
- `id`, `name`, `family`, `type`, `energyCost`, `baseValue`, `sigil`, `image`, `effect[]`, `description`

문양(`sigil`): Flame / Leaf / Gear / Void

신규 카드:
- `C027 거울 칼날`: 공격 6, 적 의도가 스킬이면 드로우 1 + 에너지 1
- `C028 결정 장막`: 방어 7, 적 의도가 공격이면 가시 3
- `C029 역전 톱니`: 내 방어도를 모두 피해로 전환
- `C030 영점 폭발`: 공격 9, 적 HP 22 이하일 때 추가 공격 10
- `C031 아카이브 스캔`: 카드 도감 후보 3장 중 1장을 임시 손패 획득

## 5) Synergy & Burst Rules
- 동일 문양 2회 이상 사용 시 시너지 활성.
- Flame: 공격 추가 +3
- Leaf: 방어 추가 +3
- Gear: 드로우 +1
- Void: 유지
- 풀스펙트럼(4문양): 점수 +40, 턴 점수 배수 ON
- 콤보 4: 프리즘 버스트(피해 8 + 방어 8 + 점수 20)
- 서로 다른 시너지 2개: 아드레날린(+1 에너지, +1 드로우, 점수 12)

## 6) Enemy Intent Rule
- `planning` 상태에서 적이 다음 사용할 카드 의도를 확정.
- UI에 적 의도 텍스트를 표시.
- 플레이어는 의도 기반 대응 카드를 사용할 수 있다.

## 7) Deck Build Rule (신규 강화)
- 라운드 승리 후 `deckBuild` 진입.
- 순서:
  1. 보상 카드 선택 또는 건너뛰기.
  2. 덱에서 카드 0~1장 제거.
  3. 다음 라운드 진입.
- 제거는 덱이 5장 이하일 때 금지.

## 8) Score Rules
- 플레이어 공격 카드 사용: +10
- 플레이어 스킬 카드 사용: +8
- 라운드 승리: +100
- 고체력(HP 40+) 승리: +30
- 덱 정리(카드 제거) 성공: +6
- 런 클리어: +200
- 패배: 최종 점수 0

## 9) Iteration Loop Policy
- 신규 기능 루프: Producer → Engineer → QA → Docs → PR
- 스펙 변경 루프(버전 업): 상태/카드/공식 중 2개 이상 동시 변경 시 실행
- 버그 수정 루프: 스펙 변경 없이 QA ↔ Engineer 반복

## 10) Required Files
- `index.html`
- `style.css`
- `game.js`

## Change Log

### v0.7.0 (2026-02-13)
- 카드 풀을 31장으로 확장(C027~C031 추가).
- 특이 효과 3종(`ifEnemyHpBelow`, `convertBlockToDamage`, `discover`) 추가.
- `deckBuild` 단계에 보상 건너뛰기/카드 제거 흐름 추가.
- 카드 도감 UI 추가 및 카드 설명 필드(`description`) 도입.
- 점수 규칙에 덱 정리 보너스(+6) 추가.

### v0.6.0 (2026-02-13)
- 상태 머신에 `planning` 상태를 추가.
- 적 의도 공개/반전 시스템 도입.
- 신규 카드 2장(C025~C026) 추가.
- 엔진/렌더링/데이터 모듈 분리로 유지보수 구조 개선.

### v0.5.0 (2026-02-13)
- `family` 시스템 및 신규 카드 4장(C021~C024) 추가.
