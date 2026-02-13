# Synergy Turn Card Battle v0.6 문서

## 게임 소개
v0.6은 **적 의도 기반 대응 전투**를 추가한 런형 카드 배틀입니다.
기획자(Producer)가 `planning` 상태와 의도 대응 카드를 스펙화하고,
개발자(Engineer)가 모듈 구조로 구현했으며, 문서 작성자(Docs)가 루프 결과를 정리했습니다.

## 핵심 요소
- 상태 머신: `ready -> planning -> playerTurn -> enemyTurn -> resolution -> deckBuild`
- 카드 풀 26장 (C025~C026 신규)
- 카드 이미지(data URI SVG) 전 카드 적용
- 적 의도 공개 + 의도 반전/조건부 카드 효과
- `src/` 모듈 분리로 유지보수성 개선

## 실행 방법
1. `python3 -m http.server 8000`
2. `http://localhost:8000`
3. `런 시작`

## 문서 인덱스
- `docs/ARCHITECTURE.md`
- `docs/CARD_DESIGN.md`
- `docs/CHANGELOG.md`
- `docs/DEVELOPER_GUIDE.md`
