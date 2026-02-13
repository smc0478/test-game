# QA Report (P0 Validation) - v0.2

| ID | Area | Check | Result |
|---|---|---|---|
| P0-01 | 상태 머신 | 허용 전이만 수행 (`ready -> playerTurn -> enemyTurn -> resolution -> ...`) | PASS |
| P0-02 | 카드 풀 | 12장 카드 풀 및 12장 덱 생성 확인 | PASS |
| P0-03 | 손패 제한 | 손패 8장 초과 드로우 시 소각 로그/처리 확인 | PASS |
| P0-04 | Flame/Leaf 시너지 | 2번째 동일 문양 카드부터 +3 적용 확인 | PASS |
| P0-05 | Gear/Void 시너지 | 해당 카드 해소 시점 기준 추가 드로우/점수 배수 확인 | PASS |
| P0-06 | Momentum | 턴당 3번째 카드 해소 시 +1 에너지, 턴당 1회 제한 확인 | PASS |
| P0-07 | 점수 정책 | 적 카드 해소로 점수 증가하지 않음 확인 | PASS |
| P0-08 | 카드 이미지 | 손패 카드 이미지(data URI) 렌더링 확인 | PASS |
