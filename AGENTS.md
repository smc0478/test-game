# AGENTS.md
AI Multi-Agent Development Workflow (Card Battle Project)

이 문서는 본 프로젝트(턴제 카드 배틀 게임)의 AI 역할 분담 및 개발 절차를 정의한다.
모든 AI 및 개발자는 반드시 이 규칙을 따른다.

본 프로젝트는 Slay the Spire 및 Balatro에서 영감을 받은
시너지 중심 턴제 카드 전투를 목표로 한다.

---

# 1. Agent Roles

## 1.1 Producer (Game Designer)

### 책임
- GAME_SPEC.md 작성 및 수정
- 카드 시스템 정의 (카드 수, 효과, 문양/시너지 규칙)
- 덱 구조 및 턴 구조 명확화
- 점수 및 배수 시스템 정의
- Vertical Slice 범위 통제

### 규칙
- v0.x 단계에서는 기능 욕심 금지
- 모든 카드 효과는 수치 기반으로 정의
- 상태 머신을 명확히 정의해야 한다
- 모호한 표현 금지
- 변경 시 Change Log 필수 작성
- QA 피드백 반영 후 버전 증가

### 산출물
- GAME_SPEC.md
- 변경 로그 포함
- Scope In / Out 명확 구분

---

## 1.2 Engineer (Developer)

### 책임
- GAME_SPEC.md 기반 구현
- 상태 머신 정확 구현
- 덱, 드로우, 턴, 카드 사용 로직 구현
- 시너지 및 배수 계산 정확 반영
- 버그 수정

### 규칙
- 스펙 임의 변경 금지
- 수치 정확히 반영
- 파일은 반드시 분리:
  - index.html
  - style.css
  - game.js
- 상태 값은 문자열 상수로 명확히 관리
- 점수 계산은 프레임 기반이 아닌 로직 기반으로 처리
- 구현과 스펙 불일치 시 반드시 보고

### 산출물
- 전체 코드
- 실행 방법
- 변경 요약
- Spec Mapping 체크리스트

---

## 1.3 QA (Tester)

### 책임
- 스펙 대비 로직 정확성 검증
- 시너지/배수 시스템 정확성 검증
- 턴 전환 및 상태 머신 검증
- 승/패 조건 검증
- 점수 계산 검증

### 산출물
- P0 테스트 케이스 목록
- 버그 리포트 템플릿
- 스펙 모호성 지적
- 밸런스 개선 제안 (선택)

---

## 1.4 Documentation Writer (Docs)

### 책임
- 프로젝트 설명 문서 작성
- 시스템 아키텍처 문서 작성
- 카드 설계 의도 문서 작성
- 변경 내역 요약
- 신규 개발자 온보딩 문서 작성

### 규칙
- GAME_SPEC.md와 구현 코드 기반으로 작성
- 스펙과 불일치하지 않도록 한다
- 구조적이고 명확하게 작성
- 추측 금지, 구현 기반 설명

### 산출물
- docs/README.md
- docs/ARCHITECTURE.md
- docs/CARD_DESIGN.md
- docs/CHANGELOG.md
- docs/DEVELOPER_GUIDE.md

---

# 2. Core Architectural Principles

## 2.1 State Machine Structure

카드게임은 반드시 상태 기반으로 동작해야 한다.

기본 구조 예:

- ready
- playerTurn
- enemyTurn
- resolution
- gameOver

상태 전이는 명확해야 하며 중복 실행을 허용하지 않는다.

---

## 2.2 Card System Rules

- 카드 객체는 명확한 속성을 가져야 한다:
  - id
  - name
  - type
  - baseValue
  - sigil (문양)
  - effect()

- 카드 효과는 순수 함수 구조로 작성한다.
- 시너지 및 배수 계산은 별도 로직으로 분리한다.
- 랜덤 요소는 명확히 정의한다.

---

## 2.3 Vertical Slice Philosophy

v0.1에서는 다음만 허용한다:

- 단일 전투
- 제한된 카드 수 (10장 이내)
- 단일 적 타입
- 단일 배틀 화면
- 저장/맵/상점 시스템 금지

---

# 3. Development Flow

1. Producer → GAME_SPEC.md 작성
2. Spec PR 생성
3. Engineer → 구현
4. 로컬 실행 테스트
5. Implementation PR 생성
6. QA 검토
7. 버그 수정 또는 Spec 업데이트
8. 반복

QA 이후:

- 단순 버그 → Engineer Fix Branch
- 시스템 변경 → Producer Spec 업데이트 후 재구현

---

# 4. Git Branch Strategy

## 4.1 Main
- 항상 실행 가능한 상태 유지
- 직접 커밋 금지

## 4.2 Feature Branch
형식:
feature/vX.Y-description

예:
feature/v0.1-core-battle

## 4.3 Fix Branch
형식:
fix/bug-description

예:
fix/synergy-multiplier-error

---

# 5. Commit Message Convention

형식:

feat: 기능 추가
fix: 버그 수정
docs: 문서 변경
refactor: 구조 개선
chore: 설정 변경

예:
feat: implement card synergy multiplier
fix: correct turn transition bug

---

# 6. Pull Request Requirements

PR에는 반드시 포함되어야 한다:

## Summary
구현한 기능 요약

## Changes
변경 사항 목록

## How to Test
실행 방법 및 테스트 방법

## Spec Mapping
- 카드 로직
- 턴 구조
- 시너지 시스템
- 승/패 조건
- 점수 시스템

## Risks / TODO
남은 리스크 또는 확장 계획

---

# 7. Forbidden Actions

- 스펙 없는 카드 추가 금지
- main 브랜치 직접 커밋 금지
- 시너지 계산 임의 수정 금지
- 상태 머신 무시 구현 금지
- QA 생략 금지

---

# 8. Definition of Done

기능 완료 조건:

- 전투 1회 정상 완주 가능
- 콘솔 에러 없음
- 카드 효과 정확 작동
- 시너지 및 배수 계산 정확
- 승/패 조건 정상 작동
- PR 생성 완료

---

# 9. Iteration Rule

- 한 번에 한 기능만 추가
- 카드 추가 시 반드시 스펙 수정
- 시너지 변경 시 버전 증가
- QA 승인 후 병합

---

# 10. Project Goal

턴제 카드 전투 시스템을
명확한 수치 기반 스펙과
역할 분리 구조를 유지하며
안정적으로 발전시키는 것.
