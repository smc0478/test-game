# Synergy Turn Card Battle v0.3 카드 설계

## 카드 구성 요약
v0.3 카드 풀은 총 12장 고정입니다.

- **공격(attack) 6장**: 즉시 피해 + 콤보 마무리 담당
- **스킬(skill) 6장**: 블록/드로우/버프/방깎으로 연쇄 플레이 지원

문양은 `Flame`, `Leaf`, `Gear`, `Void` 4종이며, v0.3에서는 문양 시너지에 더해 **콤보 체인 기반 버스트 보상**을 추가했습니다.

## 카드 리스트 (v0.3)
### 공격 카드
- **C001 Ember Strike (Flame, cost 1, 7)**
- **C002 Blaze Rush (Flame, cost 1, 8)**
- **C003 Thorn Jab (Leaf, cost 1, 6)**
- **C004 Cog Shot (Gear, cost 1, 6)**
- **C005 Null Pierce (Void, cost 1, 6)**
- **C012 Abyss Cut (Void, cost 2, 12)**

### 스킬 카드
- **C006 Bark Guard (Leaf, cost 1, 8 block)**
- **C007 Clockwork Guard (Gear, cost 1, 7 block)**
- **C008 Spark Cycle (Gear, cost 1, draw 2)**
- **C009 Ashen Focus (Flame, cost 1, next attack +3)**
- **C010 Void Echo (Void, cost 1, reduce block 3)**
- **C011 Verdant Pulse (Leaf, cost 2, 12 block)**

## 도파민 설계 포인트 (기획 의도)
### 1) 문양 시너지 + 콤보 체인 이중 보상
- 기존 문양 2회 시너지(Flame/Leaf/Gear/Void)로 기본 보상을 확보합니다.
- 동시에 **서로 다른 문양을 연속 사용**하면 콤보가 올라 추가 점수를 얻습니다.
- 플레이어는 “같은 문양 반복으로 즉시 효율” vs “문양 교차로 고점 버스트”를 매 턴 선택하게 됩니다.

### 2) 턴 내 피크 경험: Prism Burst
- 콤보 체인 4 달성 시 턴당 1회 **Prism Burst**를 즉시 발동합니다.
- 피해+방어를 동시에 제공해 공격/생존 모두 강화되어 체감 파워가 큽니다.
- 점수 보너스를 함께 지급해 전투 성공과 스코어 쾌감을 연결합니다.

### 3) 연쇄 시너지 보상: Adrenaline
- 서로 다른 시너지 2개 이상이 켜지는 순간 추가 에너지와 드로우를 제공해 “한 턴 폭발”을 만듭니다.
- 운보다 설계된 순서 플레이로 트리거 가능해, 숙련도가 재미로 이어집니다.

## 기획자 제안: 시너지 도파민을 더 키우는 방법
- **시각 강조**: 콤보 3/4 도달 시 카드 프레임 발광 및 화면 진동을 추가해 체감 강화.
- **사운드 계단화**: 콤보 수치별 효과음을 단계적으로 강화해 기대감을 누적.
- **피니시 보너스 선택지**: Prism Burst 발동 시 피해/방어/드로우 중 1개를 선택하게 해 전략성과 몰입 강화.
- **문양 교차 미션**: "이번 턴 Flame→Void로 마무리" 같은 소형 미션을 점수 보너스와 연결.

## 밸런스 노트
- v0.3은 단일 전투 Vertical Slice 범위를 유지하며, 고점 보상을 추가하되 확률 RNG는 늘리지 않았습니다.
- 모든 핵심 보상은 상태 머신과 수치 로직에서 재현 가능한 규칙으로 정의했습니다.
