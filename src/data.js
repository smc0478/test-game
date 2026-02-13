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
  C001: c('C001', '엠버 스트라이크', 'emberStrike', 'attack', 1, 7, 'Flame', [{ kind: 'attack', value: 7 }], '기본 화염 공격입니다.'),
  C002: c('C002', '블레이즈 러시', 'emberStrike', 'attack', 1, 8, 'Flame', [{ kind: 'attack', value: 8 }], '순수 공격 수치가 높은 기본 카드입니다.'),
  C003: c('C003', '쏜 잽', 'thorn', 'attack', 1, 8, 'Leaf', [{ kind: 'attack', value: 8 }], '가벼운 리프 공격 카드입니다.'),
  C004: c('C004', '코그 샷', 'cog', 'attack', 1, 7, 'Gear', [{ kind: 'attack', value: 7 }], '기어 공격 카드입니다.'),
  C005: c('C005', '널 피어스', 'voidMark', 'attack', 1, 8, 'Void', [{ kind: 'attack', value: 8 }, { kind: 'drain', value: 3 }], '피해 후 흡혈 3을 얻습니다.'),
  C006: c('C006', '바크 가드', 'bark', 'skill', 1, 11, 'Leaf', [{ kind: 'block', value: 11 }], '안정적인 방어 카드입니다.'),
  C007: c('C007', '클락워크 가드', 'clockwork', 'skill', 1, 5, 'Gear', [{ kind: 'block', value: 5 }, { kind: 'draw', value: 1 }], '방어와 드로우를 동시에 제공합니다.'),
  C008: c('C008', '스파크 사이클', 'clockwork', 'skill', 1, 0, 'Gear', [{ kind: 'draw', value: 1 }], '패 회전용 드로우 카드입니다.'),
  C009: c('C009', '애쉬 포커스', 'emberRitual', 'skill', 1, 0, 'Flame', [{ kind: 'buffAttack', value: 5 }], '다음 공격의 피해를 강화합니다.'),
  C010: c('C010', '보이드 에코', 'voidMark', 'skill', 1, 0, 'Void', [{ kind: 'reduceBlock', value: 4 }], '적 방어를 깎아 딜 창을 엽니다.'),
  C011: c('C011', '버던트 펄스', 'bark', 'skill', 2, 12, 'Leaf', [{ kind: 'block', value: 12 }, { kind: 'heal', value: 3 }], '고코스트 생존 패키지입니다.'),
  C012: c('C012', '어비스 컷', 'voidBlade', 'attack', 2, 14, 'Void', [{ kind: 'attack', value: 14 }], '고정 고딜 카드입니다.'),
  C013: c('C013', '숲의 의식', 'thorn', 'skill', 1, 0, 'Leaf', [{ kind: 'heal', value: 6 }], '즉시 체력을 회복합니다.'),
  C014: c('C014', '화염 연계', 'emberStrike', 'attack', 1, 5, 'Flame', [{ kind: 'attack', value: 5 }, { kind: 'draw', value: 1 }], '공격 후 1장 드로우합니다.'),
  C015: c('C015', '기어 오버클럭', 'clockwork', 'skill', 1, 0, 'Gear', [{ kind: 'gainEnergy', value: 1 }], '에너지 회복만 제공하며 드로우는 제거되었습니다.'),
  C016: c('C016', '브램블 실드', 'bark', 'skill', 1, 7, 'Leaf', [{ kind: 'block', value: 7 }, { kind: 'thorns', value: 3 }, { kind: 'attack', value: 4 }], '방어와 가시를 동시에 얻습니다.'),
  C017: c('C017', '플레임 랜스', 'emberRitual', 'attack', 2, 13, 'Flame', [{ kind: 'attack', value: 13 }], '고효율 화염 피니셔입니다.'),
  C018: c('C018', '보이드 프랙처', 'voidBlade', 'attack', 1, 9, 'Void', [{ kind: 'attack', value: 9 }, { kind: 'vulnerable', value: 1 }], '피해 후 취약 1을 부여합니다.'),
  C019: c('C019', '리프 멘드', 'bark', 'skill', 1, 0, 'Leaf', [{ kind: 'heal', value: 4 }, { kind: 'draw', value: 1 }], '회복과 드로우를 함께 수행합니다.'),
  C020: c('C020', '코그 리빌드', 'clockwork', 'skill', 2, 0, 'Gear', [{ kind: 'draw', value: 1 }, { kind: 'block', value: 4 }], '후반 안정성을 올리는 카드입니다.'),
  C021: c('C021', '혈화 강타', 'emberStrike', 'attack', 2, 14, 'Flame', [{ kind: 'selfDamage', value: 3 }, { kind: 'attack', value: 14 }], '자가 피해를 감수하고 강하게 때립니다.'),
  C022: c('C022', '연쇄 톱니', 'clockwork', 'attack', 1, 6, 'Gear', [{ kind: 'attack', value: 4 }, { kind: 'echoAttack', value: 6 }], '같은 패밀리를 다시 쓰면 추가 타격합니다.'),
  C023: c('C023', '회귀 낙인', 'voidMark', 'skill', 1, 0, 'Void', [{ kind: 'vulnerable', value: 1 }, { kind: 'ifLastTurnFamily', family: 'voidMark', then: [{ kind: 'draw', value: 1 }, { kind: 'gainEnergy', value: 1 }] }], '전 턴 공허 낙인을 썼다면 연료를 회수합니다.'),
  C024: c('C024', '재생 방진', 'bark', 'skill', 1, 6, 'Leaf', [{ kind: 'block', value: 6 }, { kind: 'ifLastTurnFamily', family: 'bark', then: [{ kind: 'heal', value: 4 }, { kind: 'attack', value: 6 }] }], '전 턴에 바크 계열을 썼다면 추가 회복합니다.'),
  C025: c('C025', '프리즘 전환', 'prismFlow', 'skill', 1, 0, 'Gear', [{ kind: 'swapIntent', value: 1 }], '적 의도를 공격↔스킬로 바꿉니다.'),
  C026: c('C026', '공허 역류', 'voidBlade', 'attack', 2, 10, 'Void', [{ kind: 'attack', value: 10 }, { kind: 'ifEnemyIntent', intent: 'attack', then: [{ kind: 'attack', value: 8 }] }], '적이 공격 의도면 추가 타격합니다.'),
  C027: c('C027', '거울 칼날', 'prismBlade', 'attack', 1, 6, 'Void', [{ kind: 'attack', value: 6 }, { kind: 'ifEnemyIntent', intent: 'skill', then: [{ kind: 'draw', value: 1 }, { kind: 'gainEnergy', value: 1 }] }], '적이 스킬 의도일 때 역으로 손패/에너지를 벌어옵니다.'),
  C028: c('C028', '결정 장막', 'prismGuard', 'skill', 1, 7, 'Leaf', [{ kind: 'block', value: 7 }, { kind: 'ifEnemyIntent', intent: 'attack', then: [{ kind: 'thorns', value: 3 }] }], '적이 공격 의도면 가시를 3 얻어 반격 준비를 합니다.'),
  C029: c('C029', '역전 톱니', 'clockwork', 'skill', 2, 0, 'Gear', [{ kind: 'convertBlockToDamage', value: 70 }], '현재 방어도의 70%를 소모해 즉시 피해를 줍니다.'),
  C030: c('C030', '영점 폭발', 'voidRitual', 'attack', 2, 9, 'Flame', [{ kind: 'attack', value: 9 }, { kind: 'ifEnemyHpBelow', value: 22, then: [{ kind: 'attack', value: 10 }] }], '적 체력이 22 이하일 때 추가 폭발 피해를 가합니다.'),
  C031: c('C031', '아카이브 스캔', 'archive', 'skill', 1, 0, 'Gear', [{ kind: 'discover', value: 2 }], '카드 도감에서 임시 카드 1장을 선택해 손패에 추가합니다.'),
  C032: c('C032', '시간 되감기', 'chrono', 'skill', 0, 0, 'Void', [{ kind: 'rewind', value: 1 }], '직전에 사용한 내 카드의 효과를 비용 없이 한 번 더 발동합니다.'),
  C033: c('C033', '카이오스 잭팟', 'chaos', 'skill', 1, 0, 'Flame', [{ kind: 'gamble', value: 1 }], '기본은 무작위지만 활성 시너지에 맞춰 강화 보너스를 얻습니다.'),
  C034: c('C034', '프리즘 잔상', 'prismBlade', 'attack', 2, 9, 'Gear', [{ kind: 'attack', value: 9 }], '공격 카드로 단순화되어 콤보 확장 성능이 줄었습니다.')
};

