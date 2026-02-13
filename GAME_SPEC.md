# GAME_SPEC.md

## Spec Version
- **Version:** v0.5.0
- **Project:** Synergy Turn Card Battle
- **Owner Role:** Producer (Game Designer)
- **Language:** Korean
- **Last Updated:** 2026-02-13

## 1) Design Goal
v0.5는 v0.4 런 구조를 유지하면서 **카드 고유 메커닉**을 강화한다.
핵심은 “카드마다 다른 리스크/보상”, “동명 계열 카드 공명”, “전 턴 사용 기억 기반 트리거”를 도입해 단순 드로우/공격 반복을 탈피하는 것이다.

## 2) Scope

### Scope In (v0.5)
- 상태 머신:
  - `ready`
  - `deckBuild`
  - `playerTurn`
  - `enemyTurn`
  - `resolution`
  - `gameOver`
  - `runComplete`
- 3개 지역, 총 6라운드 런 유지.
- 적 6종 유지 + 신규 카드 대응 덱 조정.
- 카드 풀 24장(기존 20 + 신규 4).
- 카드 필드에 `family` 추가.
- 카드 고유 효과 확장:
  - 자가 피해 후 고화력 공격(`selfDamage`)
  - 같은 `family`를 같은 턴에 다시 썼을 때 추가 효과(`echoAttack`)
  - 전 턴 `family` 사용 기억 조건(`ifLastTurnFamily`)
- 카드 아트는 계속 이미지(data URI SVG) 사용.

### Scope Out (v0.5)
- 저장/상점/맵 분기/멀티플레이.
- 영구 메타 성장.

## 3) Core Battle Rules
- 플레이어 HP: 72
- 에너지: 턴당 3
- 드로우: 턴 시작 5
- 손패 최대: 8 (초과 드로우 시 소각)
- 방어도: 턴 시작 시 0으로 리셋
- 취약(`vulnerable`)은 턴 시작 시 1 감소 (최소 0)
- 동시 KO: 패배

## 4) Region & Round Goal
- 지역 1: 잿빛 협곡
- 지역 2: 기계 정원
- 지역 3: 공허 성채
- 최종 목표: 6라운드 클리어 후 `runComplete` 도달

## 5) Card System
카드 필수 필드:
- `id`, `name`, `family`, `type`, `energyCost`, `baseValue`, `sigil`, `image`, `effect[]`

문양(`sigil`): Flame / Leaf / Gear / Void

신규 카드(예시):
- `C021 혈화 강타`: 자가 피해 3 후 공격 14
- `C022 연쇄 톱니`: 공격 5, 같은 턴 동일 family 재사용 시 추가 공격 6
- `C023 회귀 낙인`: 취약 1, 전 턴 `voidMark` 사용 시 드로우+에너지 보너스
- `C024 재생 방진`: 방어 6, 전 턴 `bark` 사용 시 회복 4

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

### v0.5.0 (2026-02-13)
- 카드 시스템에 `family`를 추가해 동명 카드 공명/전 턴 기억 로직 도입.
- 신규 카드 4장(C021~C024) 추가로 카드 고유 메커닉 강화.
- 자가 피해형 리스크 카드 및 조건부 트리거 카드 추가.
- 취약 디버프의 턴 감소 규칙 명시 및 구현 반영.
- 적 덱 구성/체력을 신규 카드 메타에 맞게 조정.

### v0.4.0 (2026-02-13)
- 지역/라운드 기반 런 구조 도입 (3지역, 6라운드).
- 전투 승리 후 카드 선택 덱 빌딩 추가.
- 적 타입을 1종에서 6종으로 확장.
- 카드 풀을 20장으로 확장하고 카드별 고유 효과 추가.
- 게임 목표(지역 정복/런 클리어) 및 `runComplete`, `deckBuild` 상태 추가.
- 카드 이미지 렌더링을 모든 카드에 적용.

### v0.3.0 (2026-02-13)
- Combo Chain, Prism Burst, Adrenaline 추가.
