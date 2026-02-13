# Synergy Turn Card Battle v1.1 문서

## 게임 소개
v1.1은 카드 100장 전투에 **분기 경로 선택**, **지역/적 대규모 확장**, **10라운드 장기 런**을 결합한 버전입니다.

## 핵심 요소
- 상태 머신: `ready -> planning -> playerTurn -> enemyTurn -> resolution -> deckBuild -> routeSelect`
- 지역 6개 / 적 14종
- 경로 분기 3선택 + 시작 모디파이어 4종
- 카드 도감/적 도감/지역 도감

## 실행 방법
1. `python3 -m http.server 8000`
2. `http://localhost:8000`
3. `런 시작`
