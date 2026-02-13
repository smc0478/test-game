# Synergy Turn Card Battle v1.9 문서

## 게임 소개
v1.9는 **50라운드 장기 런**, **확장 카드 풀(C001~C168)**, **다종 적 편성(34종)**과 **카드 컨셉별 전용 적 8종**을 적용한 확장 버전입니다.

## 변경 파일 목록 (Phaser 이관)
- `index.html`: Phaser CDN 로드, `#game-root` 배틀 컨테이너 추가, 기존 캔버스 오버레이 제거.
- `style.css`: Phaser 캔버스/DOM 오버레이 레이어링(`pointer-events`) 규칙 정리.
- `game.js`: 엔진(core) + Phaser BattleScene + DOM UI 렌더 연결.
- `src/core/battleCore.js`: 상태 머신/카드 효과/AI 로직을 전용 core 모듈로 분리.
- `src/phaserBattle.js`: BootScene/BattleScene, 전장 배치/HP바/hover 인터랙션 렌더.
- `src/ui.js`: DOM 카드/로그/보상 패널 렌더 유지 + Phaser hover 패널 연동.

## 실행 방법
1. 프로젝트 루트에서 로컬 서버 실행
   ```bash
   python3 -m http.server 8000
   ```
2. 브라우저에서 접속
   ```
   http://localhost:8000
   ```
3. `새 런 시작` 클릭 후 전투 진행(카드 사용/턴 종료) 시 Phaser 배틀 스테이지가 함께 갱신되는지 확인

## 핵심 구조 요약
- core(`src/core/battleCore.js`): 상태 머신 + 전투 계산 + AI 결정
- scene(`src/phaserBattle.js`): Phaser Boot/Battle Scene 렌더
- dom(`src/ui.js`): 카드/보상/로그/패널 렌더

> Phaser를 선택한 이유: Pixi는 렌더링 중심이고 Phaser는 씬/입력/구조를 포함한 게임 프레임워크라 카드 배틀처럼 상태/입력이 많은 화면에 바로 적용하기 쉽다.


## 버그 대응 원칙
- 버그를 수정할 때는 `tests/bugs/`에 재현 가능한 회귀 테스트 스크립트를 먼저 추가한다.
- 수정 후 동일 스크립트로 재검증해 PASS를 확인한다.
