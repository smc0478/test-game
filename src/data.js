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

const enemyArt = (name, icon, colorA, colorB) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'>
    <defs>
      <linearGradient id='enemyBg' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${colorA}'/>
        <stop offset='1' stop-color='${colorB}'/>
      </linearGradient>
    </defs>
    <rect width='220' height='220' rx='28' fill='url(#enemyBg)'/>
    <circle cx='110' cy='90' r='54' fill='rgba(15,23,42,0.45)' stroke='rgba(255,255,255,0.55)' stroke-width='3'/>
    <text x='110' y='108' text-anchor='middle' font-size='58'>${icon}</text>
    <rect x='18' y='154' width='184' height='48' rx='12' fill='rgba(15,23,42,0.62)'/>
    <text x='110' y='184' text-anchor='middle' fill='white' font-size='18' font-weight='700' font-family='sans-serif'>${name}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

const BASE_CARD_LIBRARY = {
  C001: c('C001', '화염 타격', 'flame-core', 'attack', 1, 8, 'Flame', [{ kind: 'attack', value: 8 }], '적에게 피해 8을 준다.'),
  C002: c('C002', '화염 장막', 'flame-core', 'skill', 1, 8, 'Flame', [{ kind: 'block', value: 8 }], '방어도 8을 얻는다.'),
  C003: c('C003', '화염 통찰', 'flame-core', 'skill', 1, 2, 'Flame', [{ kind: 'draw', value: 2 }], '카드를 2장 뽑는다.'),
  C004: c('C004', '화염 재생', 'flame-core', 'skill', 1, 5, 'Flame', [{ kind: 'heal', value: 5 }], '체력을 5 회복한다.'),
  C005: c('C005', '잎새 타격', 'leaf-core', 'attack', 1, 8, 'Leaf', [{ kind: 'attack', value: 8 }], '적에게 피해 8을 준다.'),
  C006: c('C006', '잎새 방벽', 'leaf-core', 'skill', 1, 8, 'Leaf', [{ kind: 'block', value: 8 }], '방어도 8을 얻는다.'),
  C007: c('C007', '잎새 통찰', 'leaf-core', 'skill', 1, 2, 'Leaf', [{ kind: 'draw', value: 2 }], '카드를 2장 뽑는다.'),
  C008: c('C008', '잎새 재생', 'leaf-core', 'skill', 1, 5, 'Leaf', [{ kind: 'heal', value: 5 }], '체력을 5 회복한다.'),
  C009: c('C009', '기어 타격', 'gear-core', 'attack', 1, 8, 'Gear', [{ kind: 'attack', value: 8 }], '적에게 피해 8을 준다.'),
  C010: c('C010', '기어 장막', 'gear-core', 'skill', 1, 8, 'Gear', [{ kind: 'block', value: 8 }], '방어도 8을 얻는다.'),
  C011: c('C011', '기어 통찰', 'gear-core', 'skill', 1, 2, 'Gear', [{ kind: 'draw', value: 2 }], '카드를 2장 뽑는다.'),
  C012: c('C012', '기어 재생', 'gear-core', 'skill', 1, 5, 'Gear', [{ kind: 'heal', value: 5 }], '체력을 5 회복한다.'),
  C013: c('C013', '공허 타격', 'void-core', 'attack', 1, 8, 'Void', [{ kind: 'attack', value: 8 }], '적에게 피해 8을 준다.'),
  C014: c('C014', '공허 장막', 'void-core', 'skill', 1, 8, 'Void', [{ kind: 'block', value: 8 }], '방어도 8을 얻는다.'),
  C015: c('C015', '공허 통찰', 'void-core', 'skill', 1, 2, 'Void', [{ kind: 'draw', value: 2 }], '카드를 2장 뽑는다.'),
  C016: c('C016', '공허 재생', 'void-core', 'skill', 1, 5, 'Void', [{ kind: 'heal', value: 5 }], '체력을 5 회복한다.')
};

const buildConceptCards = () => ({});

