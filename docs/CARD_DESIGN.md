# Card Design v0.6

## 설계 변화
v0.6은 고정 화력 중심에서 **의도 대응 중심**으로 확장했습니다.

## 신규 카드
- `C025 프리즘 전환` (Gear/skill)
  - 적 의도 전환(`swapIntent`) + 드로우 1
  - 방어 턴/공격 턴 유연성 확보
- `C026 공허 역류` (Void/attack)
  - 기본 공격 10
  - 적 의도가 공격이면 추가 공격 6 (`ifEnemyIntent`)

## 문양 철학 (유지)
- Flame: 공격 폭발
- Leaf: 방어/회복
- Gear: 자원/전술 전환
- Void: 조건부 고효율
