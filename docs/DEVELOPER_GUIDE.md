# Developer Guide v0.4

## 개발 원칙
- GAME_SPEC.md 우선
- 상태 머신 우회 금지
- 카드/시너지 수치 변경 시 스펙 버전 증가

## 빠른 검증
- 구문 체크: `node --check game.js`
- 로컬 실행: `python3 -m http.server 8000`

## 반복 개발 루프
- 신규 기능: Producer -> Engineer -> QA -> Docs -> PR
- 버그 수정: QA <-> Engineer
- 시스템 변경: QA -> Producer(버전 업) -> Engineer -> QA -> Docs
