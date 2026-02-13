# Project Changelog

## v0.1.0
### Added
- Synergy Turn Card Battle 기준의 수치형 전투 스펙을 정의했습니다.
- 상태 머신(`ready`, `playerTurn`, `enemyTurn`, `resolution`, `gameOver`)과 전이 규칙을 명시했습니다.
- 10장 고정 카드 풀, 문양 시너지, 점수 배수 규칙을 문서화했습니다.

### Changed
- 이전 `Square Survival v0.2` 중심 스펙에서, 현재 저장소 구현에 맞는 `Synergy Turn Card Battle v0.1.0` 스펙 체계로 정렬되었습니다.
- 프로젝트 목표를 생존 액션 루프에서 턴제 카드 전투 루프로 전환했습니다.

### Fixed
- 전투 구현 커밋 요약 기준으로, HP/배틀 수치 및 시너지 적용 범위가 GAME_SPEC과 일치하도록 보정되었습니다.
- 상태 전이/승패/점수 처리의 스펙 정합성 이슈가 후속 수정 커밋에서 보완되었습니다.

### Removed
- 캔버스 기반 이동/스폰 중심의 생존 게임 규칙 및 관련 QA 기준이 현재 스펙 범위에서 제외되었습니다.
