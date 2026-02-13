# GAME_SPEC.md

## Spec Version
- **Version:** v0.6.0
- **Project:** Synergy Turn Card Battle
- **Owner Role:** Producer (Game Designer)
- **Language:** Korean
- **Last Updated:** 2026-02-13

## 1) Design Goal
v0.6은 v0.5 기반 전투에 **예측-대응 루프**를 추가한다.
핵심은 적 의도(다음 행동) 공개, 의도 반전 카드, 의도 조건부 카드 도입으로 플레이 결정을 강화하는 것이다.

## 2) Scope

### Scope In (v0.6)
- 상태 머신:
  - `ready`
  - `planning` (신규)
  - `playerTurn`
  - `enemyTurn`
  - `resolution`
  - `deckBuild`
  - `gameOver`
  - `runComplete`
- 3개 지역, 6라운드 런 유지.
- 카드 풀 26장(기존 24 + 신규 2).
- 카드 이미지(data URI SVG) 유지.
- 신규 효과:
  - `swapIntent`: 적 의도를 공격↔스킬 반전.
  - `ifEnemyIntent`: 적 의도 조건 충족 시 추가 효과.

### Scope Out (v0.6)
- 저장/상점/맵 분기/멀티플레이.
- 영구 메타 성장.

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
- `id`, `name`, `family`, `type`, `energyCost`, `baseValue`, `sigil`, `image`, `effect[]`

문양(`sigil`): Flame / Leaf / Gear / Void

신규 카드:
- `C025 프리즘 전환`: 적 의도 반전 + 드로우 1
- `C026 공허 역류`: 공격 10, 적 의도가 공격이면 추가 공격 6

## 5) Synergy & Burst Rules
- 동일 문양 2회 이상 사용 시 시너지 활성.
- Flame: 공격 추가 +3
- Leaf: 방어 추가 +3
- Gear: 드로우 +1
- Void: 유지
- 풀스펙트럼(4문양): 점수 +40, 턴 점수 배수 ON
- 콤보 4: 프리즘 버스트(피해 8 + 방어 8 + 점수 20)
- 서로 다른 시너지 2개: 아드레날린(+1 에너지, +1 드로우, 점수 12)

## 6) Enemy Intent Rule (신규)
- `planning` 상태에서 적이 다음 사용할 카드 의도를 확정.
- UI에 적 의도 텍스트를 표시.
- 플레이어는 의도 기반 대응 카드를 사용할 수 있다.

## 7) Score Rules
- 플레이어 공격 카드 사용: +10
- 플레이어 스킬 카드 사용: +8
- 라운드 승리: +100
- 고체력(HP 40+) 승리: +30
- 런 클리어: +200
- 패배: 최종 점수 0

## 8) Iteration Loop Policy
- 신규 기능 루프: Producer → Engineer → QA → Docs → PR
- 스펙 변경 루프(버전 업): 상태/카드/공식 중 2개 이상 동시 변경 시 실행
- 버그 수정 루프: 스펙 변경 없이 QA ↔ Engineer 반복

## 9) Required Files
- `index.html`
- `style.css`
- `game.js`

## Change Log

### v0.6.0 (2026-02-13)
- 상태 머신에 `planning` 상태를 추가.
- 적 의도 공개/반전 시스템 도입.
- 신규 카드 2장(C025~C026) 추가.
- 엔진/렌더링/데이터 모듈 분리로 유지보수 구조 개선.

### v0.5.0 (2026-02-13)
- `family` 시스템 및 신규 카드 4장(C021~C024) 추가.
