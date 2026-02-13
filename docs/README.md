# Synergy Turn Card Battle v0.3 문서

## 게임 소개
Synergy Turn Card Battle은 **턴제 카드 전투 + 문양 시너지 + 점수 최적화**를 결합한 브라우저 게임입니다.
v0.3은 기존 문양 시너지 위에 **Combo Chain / Prism Burst / Adrenaline**을 추가해 한 턴 폭발감을 강화했습니다.

## 핵심 시스템 요약
- **상태 머신 전투 흐름**: `ready -> playerTurn -> enemyTurn -> resolution -> gameOver`
- **에너지 경제**: 턴당 에너지 3 + Momentum/Adrenaline으로 추가 에너지 획득 가능
- **문양 시너지(2회)**:
  - Flame: 공격 +3
  - Leaf: 방어 +3
  - Gear: 추가 드로우 +1
  - Void: 카드 점수 x1.5
- **풀 스펙트럼 보너스**: 4문양 완성 시 턴 점수 x2 + 점수 +30
- **콤보 시스템**:
  - 다른 문양 연속 사용 시 체인 증가(최대 4)
  - 체인 3/4에서 카드 점수 추가 보너스
  - 체인 4에서 Prism Burst 발동(피해 8 + 방어 8 + 점수 +20)
- **Adrenaline**: 서로 다른 시너지 2개 활성화 시 턴당 1회 (+1 에너지, 1드로우, 점수 +12)

## 실행 방법
1. 프로젝트 루트에서 정적 서버 실행
   - `python3 -m http.server 8000`
2. 브라우저 접속
   - `http://localhost:8000`
3. `Start Battle` 클릭 후 플레이

## 승패/점수
- **승리**: 적 HP 0 이하
- **패배**: 플레이어 HP 0 이하
- **동시 KO**: 패배 처리
- **v0.3 보너스**: 승리 +140, 승리 시 HP 40 이상 +50

## 문서 인덱스
- `docs/ARCHITECTURE.md`: 상태 머신/데이터 흐름 구조
- `docs/CARD_DESIGN.md`: 카드 역할과 시너지 설계 의도
- `docs/CHANGELOG.md`: 버전별 변경 이력
- `docs/DEVELOPER_GUIDE.md`: 개발/검증/확장 가이드
