# Developer Guide (v0.1)

## 프로젝트 구조 설명
루트 기준 핵심 파일은 다음과 같습니다.

- `GAME_SPEC.md`: 기능/수치/상태머신의 단일 진실 공급원(SSOT)
- `index.html`: UI 레이아웃, 버튼/상태/로그 영역
- `style.css`: 스타일 정의
- `game.js`: 상태머신, 카드 로직, AI, 점수 계산, 렌더링
- `docs/*.md`: 문서화 산출물

AGENTS.md 규칙상 구현 파일 분리는 유지해야 하며(`index.html`, `style.css`, `game.js`), 스펙 없는 기능 추가는 금지됩니다.

## 코드 실행 방법
1. 프로젝트 루트에서 실행:
   - `python3 -m http.server 8000`
2. 브라우저 접속:
   - `http://localhost:8000`
3. `Start Battle` 클릭 후 플레이

## 새로운 카드 추가 방법
> v0.1 범위에서는 신규 카드 정의가 금지되어 있습니다. 아래 절차는 차기 버전(v0.2+)에서만 사용하세요.

1. **스펙 선반영 (필수)**
   - `GAME_SPEC.md`의 카드 목록/효과/수치/시너지 영향 업데이트
   - 버전 증가 및 Change Log 기록
2. **코드 반영**
   - `CARD_POOL`에 카드 객체 추가 (`id`, `name`, `type`, `energyCost`, `baseValue`, `sigil`)
   - 필요 시 `computeCardEffect()`와 `applyEffect()`에 효과 타입 확장
   - 덱 구성 로직(`buildDeck`, 초기 덱 ID 목록) 점검
3. **검증**
   - 에너지/손패/드로우/버림/점수/시너지 상호작용 확인
   - 상태 전이와 승패 조건 회귀 테스트

## 시너지 로직 수정 방법
시너지는 카드 해결 파이프라인의 일부이므로, 아래 순서를 유지해야 합니다.

1. `maybeActivateSynergy()`
   - 문양 카운트 증가 시점
   - 2회 트리거 여부
   - 4문양 완성 시 턴 배수/보너스
2. `computeCardEffect()`
   - Flame/Leaf의 수치 증폭 반영
3. `applyScoreForCard()`
   - Void 배수 -> 턴 x2 순서로 점수 배율 적용(내림)
4. `resolveCard()`
   - Gear 시너지의 추가 드로우 후처리 확인

수정 시 스펙의 배수 순서와 정확히 일치해야 하며, 임의 변경은 금지됩니다.

## 버전 관리 규칙
AGENTS.md 기준 규칙을 따릅니다.

- `main` 직접 커밋 금지
- 기능 브랜치: `feature/vX.Y-description`
- 버그 브랜치: `fix/bug-description`
- 커밋 메시지 컨벤션:
  - `feat: ...`
  - `fix: ...`
  - `docs: ...`
  - `refactor: ...`
  - `chore: ...`

## PR 작성 방법
PR 본문에는 아래 섹션을 반드시 포함합니다.

1. **Summary**: 구현 요약
2. **Changes**: 변경 파일/핵심 로직 목록
3. **How to Test**: 실행/재현 절차
4. **Spec Mapping**:
   - 카드 로직
   - 턴 구조
   - 시너지 시스템
   - 승/패 조건
   - 점수 시스템
5. **Risks / TODO**: 남은 리스크, 후속 계획

문서 작업도 동일하게 “스펙 기반, 추측 금지” 원칙을 적용합니다.
