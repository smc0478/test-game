# Project Changelog

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
