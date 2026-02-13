# Synergy Turn Card Battle v0.5 문서

## 게임 소개
v0.5는 라운드 기반 카드 배틀 런입니다.
플레이어는 3개 지역(총 6라운드)을 돌파하며 매 승리 후 카드 1장을 덱에 추가합니다.
이번 버전은 카드 고유성 강화를 위해 **자가 피해**, **동명 카드 공명**, **전 턴 기억 트리거**를 도입했습니다.

## 핵심 요소
- 상태 머신: `ready -> playerTurn -> enemyTurn -> resolution -> deckBuild -> ... -> runComplete/gameOver`
- 카드 풀 24장, 스타터 덱 12장
- 카드별 고유 효과 + 패밀리 기반 조건부 효과
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
