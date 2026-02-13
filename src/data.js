const colorBySigil = { Flame: '#f97316', Leaf: '#22c55e', Gear: '#38bdf8', Void: '#a855f7' };
const frameBySigil = { Flame: '#7c2d12', Leaf: '#14532d', Gear: '#0c4a6e', Void: '#4c1d95' };
const art = (name, sigil) => {
  const color = colorBySigil[sigil] || '#64748b';
  const frame = frameBySigil[sigil] || '#334155';
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 190'>
    <defs>
      <linearGradient id='bg' x1='0' x2='1'>
        <stop offset='0' stop-color='${color}'/>
        <stop offset='1' stop-color='#0f172a'/>
      </linearGradient>
      <linearGradient id='plate' x1='0' x2='0' y1='0' y2='1'>
        <stop offset='0' stop-color='#f8fafc' stop-opacity='0.92'/>
        <stop offset='1' stop-color='#e2e8f0' stop-opacity='0.68'/>
      </linearGradient>
    </defs>
    <rect x='5' y='5' width='290' height='180' rx='16' fill='#111827' stroke='${frame}' stroke-width='8'/>
    <rect x='18' y='18' width='264' height='110' rx='12' fill='url(#bg)'/>
    <rect x='18' y='132' width='264' height='40' rx='8' fill='url(#plate)'/>
    <text x='24' y='48' font-size='24' fill='white' font-weight='700' font-family='sans-serif'>${name}</text>
    <text x='24' y='74' font-size='16' fill='white' font-family='sans-serif'>문양: ${sigil}</text>
    <text x='24' y='156' font-size='14' fill='#0f172a' font-family='sans-serif'>전투 카드 아트</text>
  </svg>`;
  const encoded = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${encoded}`;
};

const c = (id, name, family, type, energyCost, baseValue, sigil, effect, description) => ({
  id, name, family, type, energyCost, baseValue, sigil, effect, description, image: art(name, sigil)
});