const generateExtraCards = () => {
  const concepts = [
    { name: '난수 도박', family: 'chaos', type: 'skill', sigil: 'Flame', cost: 1, base: 0, effect: (t) => [{ kind: 'gamble', value: 1 }, { kind: 'draw', value: t % 2 }], desc: '랜덤 결과를 굴려 순간 고점을 노립니다.' },
    { name: '리프 방진', family: 'leafFort', type: 'skill', sigil: 'Leaf', cost: 1, base: 7, effect: (t) => [{ kind: 'block', value: 7 + t }, { kind: 'ifEnemyIntent', intent: 'attack', then: [{ kind: 'thorns', value: 2 }] }], desc: '방어 중심 운영에서 효율이 높은 리프 코어입니다.' },
    { name: '가시 반격', family: 'leafFort', type: 'attack', sigil: 'Leaf', cost: 2, base: 8, effect: (t) => [{ kind: 'convertBlockToDamage', value: 100 }, { kind: 'attack', value: 4 + t }], desc: '쌓은 방어도를 공격으로 전환하는 반격형 카드입니다.' },
    { name: '기어 순환', family: 'gearTempo', type: 'skill', sigil: 'Gear', cost: 1, base: 0, effect: () => [{ kind: 'draw', value: 1 }], desc: '드로우 1장으로 템포를 보정합니다.' },
    { name: '오버히트 절단', family: 'emberStrike', type: 'attack', sigil: 'Flame', cost: 1, base: 8, effect: (t) => [{ kind: 'attack', value: 8 + t }, { kind: 'ifEnemyHpBelow', value: 26, then: [{ kind: 'attack', value: 4 + t }] }], desc: '마무리 구간에서 피해가 크게 증가합니다.' },
    { name: '공허 갈증', family: 'voidMark', type: 'attack', sigil: 'Void', cost: 1, base: 7, effect: (t) => [{ kind: 'attack', value: 7 + t }, { kind: 'drain', value: 2 + (t % 2) }], desc: '공격과 흡혈을 동시에 챙기는 안정형 공허 카드입니다.' },
    { name: '의도 추적', family: 'prismFlow', type: 'attack', sigil: 'Void', cost: 1, base: 6, effect: (t) => [{ kind: 'attack', value: 6 + t }, { kind: 'ifEnemyIntent', intent: 'attack', then: [{ kind: 'vulnerable', value: 1 }, { kind: 'draw', value: 1 }] }], desc: '적 의도에 맞춰 추가 이득을 얻는 카운터 카드입니다.' },
    { name: '시간 메아리', family: 'chrono', type: 'skill', sigil: 'Gear', cost: 1, base: 0, effect: () => [{ kind: 'rewind', value: 1 }], desc: '직전 카드 효과를 재발동하지만 비용이 추가됩니다.' }
  ];

  const generated = {};
  for (let id = 35; id <= 100; id += 1) {
    const concept = concepts[(id - 35) % concepts.length];
    const tier = Math.floor((id - 35) / concepts.length);
    const cardId = `C${String(id).padStart(3, '0')}`;
    const rank = tier + 1;
    generated[cardId] = c(
      cardId,
      `${concept.name} ${rank}`,
      concept.family,
      concept.type,
      concept.cost,
      concept.base + tier,
      concept.sigil,
      concept.effect(tier),
      `${concept.desc} (확장 카드 ${cardId})`
    );
  }
  return generated;
};

