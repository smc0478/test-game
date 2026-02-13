# Developer Guide v1.2

## 개발 원칙
- GAME_SPEC 우선
- 상태 머신 우회 금지
- 분기/라운드 규칙 변경 시 문서 동시 업데이트
- localStorage 키 변경 시 `hall.js`, `src/storage.js`를 함께 점검
- 카드/적/지역 데이터 변경 시 도감(`codex.html`, `codex.js`)도 같은 커밋에서 반드시 동기화

## 도감 동기화 체크리스트 (필수)
- 카드 변경: `CARD_LIBRARY` 수정 시 도감 카드 수/카드 설명 렌더 확인
- 적 변경: `ENEMY_ARCHETYPES`, `ENEMY_BESTIARY` 수정 시 적 도감 텍스트/패턴 안내 확인
- 지역 변경: `REGIONS` 수정 시 지역 도감 노출 목록 확인
- PR 작성 시 Changes 또는 Spec Mapping에 "도감 동기화 완료" 문구를 반드시 포함

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
