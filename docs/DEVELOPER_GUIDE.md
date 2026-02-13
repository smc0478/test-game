# Developer Guide v1.1

## 개발 원칙
- GAME_SPEC 우선
- 상태 머신 우회 금지
- 분기/라운드 규칙 변경 시 문서 동시 업데이트

## 빠른 검증
- `node --check game.js`
- `node --check src/gameEngine.js`
- `node --check src/ui.js`
- `node --check src/data.js`
- `python3 -m http.server 8000`
