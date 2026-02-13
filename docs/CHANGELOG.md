# Project Changelog

## v0.8.0
### Added
- 카드 도감을 메인 화면에서 분리해 `codex.html` 독립 페이지로 제공.
- 메인 전투 화면에 최근 사용 카드 12개 히스토리 패널을 추가.
- 신규 카드 3장(C032~C034) 및 신규 효과(`rewind`, `gamble`)를 추가.

### Changed
- 상단 컨트롤에 도감 페이지 이동 버튼을 추가.
- 적 보스 덱에 신규 변칙 카드(C033, C034)를 편입해 후반 전투 변수를 강화.

### Fixed
- 전투 로그 의존 없이도 플레이어 카드 사용 흐름을 추적할 수 있도록 UI 가시성 개선.

## v0.7.0
### Added
- 신규 카드 5장(C027~C031) 및 신규 효과(`ifEnemyHpBelow`, `convertBlockToDamage`, `discover`)를 추가.
- 라운드 보상 단계에 `보상 건너뛰기`, `덱 카드 1장 제거`, `다음 전투 이동` 절차를 추가.
- 전체 카드 목록/효과/설명을 확인할 수 있는 카드 도감 UI를 추가.

### Changed
- 카드 데이터에 `description` 필드를 추가해 UI에 친절한 효과 설명을 표시.
- 카드 아트 SVG를 카드 프레임 스타일로 개선.

### Fixed
- 전투 중 `discover` 효과로 임시 카드 선택 시 상태가 꼬이지 않도록 별도 선택 패널 흐름으로 정리.

## v0.6.0
### Added
- `planning` 상태를 추가해 적 의도를 플레이어 턴 전에 확정/표시하도록 변경.
- 신규 카드 2장(C025, C026)과 신규 효과(`swapIntent`, `ifEnemyIntent`) 추가.
- UI에 적 의도 표시 필드 추가.

### Changed
- `game.js` 단일 파일 구조를 `src/` 모듈 구조로 분리.
- 엔진/데이터/렌더링 분리로 유지보수성 개선.

### Fixed
- 적 턴 종료 후 플레이어 턴 재진입 흐름을 `planning -> enemyTurn -> resolution` 순으로 정리해 턴 혼선 가능성을 축소.

## v0.5.1
- PLAYBOOK 루프 분기 기준 명시 및 resolution 턴 잠김 수정.