export const CARD_LIBRARY = {
  ...BASE_CARD_LIBRARY,
  ...buildConceptCards()
};

export const STARTER_DECK = ['C001', 'C002', 'C005', 'C006', 'C009', 'C010', 'C013', 'C014'];

export const REGIONS = [
  { id: 'ashCanyon', name: '잿빛 협곡', tier: 1, enemies: ['emberFox', 'ironShell', 'sandBandit', 'cinderHound', 'chaosJuggler'] },
  { id: 'forestRidge', name: '바람숲 능선', tier: 1, enemies: ['thornDruid', 'mistArcher', 'vineGiant', 'mossStalker', 'leafBulwark'] },
  { id: 'clockBasin', name: '시계분지', tier: 2, enemies: ['gearSentinel', 'steamKnight', 'arcSniper', 'brassMonk', 'gearLooper'] },
  { id: 'ruinHarbor', name: '폐허 항만', tier: 2, enemies: ['ironShell', 'sandBandit', 'voidAcolyte', 'reefHunter', 'thornAvenger'] },
  { id: 'stormCliff', name: '폭풍 절벽', tier: 2, enemies: ['stormRider', 'arcSniper', 'mistArcher', 'brassMonk', 'prismTracker'] },
  { id: 'emberForge', name: '용광 화로', tier: 2, enemies: ['cinderHound', 'forgeTitan', 'gearSentinel', 'steamKnight', 'emberExecutioner'] },
  { id: 'abyssGate', name: '심연 관문', tier: 3, enemies: ['voidReaper', 'voidAcolyte', 'prismOverlord', 'abyssLeech', 'voidDrinker'] },
  { id: 'moonLibrary', name: '월광 서고', tier: 3, enemies: ['moonScholar', 'chronoWatcher', 'arcSniper', 'voidAcolyte', 'chronoEcho'] },
  { id: 'prismSanctum', name: '프리즘 성소', tier: 3, enemies: ['prismOverlord', 'ancientWarden', 'chronoWatcher', 'prismLancer', 'prismTracker'] },
  { id: 'voidCitadel', name: '공허 성채', tier: 4, enemies: ['voidReaper', 'ancientWarden', 'prismOverlord', 'citadelJudge', 'voidDrinker'] }
];

export const ROUTE_TABLE = [
  ['ashCanyon', 'forestRidge', 'ruinHarbor'],
  ['ashCanyon', 'clockBasin', 'stormCliff'],
  ['forestRidge', 'ruinHarbor', 'emberForge'],
  ['clockBasin', 'stormCliff', 'abyssGate'],
  ['ruinHarbor', 'moonLibrary', 'abyssGate'],
  ['emberForge', 'clockBasin', 'prismSanctum'],
  ['stormCliff', 'abyssGate', 'moonLibrary'],
  ['forestRidge', 'emberForge', 'prismSanctum'],
  ['ruinHarbor', 'abyssGate', 'voidCitadel'],
  ['moonLibrary', 'prismSanctum', 'voidCitadel'],
  ['stormCliff', 'abyssGate', 'prismSanctum'],
  ['emberForge', 'moonLibrary', 'voidCitadel']
];

export const ROUTE_MODIFIERS = [
  { id: 'ambush', name: '선제 압박', detail: '적이 첫 턴 방어 +6', enemyBlock: 6 },
  { id: 'supply', name: '보급 지점', detail: '플레이어 시작 시 카드 1장 추가 드로우', bonusDraw: 1 },
  { id: 'fortified', name: '요새 진입', detail: '플레이어 시작 시 방어 +7', bonusBlock: 7 },
  { id: 'exposed', name: '지형 우세', detail: '적 최대 HP -8', enemyHpDelta: -8 }
];

