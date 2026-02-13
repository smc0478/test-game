# Synergy Turn Card Battle v0.4 문서

## 게임 소개
v0.4는 라운드 기반 카드 배틀 런입니다.
플레이어는 3개 지역(총 6라운드)을 순차적으로 돌파하며, 매 승리 후 카드 1장을 덱에 추가해 성장합니다.

## 핵심 요소
- 상태 머신: `ready -> playerTurn -> enemyTurn -> resolution -> deckBuild -> ... -> runComplete/gameOver`
- 카드 풀 20장, 스타터 덱 12장
- 카드별 고유 효과(드로우/회복/에너지/가시/취약/흡혈 등)
- 문양 시너지 + 콤보 + 버스트 시스템
- 적 6종과 지역별 진행

## 실행 방법
1. `python3 -m http.server 8000`
2. `http://localhost:8000` 접속
3. `런 시작` 클릭

## 문서 인덱스
- `docs/ARCHITECTURE.md`
- `docs/CARD_DESIGN.md`
- `docs/CHANGELOG.md`
- `docs/DEVELOPER_GUIDE.md`
