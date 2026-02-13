# Developer Guide v1.2

## 개발 원칙
- GAME_SPEC 우선
- 상태 머신 우회 금지
- 분기/라운드 규칙 변경 시 문서 동시 업데이트
- localStorage 키 변경 시 `hall.js`, `src/storage.js`를 함께 점검

## 빠른 검증
- `node --check game.js`
- `node --check hall.js`
- `node --check src/gameEngine.js`
- `node --check src/ui.js`
- `node --check src/storage.js`
- `python3 -m http.server 8000`


## 버그 회귀 테스트 규칙
- 버그를 수정할 때는 `tests/bugs/*.test.mjs`에 재현 테스트를 먼저 만든다.
- 권장 순서: 재현 테스트 작성(실패) → 코드 수정 → 동일 테스트 재실행(PASS).
- 예시 실행:
  - `node tests/bugs/round1-enemy-energy-cap.test.mjs`
- QA 보고서에는 테스트 명령과 결과를 함께 기록한다.
