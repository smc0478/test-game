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
