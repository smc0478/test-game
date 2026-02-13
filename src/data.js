const colorBySigil = { Flame: '#f97316', Leaf: '#22c55e', Gear: '#38bdf8', Void: '#a855f7' };
const art = (name, sigil) => {
  const color = colorBySigil[sigil] || '#64748b';
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 170'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='${color}'/><stop offset='1' stop-color='#0f172a'/></linearGradient></defs><rect width='300' height='170' fill='url(#g)'/><text x='20' y='85' font-size='22' fill='white' font-family='sans-serif'>${name}</text><text x='20' y='125' font-size='18' fill='white' font-family='sans-serif'>${sigil}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const c = (id, name, family, type, energyCost, baseValue, sigil, effect) => ({ id, name, family, type, energyCost, baseValue, sigil, effect, image: art(name, sigil) });

export const CARD_LIBRARY = {
  C001: c('C001', '엠버 스트라이크', 'emberStrike', 'attack', 1, 7, 'Flame', [{ kind: 'attack', value: 7 }]),
  C002: c('C002', '블레이즈 러시', 'emberStrike', 'attack', 1, 8, 'Flame', [{ kind: 'attack', value: 8 }]),
  C003: c('C003', '쏜 잽', 'thorn', 'attack', 1, 6, 'Leaf', [{ kind: 'attack', value: 6 }]),
  C004: c('C004', '코그 샷', 'cog', 'attack', 1, 6, 'Gear', [{ kind: 'attack', value: 6 }]),
  C005: c('C005', '널 피어스', 'voidMark', 'attack', 1, 6, 'Void', [{ kind: 'attack', value: 6 }, { kind: 'drain', value: 2 }]),
  C006: c('C006', '바크 가드', 'bark', 'skill', 1, 8, 'Leaf', [{ kind: 'block', value: 8 }]),
  C007: c('C007', '클락워크 가드', 'clockwork', 'skill', 1, 7, 'Gear', [{ kind: 'block', value: 7 }, { kind: 'draw', value: 1 }]),
  C008: c('C008', '스파크 사이클', 'clockwork', 'skill', 1, 0, 'Gear', [{ kind: 'draw', value: 2 }]),
  C009: c('C009', '애쉬 포커스', 'emberRitual', 'skill', 1, 0, 'Flame', [{ kind: 'buffAttack', value: 4 }]),
  C010: c('C010', '보이드 에코', 'voidMark', 'skill', 1, 0, 'Void', [{ kind: 'reduceBlock', value: 4 }]),
  C011: c('C011', '버던트 펄스', 'bark', 'skill', 2, 12, 'Leaf', [{ kind: 'block', value: 12 }, { kind: 'heal', value: 3 }]),
  C012: c('C012', '어비스 컷', 'voidBlade', 'attack', 2, 12, 'Void', [{ kind: 'attack', value: 12 }]),
  C013: c('C013', '숲의 의식', 'thorn', 'skill', 1, 0, 'Leaf', [{ kind: 'heal', value: 5 }]),
  C014: c('C014', '화염 연계', 'emberStrike', 'attack', 1, 5, 'Flame', [{ kind: 'attack', value: 5 }, { kind: 'draw', value: 1 }]),
  C015: c('C015', '기어 오버클럭', 'clockwork', 'skill', 1, 0, 'Gear', [{ kind: 'gainEnergy', value: 1 }]),
  C016: c('C016', '브램블 실드', 'bark', 'skill', 1, 5, 'Leaf', [{ kind: 'block', value: 5 }, { kind: 'thorns', value: 2 }]),
  C017: c('C017', '플레임 랜스', 'emberRitual', 'attack', 2, 13, 'Flame', [{ kind: 'attack', value: 13 }]),
  C018: c('C018', '보이드 프랙처', 'voidBlade', 'attack', 1, 7, 'Void', [{ kind: 'attack', value: 7 }, { kind: 'vulnerable', value: 1 }]),
  C019: c('C019', '리프 멘드', 'bark', 'skill', 1, 0, 'Leaf', [{ kind: 'heal', value: 4 }, { kind: 'draw', value: 1 }]),
  C020: c('C020', '코그 리빌드', 'clockwork', 'skill', 2, 0, 'Gear', [{ kind: 'draw', value: 2 }, { kind: 'block', value: 6 }]),
  C021: c('C021', '혈화 강타', 'emberStrike', 'attack', 2, 14, 'Flame', [{ kind: 'selfDamage', value: 3 }, { kind: 'attack', value: 14 }]),
  C022: c('C022', '연쇄 톱니', 'clockwork', 'attack', 1, 5, 'Gear', [{ kind: 'attack', value: 5 }, { kind: 'echoAttack', value: 6 }]),
  C023: c('C023', '회귀 낙인', 'voidMark', 'skill', 1, 0, 'Void', [{ kind: 'vulnerable', value: 1 }, { kind: 'ifLastTurnFamily', family: 'voidMark', then: [{ kind: 'draw', value: 1 }, { kind: 'gainEnergy', value: 1 }] }]),
  C024: c('C024', '재생 방진', 'bark', 'skill', 1, 6, 'Leaf', [{ kind: 'block', value: 6 }, { kind: 'ifLastTurnFamily', family: 'bark', then: [{ kind: 'heal', value: 4 }] }]),
  C025: c('C025', '프리즘 전환', 'prismFlow', 'skill', 1, 0, 'Gear', [{ kind: 'swapIntent', value: 1 }, { kind: 'draw', value: 1 }]),
  C026: c('C026', '공허 역류', 'voidBlade', 'attack', 2, 10, 'Void', [{ kind: 'attack', value: 10 }, { kind: 'ifEnemyIntent', intent: 'attack', then: [{ kind: 'attack', value: 6 }] }])
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
  gearSentinel: { id: 'gearSentinel', name: '기어 센티넬', hp: 76, deck: ['C004', 'C008', 'C015', 'C017', 'C022', 'C025'] },
  thornDruid: { id: 'thornDruid', name: '가시 드루이드', hp: 80, deck: ['C003', 'C006', 'C011', 'C013', 'C024'] },
  voidReaper: { id: 'voidReaper', name: '공허 수확자', hp: 88, deck: ['C005', 'C010', 'C012', 'C018', 'C023', 'C026'] },
  prismOverlord: { id: 'prismOverlord', name: '프리즘 군주', hp: 106, deck: ['C001', 'C011', 'C012', 'C021', 'C023', 'C026'] }
};