export const CARD_LIBRARY = {
  C001: c('C001', '엠버 스트라이크', 'emberStrike', 'attack', 1, 7, 'Flame', [{ kind: 'attack', value: 7 }], '기본 화염 공격입니다.'),
  C002: c('C002', '블레이즈 러시', 'emberStrike', 'attack', 1, 8, 'Flame', [{ kind: 'attack', value: 8 }], '순수 공격 수치가 높은 기본 카드입니다.'),
  C003: c('C003', '쏜 잽', 'thorn', 'attack', 1, 6, 'Leaf', [{ kind: 'attack', value: 6 }], '가벼운 리프 공격 카드입니다.'),
  C004: c('C004', '코그 샷', 'cog', 'attack', 1, 6, 'Gear', [{ kind: 'attack', value: 6 }], '기어 공격 카드입니다.'),
  C005: c('C005', '널 피어스', 'voidMark', 'attack', 1, 6, 'Void', [{ kind: 'attack', value: 6 }, { kind: 'drain', value: 2 }], '피해 후 흡혈 2를 얻습니다.'),
  C006: c('C006', '바크 가드', 'bark', 'skill', 1, 8, 'Leaf', [{ kind: 'block', value: 8 }], '안정적인 방어 카드입니다.'),
  C007: c('C007', '클락워크 가드', 'clockwork', 'skill', 1, 7, 'Gear', [{ kind: 'block', value: 7 }, { kind: 'draw', value: 1 }], '방어와 드로우를 동시에 제공합니다.'),
  C008: c('C008', '스파크 사이클', 'clockwork', 'skill', 1, 0, 'Gear', [{ kind: 'draw', value: 2 }], '패 회전용 드로우 카드입니다.'),
  C009: c('C009', '애쉬 포커스', 'emberRitual', 'skill', 1, 0, 'Flame', [{ kind: 'buffAttack', value: 4 }], '다음 공격의 피해를 강화합니다.'),
  C010: c('C010', '보이드 에코', 'voidMark', 'skill', 1, 0, 'Void', [{ kind: 'reduceBlock', value: 4 }], '적 방어를 깎아 딜 창을 엽니다.'),
  C011: c('C011', '버던트 펄스', 'bark', 'skill', 2, 12, 'Leaf', [{ kind: 'block', value: 12 }, { kind: 'heal', value: 3 }], '고코스트 생존 패키지입니다.'),
  C012: c('C012', '어비스 컷', 'voidBlade', 'attack', 2, 12, 'Void', [{ kind: 'attack', value: 12 }], '고정 고딜 카드입니다.'),
  C013: c('C013', '숲의 의식', 'thorn', 'skill', 1, 0, 'Leaf', [{ kind: 'heal', value: 5 }], '즉시 체력을 회복합니다.'),
  C014: c('C014', '화염 연계', 'emberStrike', 'attack', 1, 5, 'Flame', [{ kind: 'attack', value: 5 }, { kind: 'draw', value: 1 }], '공격 후 1장 드로우합니다.'),
  C015: c('C015', '기어 오버클럭', 'clockwork', 'skill', 1, 0, 'Gear', [{ kind: 'gainEnergy', value: 1 }], '에너지 회복으로 템포를 유지합니다.'),
  C016: c('C016', '브램블 실드', 'bark', 'skill', 1, 5, 'Leaf', [{ kind: 'block', value: 5 }, { kind: 'thorns', value: 2 }], '방어와 가시를 동시에 얻습니다.'),
  C017: c('C017', '플레임 랜스', 'emberRitual', 'attack', 2, 13, 'Flame', [{ kind: 'attack', value: 13 }], '고효율 화염 피니셔입니다.'),
  C018: c('C018', '보이드 프랙처', 'voidBlade', 'attack', 1, 7, 'Void', [{ kind: 'attack', value: 7 }, { kind: 'vulnerable', value: 1 }], '피해 후 취약 1을 부여합니다.'),
  C019: c('C019', '리프 멘드', 'bark', 'skill', 1, 0, 'Leaf', [{ kind: 'heal', value: 4 }, { kind: 'draw', value: 1 }], '회복과 드로우를 함께 수행합니다.'),
  C020: c('C020', '코그 리빌드', 'clockwork', 'skill', 2, 0, 'Gear', [{ kind: 'draw', value: 2 }, { kind: 'block', value: 6 }], '후반 안정성을 올리는 카드입니다.'),
  C021: c('C021', '혈화 강타', 'emberStrike', 'attack', 2, 14, 'Flame', [{ kind: 'selfDamage', value: 3 }, { kind: 'attack', value: 14 }], '자가 피해를 감수하고 강하게 때립니다.'),
  C022: c('C022', '연쇄 톱니', 'clockwork', 'attack', 1, 5, 'Gear', [{ kind: 'attack', value: 5 }, { kind: 'echoAttack', value: 6 }], '같은 패밀리를 다시 쓰면 추가 타격합니다.'),
  C023: c('C023', '회귀 낙인', 'voidMark', 'skill', 1, 0, 'Void', [{ kind: 'vulnerable', value: 1 }, { kind: 'ifLastTurnFamily', family: 'voidMark', then: [{ kind: 'draw', value: 1 }, { kind: 'gainEnergy', value: 1 }] }], '전 턴 공허 낙인을 썼다면 연료를 회수합니다.'),
  C024: c('C024', '재생 방진', 'bark', 'skill', 1, 6, 'Leaf', [{ kind: 'block', value: 6 }, { kind: 'ifLastTurnFamily', family: 'bark', then: [{ kind: 'heal', value: 4 }] }], '전 턴에 바크 계열을 썼다면 추가 회복합니다.'),
  C025: c('C025', '프리즘 전환', 'prismFlow', 'skill', 1, 0, 'Gear', [{ kind: 'swapIntent', value: 1 }, { kind: 'draw', value: 1 }], '적 의도를 공격↔스킬로 바꿉니다.'),
  C026: c('C026', '공허 역류', 'voidBlade', 'attack', 2, 10, 'Void', [{ kind: 'attack', value: 10 }, { kind: 'ifEnemyIntent', intent: 'attack', then: [{ kind: 'attack', value: 6 }] }], '적이 공격 의도면 추가 타격합니다.'),
  C027: c('C027', '거울 칼날', 'prismBlade', 'attack', 1, 6, 'Void', [{ kind: 'attack', value: 6 }, { kind: 'ifEnemyIntent', intent: 'skill', then: [{ kind: 'draw', value: 1 }, { kind: 'gainEnergy', value: 1 }] }], '적이 스킬 의도일 때 역으로 손패/에너지를 벌어옵니다.'),
  C028: c('C028', '결정 장막', 'prismGuard', 'skill', 1, 7, 'Leaf', [{ kind: 'block', value: 7 }, { kind: 'ifEnemyIntent', intent: 'attack', then: [{ kind: 'thorns', value: 3 }] }], '적이 공격 의도면 가시를 3 얻어 반격 준비를 합니다.'),
  C029: c('C029', '역전 톱니', 'clockwork', 'skill', 2, 0, 'Gear', [{ kind: 'convertBlockToDamage', value: 100 }], '현재 방어도를 모두 소모해 같은 수치만큼 즉시 피해를 줍니다.'),
  C030: c('C030', '영점 폭발', 'voidRitual', 'attack', 2, 9, 'Flame', [{ kind: 'attack', value: 9 }, { kind: 'ifEnemyHpBelow', value: 22, then: [{ kind: 'attack', value: 10 }] }], '적 체력이 22 이하일 때 추가 폭발 피해를 가합니다.'),
  C031: c('C031', '아카이브 스캔', 'archive', 'skill', 1, 0, 'Gear', [{ kind: 'discover', value: 3 }], '카드 도감에서 임시 카드 1장을 선택해 손패에 추가합니다.')
};

export const STARTER_DECK = ['C001', 'C003', 'C004', 'C006', 'C007', 'C008', 'C010', 'C012', 'C014', 'C015', 'C021', 'C023'];

export const REGIONS = [
  { name: '잿빛 협곡', enemies: ['emberFox', 'ironShell'] },
  { name: '기계 정원', enemies: ['gearSentinel', 'thornDruid'] },
  { name: '공허 성채', enemies: ['voidReaper', 'prismOverlord'] }
];

export const ENEMY_ARCHETYPES = {
  emberFox: { id: 'emberFox', name: '잿불 여우', hp: 60, deck: ['C001', 'C002', 'C014', 'C021', 'C017'] },
  ironShell: { id: 'ironShell', name: '철갑 딱정벌레', hp: 72, deck: ['C006', 'C007', 'C015', 'C016', 'C022'] },
  gearSentinel: { id: 'gearSentinel', name: '기어 센티넬', hp: 76, deck: ['C004', 'C008', 'C015', 'C017', 'C022', 'C025', 'C029'] },
  thornDruid: { id: 'thornDruid', name: '가시 드루이드', hp: 80, deck: ['C003', 'C006', 'C011', 'C013', 'C024', 'C028'] },
  voidReaper: { id: 'voidReaper', name: '공허 수확자', hp: 88, deck: ['C005', 'C010', 'C012', 'C018', 'C023', 'C026', 'C027'] },
  prismOverlord: { id: 'prismOverlord', name: '프리즘 군주', hp: 110, deck: ['C001', 'C011', 'C012', 'C021', 'C023', 'C026', 'C030'] }
};
