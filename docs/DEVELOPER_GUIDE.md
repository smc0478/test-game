# Developer Guide v0.5

## 개발 원칙
- GAME_SPEC.md 우선
- 상태 머신 우회 금지
- 카드/시너지/조건 트리거 수치 변경 시 스펙 버전 증가

## 빠른 검증
- 구문 체크: `node --check game.js`
- 로컬 실행: `python3 -m http.server 8000`

## 반복 개발 루프
- 신규 기능: Producer -> Engineer -> QA -> Docs -> PR
- 버그 수정: QA <-> Engineer
- 시스템 변경: QA -> Producer(버전 업) -> Engineer -> QA -> Docs

## v0.5 구현 체크포인트
- `family` 필드가 모든 카드에 존재하는지 확인
- `echoAttack`, `ifLastTurnFamily`, `selfDamage` 효과 적용 확인
- `lastTurnFamilies`가 턴 종료 시점에 정상 저장/갱신되는지 확인
