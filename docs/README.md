# Synergy Turn Card Battle v0.7 문서

## 게임 소개
v0.7은 **적 의도 대응 전투 + 덱 정리 + 카드 도감 정보 루프**를 포함한 런형 카드 배틀입니다.
스펙 변경 루프(버전 업)를 통해 카드 풀/효과/보상 단계를 동시에 확장했습니다.

## 핵심 요소
- 상태 머신: `ready -> planning -> playerTurn -> enemyTurn -> resolution -> deckBuild`
- 카드 풀 31장 (C027~C031 신규)
- 특이 효과: 체력 임계 추가타, 방어 전환 공격, 도감 기반 임시 획득
- 보상 단계: 카드 선택/건너뛰기 + 불필요 카드 1장 제거
- 카드 도감: 전체 카드 이미지/효과/설명 확인

## 실행 방법
1. `python3 -m http.server 8000`
2. `http://localhost:8000`
3. `런 시작`

## 문서 인덱스
- `docs/ARCHITECTURE.md`
- `docs/CARD_DESIGN.md`
- `docs/CHANGELOG.md`
- `docs/DEVELOPER_GUIDE.md`
