# Synergy Turn Card Battle v1.6 문서

## 게임 소개
v1.6은 분기형 10라운드 전투에 **실전형 HUD 레이아웃**, **전장 초상 오버레이**, **리밸런싱된 시너지/점수 규칙**을 결합한 버전입니다.

## 핵심 요소
- 상태 머신: `ready -> planning -> playerTurn -> enemyTurn -> resolution -> deckBuild -> routeSelect`
- 캔버스 기반 전장 렌더링 + 턴 전환 펄스 애니메이션 + VS 오버레이 전장 초상
- 중단 3열 스탯 패널 + 하단 전투 조작 바(턴 종료/상태 안내)
- localStorage 자동 저장 + 이어하기/저장 초기화
- 명예의 전당(`hall.html`) 통계/기록 확인
- 지역 6개 / 적 14종 / 카드 100장

## 실행 방법
1. `python3 -m http.server 8000`
2. `http://localhost:8000`
3. 전투 화면에서 `새 런 시작` 또는 `이어하기`