export const CARD_LIBRARY = {
  ...BASE_CARD_LIBRARY,
  ...generateExtraCards()
};

export const STARTER_DECK = ['C001', 'C003', 'C004', 'C006', 'C007', 'C008', 'C010', 'C012', 'C014', 'C015', 'C021', 'C023'];

export const REGIONS = [
  { id: 'ashCanyon', name: '잿빛 협곡', tier: 1, enemies: ['emberFox', 'ironShell', 'sandBandit'] },
  { id: 'forestRidge', name: '바람숲 능선', tier: 1, enemies: ['thornDruid', 'mistArcher', 'vineGiant'] },
  { id: 'clockBasin', name: '시계분지', tier: 2, enemies: ['gearSentinel', 'steamKnight', 'arcSniper'] },
  { id: 'ruinHarbor', name: '폐허 항만', tier: 2, enemies: ['ironShell', 'sandBandit', 'voidAcolyte'] },
  { id: 'abyssGate', name: '심연 관문', tier: 3, enemies: ['voidReaper', 'voidAcolyte', 'prismOverlord'] },
  { id: 'prismSanctum', name: '프리즘 성소', tier: 3, enemies: ['prismOverlord', 'ancientWarden', 'chronoWatcher'] }
];

export const ROUTE_TABLE = [
  ['ashCanyon', 'forestRidge', 'ruinHarbor'],
  ['ashCanyon', 'clockBasin', 'forestRidge'],
  ['ruinHarbor', 'clockBasin', 'forestRidge'],
  ['clockBasin', 'ruinHarbor', 'abyssGate'],
  ['forestRidge', 'clockBasin', 'abyssGate'],
  ['ruinHarbor', 'abyssGate', 'prismSanctum'],
  ['clockBasin', 'abyssGate', 'prismSanctum'],
  ['abyssGate', 'prismSanctum', 'ruinHarbor'],
  ['abyssGate', 'prismSanctum', 'clockBasin'],
  ['prismSanctum', 'abyssGate', 'prismSanctum']
];

