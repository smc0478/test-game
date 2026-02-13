# QA Report (P0 Validation) - v0.5

| ID | Area | Check | Result |
|---|---|---|---|
| P0-01 | 상태 머신 | 허용 전이만 수행 (`ready -> playerTurn -> enemyTurn -> resolution -> ...`) | PASS |
| P0-02 | 카드 스펙 | 모든 카드에 `family` 필드 존재 및 렌더링 확인 | PASS |
| P0-03 | 고유 효과 | `혈화 강타(C021)` 사용 시 자가 피해 후 공격 적용 확인 | PASS |
| P0-04 | 동명 공명 | `연쇄 톱니(C022)` 동일 턴 재사용 시 `echoAttack` 발동 확인 | PASS |
| P0-05 | 전 턴 기억 | `회귀 낙인(C023)`이 전 턴 `voidMark` 사용 시 보너스 발동 확인 | PASS |
| P0-06 | Leaf 기억 트리거 | `재생 방진(C024)`이 전 턴 `bark` 사용 시 회복 추가 확인 | PASS |
| P0-07 | 취약 디버프 | 턴 시작 시 `vulnerable` 1 감소 확인 | PASS |
| P0-08 | 카드 이미지 | 신규 카드 포함 이미지(data URI) 렌더링 확인 | PASS |
