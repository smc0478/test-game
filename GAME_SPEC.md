# GAME_SPEC.md

## Spec Version
- **Version:** v0.8.0
- **Project:** Synergy Turn Card Battle
- **Owner Role:** Producer (Game Designer)
- **Language:** Korean
- **Last Updated:** 2026-02-13

## 1) Design Goal
v0.8은 v0.7의 정보 루프를 확장해 **전투 가시성 강화 + 카드 재미 요소 확장**을 목표로 한다.
핵심은 전투 화면과 분리된 도감 페이지, 플레이어 카드 사용 히스토리, 변칙 카드 효과 추가다.

## 2) Scope

### Scope In (v0.8)
- 상태 머신:
  - `ready`
  - `planning`
  - `playerTurn`
  - `enemyTurn`
  - `resolution`
  - `deckBuild`
  - `gameOver`
  - `runComplete`
- UI/정보 루프 확장:
  - 카드 도감을 `codex.html` 별도 페이지로 분리.
  - 메인 전투 UI에 `최근 사용 카드 12개` 히스토리 패널 추가.
- 카드 풀 34장(기존 31 + 신규 3).
- 특이 효과 추가:
  - `rewind` (직전 사용 카드 효과 재발동)
  - `gamble` (무작위 보상 1개 발동)

### Scope Out (v0.8)
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
- `C032 시간 되감기`: 직전 사용 카드 효과를 비용 없이 재발동
- `C033 카이오스 잭팟`: 무작위로 폭딜/방어/템포 중 1개 발동
- `C034 프리즘 잔상`: 공격 11 후 직전 카드 효과 재발동

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

## 7) Deck Build Rule
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

### v0.8.0 (2026-02-13)
- 카드 도감을 메인 화면 내 리스트에서 `codex.html` 별도 페이지로 분리.
- 전투 UI에 `최근 사용 카드 12개` 히스토리 패널을 추가.
- 카드 풀을 34장(C032~C034 추가)으로 확장.
- 신규 효과 2종(`rewind`, `gamble`) 추가.

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
