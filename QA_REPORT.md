# QA Report (P0 Validation) - v0.3

| ID | Area | Check | Result |
|---|---|---|---|
| P0-01 | 상태 머신 | 허용 전이만 수행 (`ready -> playerTurn -> enemyTurn -> resolution -> ...`) | PASS |
| P0-02 | 카드 풀 | 12장 카드 풀 및 12장 덱 생성 확인 | PASS |
| P0-03 | 손패 제한 | 손패 8장 초과 드로우 시 소각 로그/처리 확인 | PASS |
| P0-04 | 기본 시너지 | Flame/Leaf/Gear/Void 2회 조건 시 효과 적용 확인 | PASS |
| P0-05 | Momentum | 턴당 3번째 카드 해소 시 +1 에너지, 턴당 1회 제한 확인 | PASS |
| P0-06 | Combo Chain | 다른 문양 연속 사용 시 체인 증가 / 동일 문양 반복 시 1로 리셋 확인 | PASS |
| P0-07 | Prism Burst | 체인 4 도달 시 피해+방어+점수 보너스가 턴당 1회만 발동 확인 | PASS |
| P0-08 | Adrenaline | 서로 다른 시너지 2개 활성화 시 +1 에너지, 1드로우, 점수 보너스 1회 확인 | PASS |
| P0-09 | 적 AI | Flame 시너지 잠재값을 포함한 공격 우선순위 선택 확인 | PASS |
| P0-10 | 점수 정책 | 적 카드 해소로 점수 증가하지 않음 확인 | PASS |
| P0-11 | 카드 이미지 | 손패 카드 이미지(data URI) 렌더링 확인 | PASS |
