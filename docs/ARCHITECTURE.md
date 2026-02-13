# Synergy Turn Card Battle v0.1 아키텍처

## 상태 머신 설명
게임은 문자열 상수 상태를 중심으로 동작합니다.

- `ready`
- `playerTurn`
- `enemyTurn`
- `resolution`
- `gameOver`

`TRANSITIONS` 맵으로 허용 전이만 통과시키고, `transitionTo(nextState)`에서 유효하지 않은 점프를 차단합니다. 상태 진입 시 `enterState(state)`가 단 1회 실행되어 턴 시작, AI 루프, 종료 처리 등 상태별 진입 효과를 담당합니다.

## 카드 객체 구조
카드 데이터는 `CARD_POOL`에 고정 목록으로 정의되며, 각 객체는 아래 필드를 포함합니다.

- `id`
- `name`
- `type` (`attack` | `skill`)
- `energyCost`
- `baseValue`
- `sigil` (`Flame` | `Leaf` | `Gear` | `Void`)

덱 구성 시 `buildDeck()`에서 카드 ID를 원본 풀과 매핑해 복제(`structuredClone`)하고, 덱 최대 12장을 검증합니다.

## 덱/드로우 구조
각 액터(Player/Enemy)는 아래 존을 독립적으로 가집니다.

- `deck`: 초기 덱 정의
- `drawPile`: 실제 드로우 대상
- `hand`: 손패
- `discardPile`: 사용/턴 종료 후 이동

`startBattle()`에서 양측 드로우 더미를 셔플 초기화하고, `startTurn(actor)`에서 매 턴 5장 드로우를 시도합니다. `drawCards()`는 손패 최대 8장을 강제하며, 드로우 더미가 비면 버림더미를 셔플해 재사용합니다.

## 턴 처리 로직
### 1) 전투 시작
- `startBattle()`
  - 상태/턴/점수 리셋
  - 플레이어/적 액터 재생성
  - 턴 시작 상태로 전이

### 2) 플레이어 턴
- `startTurn(game.player)`로 블록/에너지/턴 내 시너지 상태를 초기화
- `playerPlayCard(index)`가 카드 사용을 처리
- 에너지 소진 또는 플레이 불가 시 `endPlayerTurn()`

### 3) 적 턴
- `enemyLoop()`가 에너지와 플레이 가능 여부를 기준으로 반복
- `enemyChooseCard()` 우선순위:
  1. 처치 가능한 공격 카드(치명타)
  2. 최대 즉시 피해 카드
  3. HP 25 이하일 때 최대 방어 카드
  4. 그 외 손패 순서 첫 카드

### 4) 해상도/종료
- `resolveBattleState()`에서 승패/동시 KO/점수 보너스 판정
- 생존 시 다음 플레이어 턴, 종료 조건 충족 시 `gameOver`

## 시너지 및 배수 계산 구조
시너지 로직은 카드 해결 경로(`resolveCard`) 안에서 순차적으로 적용됩니다.

1. `maybeActivateSynergy(actor, sigil)`
   - 현재 턴 문양 카운트 증가
   - 2회째 이상이면 해당 문양 시너지 활성
   - 4문양 모두 1회 이상이면 턴 점수 x2 활성 + 턴당 1회 +20
2. `computeCardEffect(...)`
   - Flame 시너지: 공격 피해 +3
   - Leaf 시너지: 방어도 +3
   - C008/C009/C010은 전용 효과 타입(draw/buffAttack/reduceBlock)
3. `applyEffect(...)`
   - 실제 HP/Block/Draw/Buff 반영
4. `applyScoreForCard(...)`
   - 기본 점수(공격 10 / 스킬 8)
   - Void 시너지 x1.5(내림)
   - 턴 배수 x2(내림)
5. Gear 시너지 활성 카드일 경우 추가 드로우 +1

## 주요 함수 설명
- `createActor(name, maxHp, deck)`: 전투 단위 액터 상태 생성
- `buildDeck(cardIds)`: 카드 ID 기반 덱 생성, 12장 제한 검증
- `transitionTo(nextState)`: 상태 전이 유효성 검사 + 진입 처리
- `startBattle()`: 전투 초기화 엔트리
- `startTurn(actor)`: 턴 시작 초기화(블록/에너지/시너지 리셋)
- `resolveCard(actor, target, handIndex)`: 카드 1장 해결의 메인 파이프라인
- `computeCardEffect(...)`: 카드별 수치 효과 계산
- `applyEffect(effect, actor, target, card)`: 계산 결과를 상태에 적용
- `enemyChooseCard(actor, target)`: 적 AI 카드 선택
- `enemyLoop()`: 적 턴 자동 실행 루프
- `resolveBattleState()`: 승패 및 종료 점수 처리
- `render()/renderHand()/renderSynergy()`: UI 갱신 계층
