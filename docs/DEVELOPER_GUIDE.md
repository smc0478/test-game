# Developer Guide v0.6

## 개발 원칙
- GAME_SPEC 우선
- 상태 머신 우회 금지
- 스펙 변경(버전 업) 시 문서 동시 업데이트

## 빠른 검증
- `node --check game.js`
- `node --check src/gameEngine.js`
- `python3 -m http.server 8000`

## 루프 실행 기록
- 신규 기능 루프: 적 의도 공개/대응 카드 추가
- 스펙 변경 루프(버전 업): `planning` 상태 + 카드 풀 확장 + 신규 효과
- 버그 수정 루프: 적 턴 종료 후 전이 혼선 보정

## 협업 메모
- Producer: 의도 기반 전투 강화 요청
- Engineer: 모듈 분리 + 신규 효과 구현
- Docs: 변경 근거/테스트 절차/리스크 문서화
