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
| BUG-STALE-CLICK-ENERGY | `tests/bugs/stale-index-double-play-energy.test.mjs` | `node tests/bugs/stale-index-double-play-energy.test.mjs` | PASS | 수정 전 FAIL(에너지 1), 수정 후 PASS(에너지 2)로 중복 클릭 회귀 확인 |
| BUG-PLAYER-ENERGY-CAP | `tests/bugs/player-energy-cap.test.mjs` | `node tests/bugs/player-energy-cap.test.mjs` | PASS | 다음 턴 에너지 보너스가 있어도 플레이어 에너지가 3을 초과하지 않는지 검증 |


## 신규 버그/이슈 탐지 (2026-02-13)

| Bug ID | Area | Repro Command | Result | Observation |
|---|---|---|---|---|
| BUG-LEAF-RETAIN-TEST | 리프 컨셉 테스트 | `node tests/leaf-concepts.test.mjs` | FAIL | `retained block should stay on the next player turn` 검증에서 기대값 18, 실제 10으로 실패. 적 턴에서 방어도가 소모되는 케이스가 테스트 가정과 불일치 가능성 있음. |
| BUG-VOID-BLOOD-PACT-TEST | 보이드 흡혈 컨셉 테스트 | `node tests/void-vamp-concepts.test.mjs` | FAIL | `C034 should spend hp instead of energy` 검증에서 기대값 10, 실제 3으로 실패. 현재 엔진의 플레이어 에너지 상한(3) 로직과 테스트 가정(10)이 충돌하는지 확인 필요. |

### QA 메모
- 위 2건은 테스트 실패를 통해 재현됨.
- 우선순위: 테스트 스펙 정합성 확인(현재 GAME_SPEC 및 엔진 상한 규칙과 기대값 비교) 후, 실제 버그인지 테스트 오탐인지 분류 필요.