const RAW_ENEMY_ARCHETYPES = {
  emberFox: { id: 'emberFox', name: '잿불 여우', hp: 52, deck: ['C001', 'C002', 'C014', 'C021', 'C017', 'C033'], image: enemyArt('잿불 여우', '🦊', '#fb923c', '#7c2d12') },
  ironShell: { id: 'ironShell', name: '철갑 딱정벌레', hp: 64, deck: ['C006', 'C007', 'C015', 'C016', 'C022', 'C029'], image: enemyArt('철갑 딱정벌레', '🪲', '#60a5fa', '#1e3a8a') },
  sandBandit: { id: 'sandBandit', name: '사막 약탈자', hp: 60, deck: ['C001', 'C004', 'C020', 'C024', 'C035', 'C044'], image: enemyArt('사막 약탈자', '🏜️', '#fbbf24', '#92400e') },
  thornDruid: { id: 'thornDruid', name: '가시 드루이드', hp: 70, deck: ['C003', 'C006', 'C011', 'C013', 'C024', 'C028', 'C037'], image: enemyArt('가시 드루이드', '🌿', '#34d399', '#14532d') },
  mistArcher: { id: 'mistArcher', name: '안개 궁수', hp: 58, deck: ['C004', 'C008', 'C014', 'C018', 'C031', 'C045'], image: enemyArt('안개 궁수', '🏹', '#a5b4fc', '#1e1b4b') },
  vineGiant: { id: 'vineGiant', name: '덩굴 거인', hp: 82, deck: ['C006', 'C011', 'C016', 'C019', 'C029', 'C037'], image: enemyArt('덩굴 거인', '🪵', '#4ade80', '#166534') },
  gearSentinel: { id: 'gearSentinel', name: '기어 센티넬', hp: 74, deck: ['C004', 'C008', 'C015', 'C017', 'C022', 'C025', 'C029'], image: enemyArt('기어 센티넬', '⚙️', '#38bdf8', '#0c4a6e') },
  steamKnight: { id: 'steamKnight', name: '증기 기사', hp: 78, deck: ['C002', 'C007', 'C015', 'C022', 'C030', 'C040'], image: enemyArt('증기 기사', '🛡️', '#93c5fd', '#172554') },
  arcSniper: { id: 'arcSniper', name: '아크 스나이퍼', hp: 66, deck: ['C004', 'C010', 'C018', 'C025', 'C041', 'C050'], image: enemyArt('아크 스나이퍼', '🎯', '#67e8f9', '#155e75') },
  voidAcolyte: { id: 'voidAcolyte', name: '공허 사도', hp: 80, deck: ['C005', 'C010', 'C012', 'C018', 'C026', 'C027', 'C045'], image: enemyArt('공허 사도', '🌌', '#c084fc', '#4c1d95') },
  voidReaper: { id: 'voidReaper', name: '공허 수확자', hp: 88, deck: ['C005', 'C010', 'C012', 'C018', 'C023', 'C026', 'C027', 'C039'], image: enemyArt('공허 수확자', '☄️', '#a78bfa', '#312e81') },
  ancientWarden: { id: 'ancientWarden', name: '고대 수문장', hp: 92, deck: ['C006', 'C011', 'C016', 'C024', 'C033', 'C042', 'C051'], image: enemyArt('고대 수문장', '🗿', '#94a3b8', '#0f172a') },
  chronoWatcher: { id: 'chronoWatcher', name: '시간 감시자', hp: 86, deck: ['C008', 'C015', 'C031', 'C032', 'C040', 'C042', 'C050'], image: enemyArt('시간 감시자', '⏳', '#93c5fd', '#1e1b4b') },
  prismOverlord: { id: 'prismOverlord', name: '프리즘 군주', hp: 98, deck: ['C001', 'C011', 'C012', 'C021', 'C023', 'C026', 'C030', 'C033', 'C034'], image: enemyArt('프리즘 군주', '👑', '#f9a8d4', '#4c1d95') },
  cinderHound: { id: 'cinderHound', name: '잿가루 사냥개', hp: 72, deck: ['C001', 'C014', 'C017', 'C052', 'C068', 'C084'], image: enemyArt('잿가루 사냥개', '🐕', '#fb7185', '#7f1d1d') },
  mossStalker: { id: 'mossStalker', name: '이끼 잠복자', hp: 76, deck: ['C003', 'C006', 'C019', 'C055', 'C071', 'C087'], image: enemyArt('이끼 잠복자', '🦎', '#4ade80', '#14532d') },
  brassMonk: { id: 'brassMonk', name: '황동 수도승', hp: 84, deck: ['C007', 'C015', 'C031', 'C058', 'C074', 'C090'], image: enemyArt('황동 수도승', '🥋', '#7dd3fc', '#082f49') },
  reefHunter: { id: 'reefHunter', name: '산호 사냥꾼', hp: 80, deck: ['C004', 'C018', 'C041', 'C060', 'C076', 'C092'], image: enemyArt('산호 사냥꾼', '🦈', '#2dd4bf', '#134e4a') },
  stormRider: { id: 'stormRider', name: '폭풍 기수', hp: 86, deck: ['C002', 'C008', 'C032', 'C062', 'C078', 'C094'], image: enemyArt('폭풍 기수', '🌩️', '#c4b5fd', '#312e81') },
  forgeTitan: { id: 'forgeTitan', name: '화로 거신', hp: 108, deck: ['C017', 'C022', 'C030', 'C064', 'C080', 'C096'], image: enemyArt('화로 거신', '🔥', '#f97316', '#431407') },
  abyssLeech: { id: 'abyssLeech', name: '심연 흡수체', hp: 94, deck: ['C005', 'C012', 'C027', 'C066', 'C082', 'C098'], image: enemyArt('심연 흡수체', '🪱', '#a78bfa', '#3b0764') },
  moonScholar: { id: 'moonScholar', name: '월광 학자', hp: 90, deck: ['C010', 'C013', 'C040', 'C069', 'C085', 'C101'], image: enemyArt('월광 학자', '📘', '#93c5fd', '#1e3a8a') },
  prismLancer: { id: 'prismLancer', name: '프리즘 창병', hp: 102, deck: ['C021', 'C023', 'C034', 'C072', 'C088', 'C104'], image: enemyArt('프리즘 창병', '🗡️', '#f0abfc', '#581c87') },
  citadelJudge: { id: 'citadelJudge', name: '성채 심판자', hp: 114, deck: ['C024', 'C029', 'C042', 'C075', 'C091', 'C107'], image: enemyArt('성채 심판자', '⚖️', '#cbd5e1', '#1e293b') },
  duskHarvester: { id: 'duskHarvester', name: '황혼 수확자', hp: 96, deck: ['C026', 'C039', 'C045', 'C081', 'C097', 'C113'], image: enemyArt('황혼 수확자', '🌒', '#ddd6fe', '#4c1d95') },
  auroraWisp: { id: 'auroraWisp', name: '오로라 정령', hp: 88, deck: ['C014', 'C019', 'C025', 'C079', 'C095', 'C111'], image: enemyArt('오로라 정령', '✨', '#67e8f9', '#164e63') },
  chaosJuggler: { id: 'chaosJuggler', name: '혼돈 곡예사', hp: 90, deck: ['C033', 'C051', 'C083', 'C115', 'C147', 'C163'], image: enemyArt('혼돈 곡예사', '🎲', '#f97316', '#7c2d12') },
  leafBulwark: { id: 'leafBulwark', name: '수호 잎새', hp: 106, deck: ['C037', 'C069', 'C101', 'C133', 'C069', 'C164'], image: enemyArt('수호 잎새', '🛡️', '#22c55e', '#14532d') },
  thornAvenger: { id: 'thornAvenger', name: '가시 집행자', hp: 98, deck: ['C038', 'C070', 'C102', 'C134', 'C102', 'C165'], image: enemyArt('가시 집행자', '🌵', '#4ade80', '#166534') },
  gearLooper: { id: 'gearLooper', name: '루프 기어', hp: 92, deck: ['C039', 'C071', 'C103', 'C135', 'C103', 'C166'], image: enemyArt('루프 기어', '⚙️', '#38bdf8', '#0c4a6e') },
  emberExecutioner: { id: 'emberExecutioner', name: '잿불 집행관', hp: 100, deck: ['C040', 'C072', 'C104', 'C136', 'C104', 'C167'], image: enemyArt('잿불 집행관', '🪓', '#fb923c', '#7f1d1d') },
  voidDrinker: { id: 'voidDrinker', name: '공허 포식자', hp: 104, deck: ['C041', 'C073', 'C105', 'C137', 'C105', 'C168'], image: enemyArt('공허 포식자', '🩸', '#a855f7', '#4c1d95') },
  prismTracker: { id: 'prismTracker', name: '프리즘 추적자', hp: 96, deck: ['C042', 'C074', 'C106', 'C138', 'C106', 'C161'], image: enemyArt('프리즘 추적자', '🎯', '#c084fc', '#312e81') },
  chronoEcho: { id: 'chronoEcho', name: '시공 메아리', hp: 98, deck: ['C043', 'C075', 'C107', 'C139', 'C107', 'C162'], image: enemyArt('시공 메아리', '⏱️', '#67e8f9', '#1e3a8a') }
};


