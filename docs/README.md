# Synergy Turn Card Battle v1.2 문서

## 게임 소개
v1.2는 분기형 10라운드 전투에 **시너지 효과 안내**, **브라우저 저장/이어하기**, **명예의 전당**을 결합한 버전입니다.

## 핵심 요소
- 상태 머신: `ready -> planning -> playerTurn -> enemyTurn -> resolution -> deckBuild -> routeSelect`
- localStorage 자동 저장 + 이어하기/저장 초기화
- 명예의 전당(`hall.html`) 통계/기록 확인
- 지역 6개 / 적 14종 / 카드 100장

## 실행 방법
1. `python3 -m http.server 8000`
2. `http://localhost:8000`
3. 전투 화면에서 `새 런 시작` 또는 `이어하기`
