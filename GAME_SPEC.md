# GAME_SPEC.md

## Spec Version
- **Version:** v0.4.0
- **Project:** Synergy Turn Card Battle
- **Owner Role:** Producer (Game Designer)
- **Language:** Korean
- **Last Updated:** 2026-02-13

## 1) Design Goal
v0.4는 단일 전투를 넘어 **지역/라운드 기반 런(run)** 구조를 도입한다.
플레이어는 전투 승리 후 카드 보상을 선택하여 덱을 성장시키고, 3개 지역의 적을 순차적으로 격파해 최종 보스를 처치해야 한다.

## 2) Scope

### Scope In (v0.4)
- 상태 머신:
  - `ready`
  - `deckBuild`
  - `playerTurn`
  - `enemyTurn`
  - `resolution`
  - `gameOver`
  - `runComplete`
- 3개 지역, 총 6라운드.
- 지역별/라운드별 적 다양화 (6종).
- 카드 풀 20장, 스타터 덱 12장.
- 전투 승리 시 3장 중 1장 선택 덱 빌딩.
- 카드별 고유 효과(공격/방어/드로우/회복/에너지/가시/취약/흡혈 등).
- 시너지/콤보/프리즘 버스트/아드레날린/모멘텀 유지.
- 카드 아트는 이미지(data URI SVG)로 렌더링.

### Scope Out (v0.4)
- 저장/상점/맵 분기/멀티플레이.
- 영구 메타 성장.

## 3) Core Battle Rules
- 플레이어 HP: 72
- 에너지: 턴당 3
- 드로우: 턴 시작 5
- 손패 최대: 8 (초과 드로우 시 소각)
- 방어도: 턴 시작 시 0으로 리셋
- 동시 KO: 패배

## 4) Region & Round Goal
- 지역 1: 잿빛 협곡
- 지역 2: 기계 정원
- 지역 3: 공허 성채
- 최종 목표: 6라운드 클리어 후 `runComplete` 도달

## 5) Card System
카드 필수 필드:
- `id`, `name`, `type`, `energyCost`, `baseValue`, `sigil`, `image`, `effect[]`

문양(`sigil`): Flame / Leaf / Gear / Void

## 6) Synergy & Burst Rules
- 동일 문양 2회 이상 사용 시 해당 문양 시너지 활성.
- Flame: 공격 추가 +3
- Leaf: 방어 추가 +3
- Gear: 드로우 +1
- Void: 점수 x1.5 (내림)
- 풀스펙트럼(4문양 1회 이상): 점수 보너스 +40, 턴 점수 배수 ON
- 콤보 체인: 다른 문양 연속 시 +1 (최대 4)
- 프리즘 버스트(체인 4 도달, 턴당 1회): 피해 8 + 방어 8 + 점수 +20
- 아드레날린(서로 다른 시너지 2개 활성, 턴당 1회): +1 에너지 +1드로우 +점수 +12
- 모멘텀(턴 3번째 카드 사용 시 1회): +1 에너지

## 7) Enemy Diversity
- 잿불 여우, 철갑 딱정벌레, 기어 센티넬, 가시 드루이드, 공허 수확자, 프리즘 군주
- 적은 각자 다른 카드 덱/체력을 보유
- 행동 우선순위: 치명타 가능 > 저체력 시 스킬 > 높은 즉시 가치 카드

## 8) Score Rules
- 플레이어 카드 사용:
  - 공격 +10
  - 스킬 +8
- 콤보 3:+4 / 콤보 4:+8
- 라운드 승리 +100
- 고체력(HP 40+) 승리 +30
- 런 클리어 +200
- 패배 시 최종 점수 0

## 9) Iteration Loop Policy (PLAYBOOK 반영)
- **신규 기능 루프**: Producer → Engineer → QA → Docs → PR
- **스펙 변경 루프(버전 업)**: QA 피드백 기반 대규모 수정 시 버전 증가 필수
- **버그 수정 루프**: 스펙 변경 없는 경우 QA ↔ Engineer 반복

## 10) Required Files
- `index.html`
- `style.css`
- `game.js`

## Change Log

### v0.4.0 (2026-02-13)
- 지역/라운드 기반 런 구조 도입 (3지역, 6라운드).
- 전투 승리 후 카드 선택 덱 빌딩 추가.
- 적 타입을 1종에서 6종으로 확장.
- 카드 풀을 20장으로 확장하고 카드별 고유 효과 추가.
- 게임 목표(지역 정복/런 클리어) 및 `runComplete`, `deckBuild` 상태 추가.
- 카드 이미지 렌더링을 모든 카드에 적용.

### v0.3.0 (2026-02-13)
- Combo Chain, Prism Burst, Adrenaline 추가.
