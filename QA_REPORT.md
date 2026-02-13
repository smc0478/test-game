# QA Report (P0 Validation) - v1.1

| ID | Area | Check | Result |
|---|---|---|---|
| P0-01 | 상태 머신 | `deckBuild -> routeSelect -> planning` 전이 확인 | PASS |
| P0-02 | 라운드 | 총 10라운드 카운트 노출 확인 | PASS |
| P0-03 | 분기 | 경로 3개 후보가 라운드 종료 후 노출되는지 확인 | PASS |
| P0-04 | 경로 효과 | 시작 방어/드로우/적HP/적방어 보정 적용 확인 | PASS |
| P0-05 | 콘텐츠 | 지역 6개/적 14종 데이터 로딩 확인 | PASS |
| P0-06 | 도감 | 카드/적/지역 섹션 렌더링 확인 | PASS |


# QA Report (P0 Validation) - v1.5.1

| ID | Area | Check | Result |
|---|---|---|---|
| P0-07 | 전장 UI | 적 변경 시 적 초상화가 아키타입별로 갱신되는지 확인 | PASS |
| P0-08 | 전장 UI | 플레이어/적 초상 + HP 바가 동시에 노출되는지 확인 | PASS |
| P0-09 | 반응형 | 860px 이하에서 오버레이 요소 겹침 여부 확인 | PASS |


## Bug Regression Script Log
| Bug ID | Script | Command | Result | Note |
|---|---|---|---|---|
| BUG-ROUND1-ENERGY | `tests/bugs/round1-enemy-energy-cap.test.mjs` | `node tests/bugs/round1-enemy-energy-cap.test.mjs` | PASS | 1라운드 적 에너지 상한 회귀 검증 |
| BUG-VAMP-OVERKILL | `tests/bugs/vamp-lifesteal-overkill.test.mjs` | `node tests/bugs/vamp-lifesteal-overkill.test.mjs` | PASS | 흡혈 회복량이 실제 피해(오버킬 제외) 기준인지 검증 |
| BUG-VAMP-BLOCKED-DAMAGE | `tests/bugs/vamp-lifesteal-blocked-damage.test.mjs` | `node tests/bugs/vamp-lifesteal-blocked-damage.test.mjs` | PASS | 수정 전 FAIL(회복 32), 수정 후 PASS(실피해 0일 때 회복 0) 확인 |
