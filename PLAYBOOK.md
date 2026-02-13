# PLAYBOOK.md
Card Battle Project Multi-Agent Operational Playbook

이 문서는 본 프로젝트의 AI 멀티에이전트 개발 루프를 정의한다.
모든 작업은 AGENTS.md를 기준으로 수행한다.

---

# 1. Overview

이 프로젝트는 턴제 카드 배틀 게임을 스펙 중심 개발 방식으로 발전시킨다.

기본 구조:

Producer → Engineer → QA → Docs → PR → Merge → 반복

모든 기능 추가 또는 변경은 반드시 스펙 기반으로 진행한다.

---

# 2. Initial Development Flow (v0.1 생성)

## Step 1 — Producer

목표:
GAME_SPEC.md 생성 (Vertical Slice)

사용 템플릿:
Producer Template

결과:
- GAME_SPEC.md 생성
- Spec PR 생성

---

## Step 2 — Engineer

목표:
GAME_SPEC.md 기반 구현

사용 템플릿:
Engineer Template

결과:
- index.html
- style.css
- game.js
- Implementation PR 생성

---

## Step 3 — QA

목표:
스펙 대비 동작 검증

사용 템플릿:
QA Template

결과:
- P0 테스트 케이스
- 버그 리포트
- 모호성 지적

---

## Step 4 — Bug Fix (필요 시)

조건:
스펙 변경 없이 수정 가능한 버그일 경우

사용 템플릿:
Bug Fix Engineer Template

루프:
QA → Engineer Fix → QA 반복

---

## Step 5 — Documentation

조건:
v0.1 구현 안정화 이후

생성 문서:
- docs/README.md
- docs/ARCHITECTURE.md
- docs/CARD_DESIGN.md
- docs/CHANGELOG.md
- docs/DEVELOPER_GUIDE.md

사용 템플릿:
Documentation Writer Templates

---

## Step 6 — PR Writer

목표:
PR 설명 자동 생성

사용 템플릿:
PR Writer Template

---

# 3. Iteration Rules

## 3.1 버그 수정 루프

조건:
스펙 변경 없음

흐름:
QA → Engineer Fix → QA → (Docs 업데이트 선택)

스펙 버전 증가 없음

---

## 3.2 스펙 변경 루프 (버전 업)

조건:
- 밸런스 변경
- 시스템 구조 변경
- 카드 추가
- 시너지 수정

판단 규칙(대규모 변경 기준):
- 아래 항목 중 2개 이상 동시 변경 시에만 스펙 버전 업 루프 실행
  - 상태 머신 상태/전이
  - 카드 풀/카드 효과 구조
  - 시너지/배수 공식
  - 라운드/적 행동 우선순위
  - 점수 규칙
- 단순 버그 수정(예: 턴 잠김, UI 표기 오류)은 버전 업 없이 버그 수정 루프로 처리

흐름:
QA 결과 → Producer Spec Update → Engineer → QA → Docs → PR

반드시:
- GAME_SPEC.md 버전 증가
- Change Log 작성

---

## 3.3 신규 기능 추가 루프

조건:
새 기능 기획

흐름:
Producer → Spec PR → Engineer → QA → Docs → PR

기능 추가는 항상 Producer부터 시작한다.

---

# 4. Branching Strategy

## Main
- 항상 실행 가능 상태 유지
- 직접 커밋 금지

## Feature Branch
형식:
feature/vX.Y-description

예:
feature/v0.2-new-card-system

## Fix Branch
형식:
fix/bug-description

예:
fix/synergy-multiplier-error

---

# 5. Definition of Done

기능 완료 조건:

- 전투 1회 정상 완주 가능
- 상태 머신 정상 작동
- 카드 효과 정확
- 시너지/배수 계산 정확
- 콘솔 에러 없음
- QA P0 테스트 통과
- PR 생성 완료

---

# 6. Documentation Update Rules

문서 업데이트는 다음 경우 수행한다:

- v0.x 릴리즈 완료
- 시스템 구조 변경
- 카드 추가
- 상태 머신 변경

CHANGELOG.md는 반드시 버전 단위로 기록한다.

---

# 7. State Machine Integrity Rule

모든 기능은 상태 머신을 우회하지 않는다.

허용 상태 예:
- ready
- playerTurn
- enemyTurn
- resolution
- gameOver

전이 규칙을 명확히 유지한다.

---

# 8. Versioning Policy

v0.1 → 최초 Vertical Slice
v0.2 → 기능 추가 또는 밸런스 변경
v0.x → 반복 개선

Major 버전은 전체 구조 변경 시에만 증가한다.

---

# 9. Anti-Pattern (금지 사항)

- 스펙 없이 기능 추가
- main 브랜치 직접 작업
- QA 생략
- 시너지 로직 임의 수정
- 문서 미갱신 상태 병합

---

# 10. Continuous Loop Summary

Initial:
Producer → Engineer → QA → Docs → PR

Bug:
QA ↔ Engineer Fix 반복

Feature Change:
QA → Producer → Engineer → QA → Docs → PR

이 루프를 반복하여 프로젝트를 안정적으로 발전시킨다.

운영 주기:
- 매 배포 사이클마다 QA 결과를 기준으로 루프 분기 판단을 1회 이상 수행한다.
- 버그가 존재하면 버그 수정 루프를 우선 실행한다.
- 대규모 변경 필요성이 확인되면 스펙 변경 루프(버전 업)로 전환한다.
