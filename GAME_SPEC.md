# GAME_SPEC.md

## Spec Version
- **Version:** v1.2.0
- **Project:** Synergy Turn Card Battle
- **Owner Role:** Producer (Game Designer)
- **Language:** Korean
- **Last Updated:** 2026-02-15

## 1) Design Goal
v1.2는 v1.1의 분기형 10라운드 전투를 유지하면서 **시너지 효과 명시 UI + localStorage 저장/이어하기 + 명예의 전당 통계 페이지**를 제공한다.

## 2) Scope

### Scope In (v1.2)
- 상태 머신:
  - `ready`
  - `planning`
  - `playerTurn`
  - `enemyTurn`
  - `resolution`
  - `deckBuild`
  - `routeSelect`
  - `gameOver`
  - `runComplete`
- 라운드 수 확장: 5 → 10 라운드.
- 지역 확장: 3개 → 6개 (`잿빛 협곡`, `바람숲 능선`, `시계분지`, `폐허 항만`, `심연 관문`, `프리즘 성소`).
- 적 확장: 6종 → 14종.
- 분기 시스템:
  - 라운드 승리 후 보상/덱 정리 완료 시 `routeSelect` 진입.
  - 매 라운드 3개 경로 후보 중 1개 선택.
  - 경로는 `지역 + 적 + 시작 효과(모디파이어)`로 구성.
- 모디파이어(경로 효과):
  - `선제 압박`: 적 시작 방어 +6
  - `보급 지점`: 플레이어 시작 드로우 +1
  - `요새 진입`: 플레이어 시작 방어 +7
  - `지형 우세`: 적 최대 HP -8
- 시너지 정보 UI:
  - Flame/Leaf/Gear/Void 발동 조건과 수치를 전투 화면에서 상시 노출.
  - Burst(동일 문양 3회) 규칙과 점수 +15를 명시.
- 저장/복원:
  - localStorage 기반 자동 저장 (전투/보상/분기 상태).
  - `이어하기`, `저장 초기화` 버튼 제공.
- 명예의 전당:
  - localStorage 기반 최근 30회 런 결과 기록.
  - 승/패, 최종 점수, 최종 지역/적, 승리 기여 카드 기록 표시.
  - 별도 페이지(`hall.html`)에서 통계 확인.

### Scope Out (v1.2)
- 상점/맵 탐험 UI/멀티플레이/클라우드 저장.
- 영구 메타 성장.
- 카드 업그레이드 단계.

## 3) Core Battle Rules
- 플레이어 HP: 84
- 에너지: 턴당 3
- 드로우: 턴 시작 5
- 손패 최대: 8
- 방어도: 턴 시작 시 0
- 취약(`vulnerable`)은 턴 시작 시 1 감소
- 동시 KO: 패배
- 런 길이: 10라운드

## 4) Card System
카드 필수 필드:
- `id`, `name`, `family`, `type`, `energyCost`, `baseValue`, `sigil`, `image`, `effect[]`, `description`

문양(`sigil`): Flame / Leaf / Gear / Void

## 5) Synergy & Burst Rules
- 동일 문양 2회 이상 사용 시 시너지 활성.
- Flame: 공격 추가 +6
- Leaf: 방어 추가 +6
- Gear: 드로우 +1
- Void: 공격 추가 +4 + 공격 시 흡혈 2
- 같은 문양 3회 사용 시 문양 버스트 1회 발동.

## 6) Enemy Intent Rule
- `planning` 상태에서 적이 다음 사용할 카드 의도를 확정.
- 의도 교차(공격↔스킬) 우선 + 직전 카드 반복 회피 우선.

## 7) Deck Build + Route Rule
- 라운드 승리 후 `deckBuild` 진입.
- 순서:
  1. 보상 카드 선택 또는 건너뛰기
  2. 덱에서 카드 0~1장 제거
  3. `routeSelect`에서 다음 경로 선택
  4. 다음 라운드 진입
- 제거는 덱이 5장 이하일 때 금지.

## 8) Score Rules
- 플레이어 공격 카드 사용: +10
- 플레이어 스킬 카드 사용: +8
- 문양 버스트 발동: +15
- 라운드 승리: +100
- 고체력(HP 40+) 승리: +30
- 덱 정리(카드 제거) 성공: +6
- 런 클리어: +200
- 패배: 최종 점수 0

## 9) Required Files
- `index.html`
- `style.css`
- `game.js`
- `hall.html`
- `hall.js`
- `src/storage.js`

## Change Log

### v1.2.0 (2026-02-15)
- 시너지 효과 안내 패널(문양별 발동 수치 + 버스트 규칙)을 전투 화면에 추가.
- localStorage 자동 저장/이어하기/저장 초기화를 추가.
- 명예의 전당 페이지(`hall.html`)를 추가해 최근 30회 런의 승패/점수/최종 적/주요 카드 기록을 제공.


### v1.1.0 (2026-02-14)
- 상태 머신에 `routeSelect`를 추가하고 분기 경로 선택 단계를 구현.
- 런 길이를 10라운드로 확장.
- 지역을 6개로, 적을 14종으로 확장.
- 경로별 시작 효과(모디파이어) 4종을 추가.

### v1.0.0 (2026-02-14)
- 카드 풀을 100장(C001~C100)으로 확장.
- 적 도감(Bestiary)과 추천 덱 운영 가이드를 `codex.html`에 추가.