const normalizeCardId = (cardId) => {
  if (CARD_LIBRARY[cardId]) return cardId;
  return null;
};

export const ENEMY_ARCHETYPES = Object.fromEntries(
  Object.entries(RAW_ENEMY_ARCHETYPES).map(([key, enemy]) => [
    key,
    { ...enemy, deck: enemy.deck.map(normalizeCardId).filter(Boolean) }
  ])
);

export const ENEMY_BESTIARY = {
  emberFox: { title: '잿불 여우', concept: '화염 폭딜형', pattern: '공격 카드를 우선하지만 연계 드로우 카드로 손패를 늘립니다.', counter: '리프 방어 카드와 취약 대응으로 폭딜 타이밍을 넘기세요.' },
  ironShell: { title: '철갑 딱정벌레', concept: '방어-반격형', pattern: '방어 카드를 섞어 쓰고 연쇄 톱니로 반격합니다.', counter: '보이드 계열로 방어를 깎고 강타를 몰아주세요.' },
  sandBandit: { title: '사막 약탈자', concept: '고속 선공형', pattern: '저코스트 공격 카드를 연속 사용해 초반 압박을 만듭니다.', counter: '시작 방어 카드와 회복 카드로 초반 턴을 넘기세요.' },
  thornDruid: { title: '가시 드루이드', concept: '지속 생존형', pattern: '회복+가시를 활용해 장기전을 유도합니다.', counter: '화염 고점 카드로 짧은 턴에 큰 피해를 누적하세요.' },
  mistArcher: { title: '안개 궁수', concept: '취약 저격형', pattern: '취약 부여 후 원거리 피해를 집중해 체력을 깎습니다.', counter: '취약 턴에 방어 카드를 몰아 쓰고 반격 카드를 준비하세요.' },
  vineGiant: { title: '덩굴 거인', concept: '초고체력 압박형', pattern: '고체력으로 버티며 방어-반격 루프를 반복합니다.', counter: '공허 방어 감소/흡혈으로 템포를 빼앗으세요.' },
  gearSentinel: { title: '기어 센티넬', concept: '템포 순환형', pattern: '드로우/전환 카드로 안정적으로 손패를 다듬습니다.', counter: '핵심 스킬 타이밍을 끊고 장기전을 피하세요.' },
  steamKnight: { title: '증기 기사', concept: '기어 버프 누적형', pattern: '턴이 길어질수록 공격 수치가 빠르게 커집니다.', counter: '중반 전에 강한 피니셔로 끊어내는 것이 안전합니다.' },
  arcSniper: { title: '아크 스나이퍼', concept: '의도 교란형', pattern: '공격과 스킬을 촘촘하게 바꿔 플레이어 계산을 흔듭니다.', counter: '의도 기반 카드로 대응하며 에너지를 아껴 폭딜 턴을 만드세요.' },
  voidAcolyte: { title: '공허 사도', concept: '취약-흡혈형', pattern: '취약 부여 후 흡혈로 체력을 회복합니다.', counter: '리프 방어로 취약 턴을 버티고 기어 순환으로 카드 질을 높이세요.' },
  voidReaper: { title: '공허 수확자', concept: '고위 공허 집행자', pattern: '고코스트 공허 공격과 카운터 카드를 섞어 후반을 지배합니다.', counter: '보스전 전에 HP를 최대한 보존하고 버스트 타이밍을 준비하세요.' },
  ancientWarden: { title: '고대 수문장', concept: '요새 보스형', pattern: '방어 누적 뒤 반격 카드로 큰 피해를 줍니다.', counter: '방어 감소 카드를 아껴 두고 한 턴 폭딜로 마무리하세요.' },
  chronoWatcher: { title: '시간 감시자', concept: '되감기 연쇄형', pattern: 'rewind 계열 카드를 통해 같은 효과를 반복합니다.', counter: '초반에 체력을 많이 깎아 장기전 자체를 피하는 편이 좋습니다.' },
  prismOverlord: { title: '프리즘 군주', concept: '복합 시너지 최종 보스', pattern: '랜덤/공허/화염 카드를 섞어 다양한 의도를 보입니다.', counter: '적 의도를 보고 카운터 카드 타이밍을 맞추고, 에너지를 폭딜 턴에 몰아주세요.' },
  cinderHound: { title: '잿가루 사냥개', concept: '연소 돌진형', pattern: '저코스트 화염 공격을 연속으로 사용해 방어를 녹입니다.', counter: '초반 방어를 확보하고 회복 카드를 아껴 반격 타이밍을 만드세요.' },
  mossStalker: { title: '이끼 잠복자', concept: '지속 독성형', pattern: '회복과 방어를 반복해 장기전을 유도합니다.', counter: '공허 계열로 방어를 먼저 깎아 교전을 짧게 만드세요.' },
  brassMonk: { title: '황동 수도승', concept: '정밀 템포형', pattern: '기어 카드로 에너지와 손패를 안정적으로 굴립니다.', counter: '손패 압박 전에 고코스트 피니셔로 체력을 크게 깎아 두세요.' },
  reefHunter: { title: '산호 사냥꾼', concept: '저격-흡혈형', pattern: '취약 부여 후 흡혈 카드로 손실을 회복합니다.', counter: '취약 턴에는 방어 우선, 다음 턴에 버스트로 마무리하세요.' },
  stormRider: { title: '폭풍 기수', concept: '연계 폭발형', pattern: '드로우 기반 연계로 한 턴 행동 횟수를 늘립니다.', counter: '적 에너지가 남아있을 때 방어를 과감히 쌓아 연계를 끊으세요.' },
  forgeTitan: { title: '화로 거신', concept: '고체력 압살형', pattern: '묵직한 고코스트 공격으로 중후반 체력을 강하게 압박합니다.', counter: '초반에 취약/방깎을 누적해 고코스트 턴 전에 우위를 만드세요.' },
  abyssLeech: { title: '심연 흡수체', concept: '흡혈 생존형', pattern: '공허 공격과 흡혈 효과를 반복해 체력을 되돌립니다.', counter: '공격 타이밍을 몰아서 회복 전에 큰 피해를 주는 것이 핵심입니다.' },
  moonScholar: { title: '월광 학자', concept: '제어형 마도사', pattern: '취약·회복·되감기를 섞어 리듬을 흔듭니다.', counter: '드로우 카드로 답패를 빠르게 찾고 긴 교전을 피하세요.' },
  prismLancer: { title: '프리즘 창병', concept: '관통 돌격형', pattern: '다문양 연계로 짧은 턴에 폭딜을 만듭니다.', counter: '적 버스트 직전에 방어를 집중해 손실을 최소화하세요.' },
  citadelJudge: { title: '성채 심판자', concept: '요새 판정형', pattern: '방어 누적 뒤 변환 공격으로 큰 반격을 가합니다.', counter: '방어 감소 카드와 고점 공격 카드를 같은 턴에 묶어 사용하세요.' },
  duskHarvester: { title: '황혼 수확자', concept: '후반 추격형', pattern: '공허 카드 비율이 높아 후반으로 갈수록 위협이 커집니다.', counter: '체력 우위를 유지한 채 중반 이전에 승기를 잡으세요.' },
  auroraWisp: { title: '오로라 정령', concept: '변칙 교란형', pattern: '드로우·지원 스킬로 의도를 자주 바꿔 예측을 어렵게 합니다.', counter: '의도 카운터 카드보다 안정 방어/고정 딜 카드를 우선하세요.' },
  chaosJuggler: { title: '혼돈 곡예사', concept: '난수 도박형', pattern: '난수 도박 계열을 연속으로 사용해 전투 흐름을 요동치게 만듭니다.', counter: '안정 방어 카드를 우선해 변동 폭을 흡수하세요.' },
  leafBulwark: { title: '수호 잎새', concept: '리프 방진형', pattern: '높은 방어와 가시를 반복해 손실 없는 턴을 만들려고 합니다.', counter: '방어 감소 카드와 고정 피해 카드로 방어 루프를 끊으세요.' },
  thornAvenger: { title: '가시 집행자', concept: '가시 반격형', pattern: '방어 전환 카드를 축적한 뒤 한 번에 반격 피해를 몰아칩니다.', counter: '반격 턴 전에 버스트를 몰아 짧게 끝내는 것이 안전합니다.' },
  gearLooper: { title: '루프 기어', concept: '기어 순환형', pattern: '드로우 중심 카드로 손패를 빠르게 교체하며 답패를 찾습니다.', counter: '턴이 길어지기 전에 핵심 공격을 집중하세요.' },
  emberExecutioner: { title: '잿불 집행관', concept: '오버히트 절단형', pattern: '체력이 낮아지면 추가 타격이 붙는 화염 카드로 마무리를 노립니다.', counter: '중반부터 방어를 유지해 처형 구간 진입을 늦추세요.' },
  voidDrinker: { title: '공허 포식자', concept: '공허 갈증형', pattern: '흡혈 공격을 반복해 소모전을 유리하게 만듭니다.', counter: '한 턴 고점 피해로 회복 턴 자체를 봉쇄하세요.' },
  prismTracker: { title: '프리즘 추적자', concept: '의도 추적형', pattern: '의도 조건 카드를 중심으로 플레이어의 공격 턴을 역이용합니다.', counter: '의도 노출 턴에는 스킬 카드 위주로 템포를 조절하세요.' },
  chronoEcho: { title: '시공 메아리', concept: '시간 메아리형', pattern: 'rewind 계열을 반복해 같은 카드를 여러 번 재사용합니다.', counter: '회복보다 빠른 폭딜로 재사용 턴을 주지 마세요.' }
};

export const DECK_GUIDES = [
  {
    title: '화염 압박 컨셉',
    coreCards: ['C001', 'C002', 'C003', 'C004'],
    play: '화염 카드 2회 이상으로 공격 시너지를 빠르게 켜고, 회복 카드로 체력을 유지하세요.'
  },
  {
    title: '리프 방어 컨셉',
    coreCards: ['C005', 'C006', 'C007', 'C008'],
    play: '리프 카드를 연속 사용해 방어 시너지를 켜고 안정적으로 장기전을 운영하세요.'
  },
  {
    title: '기어 순환 컨셉',
    coreCards: ['C009', 'C010', 'C011', 'C012'],
    play: '기어 드로우 카드로 손패 순환을 가속하고 필요한 역할 카드를 빠르게 찾으세요.'
  },
  {
    title: '공허 흡수 컨셉',
    coreCards: ['C013', 'C014', 'C015', 'C016'],
    play: '공허 시너지의 추가 피해/흡혈을 활용해 공격과 생존을 동시에 챙기세요.'
  }
];
