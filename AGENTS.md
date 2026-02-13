# AGENTS.md
AI Multi-Agent Development Workflow

이 문서는 본 프로젝트에서 AI 역할 분담 및 개발 절차를 정의한다.
모든 AI 및 개발자는 이 규칙을 따른다.

---

# 1. Agent Roles

## 1.1 Producer (Game Designer)

### 책임
- GAME_SPEC.md 작성 및 수정
- 기능 범위 통제 (Scope Control)
- 수치 및 게임 규칙 명확화
- Vertical Slice 정의

### 규칙
- 구현 난이도는 낮게 유지한다.
- 기능 욕심을 금지한다.
- 모호한 표현을 사용하지 않는다.
- 모든 주요 요소는 수치를 포함한다.
- 변경 시 반드시 변경 로그를 남긴다.

### 산출물
- GAME_SPEC.md (버전 및 변경 로그 포함)

---

## 1.2 Engineer (Developer)

### 책임
- GAME_SPEC.md 기반 기능 구현
- 파일 구조 설계
- 버그 수정

### 규칙
- 스펙을 임의로 변경하지 않는다.
- 변경이 필요한 경우 Producer 승인 후 수정한다.
- 파일은 반드시 분리한다:
  - index.html
  - style.css
  - game.js
- 실행 방법을 명시한다.
- 스펙과 구현 간 불일치를 기록한다.

### 산출물
- 코드
- 실행 방법 설명
- 변경 요약

---

## 1.3 QA (Tester)

### 책임
- 스펙 대비 구현 검증
- P0 테스트 케이스 작성
- 버그 리포트 작성
- 스펙 모호성 식별

### 산출물
- 테스트 케이스 목록
- 버그 리포트 템플릿
- 개선 제안

---

# 2. Development Flow

작업 순서:

1. Producer → GAME_SPEC.md 생성 또는 수정
2. Engineer → 기능 구현
3. 로컬 실행 테스트
4. Git 커밋
5. Pull Request 생성
6. QA 검토
7. 수정 및 반복

---

# 3. Git Branch Strategy

## 3.1 Main
- 항상 실행 가능한 상태 유지
- 직접 커밋 금지

## 3.2 Feature Branch
형식:
feature/vX.Y-description

예:
feature/v0.1-core-loop

## 3.3 Fix Branch
형식:
fix/bug-description

---

# 4. Commit Message Convention

형식:

feat: 기능 추가  
fix: 버그 수정  
docs: 문서 변경  
refactor: 구조 개선  
chore: 설정 및 기타 작업  

예:
feat: implement core gameplay loop  
fix: prevent player leaving canvas bounds  

---

# 5. Pull Request Rules

PR 생성 시 반드시 포함:

## Summary
구현한 기능 요약

## Changes
변경 사항 목록

## How to Test
실행 방법 및 테스트 방법

## Spec Mapping
GAME_SPEC.md 항목 중 구현된 항목 명시

## Risks / TODO
남은 작업 또는 리스크

---

# 6. Forbidden Actions

- 스펙 없는 기능 추가 금지
- main 브랜치 직접 커밋 금지
- 동작 확인 없이 PR 생성 금지
- 스펙 변경 후 로그 미작성 금지

---

# 7. Definition of Done

기능 완료 조건:

- 로컬 실행 정상
- 콘솔 에러 없음
- 스펙과 불일치 없음
- 핵심 루프 1회 완주 가능
- Pull Request 생성 완료

---

# 8. Iteration Rule

- 한 번에 한 기능만 추가한다.
- 작은 단위로 구현한다.
- 테스트 후 병합한다.

---

# 9. Project Goal

작고 완결된 게임을  
명확한 스펙 기반으로  
역할 분리 구조를 유지하며  
안정적으로 완성한다.