export const ROUTE_MODIFIERS = [
  { id: 'ambush', name: '선제 압박', detail: '적이 첫 턴 방어 +6', enemyBlock: 6 },
  { id: 'supply', name: '보급 지점', detail: '플레이어 시작 시 카드 1장 추가 드로우', bonusDraw: 1 },
  { id: 'fortified', name: '요새 진입', detail: '플레이어 시작 시 방어 +7', bonusBlock: 7 },
  { id: 'exposed', name: '지형 우세', detail: '적 최대 HP -8', enemyHpDelta: -8 }
];

export const ENEMY_ARCHETYPES = {
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
  prismOverlord: { id: 'prismOverlord', name: '프리즘 군주', hp: 98, deck: ['C001', 'C011', 'C012', 'C021', 'C023', 'C026', 'C030', 'C033', 'C034'], image: enemyArt('프리즘 군주', '👑', '#f9a8d4', '#4c1d95') }
};

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
  prismOverlord: { title: '프리즘 군주', concept: '복합 시너지 최종 보스', pattern: '랜덤/공허/화염 카드를 섞어 다양한 의도를 보입니다.', counter: '적 의도를 보고 카운터 카드 타이밍을 맞추고, 에너지를 폭딜 턴에 몰아주세요.' }
};

export const DECK_GUIDES = [
  {
    title: '랜덤 폭발 컨셉 (카오스)',
    coreCards: ['C033', 'C035', 'C043', 'C051'],
    play: '기어 순환 카드로 손패를 보충하고 카이오스/난수 도박을 연속 사용해 고점을 노립니다.'
  },
  {
    title: '리프 방어-반격 컨셉',
    coreCards: ['C006', 'C016', 'C029', 'C037', 'C038'],
    play: '방어도를 먼저 크게 쌓은 뒤 가시 반격/역전 톱니로 한 번에 피해를 전환합니다.'
  },
  {
    title: '공허 카운터 컨셉',
    coreCards: ['C026', 'C027', 'C039', 'C041', 'C045'],
    play: '적 의도가 공격일 때 추가 이득을 챙기는 카드로 에너지/드로우를 벌어 효율적으로 굴립니다.'
  },
  {
    title: '기어 템포 엔진 컨셉',
    coreCards: ['C015', 'C031', 'C040', 'C042', 'C050'],
    play: '드로우/되감기 카드로 손패 품질을 유지하면서 피니셔 각을 안정적으로 만듭니다.'
  }
];
