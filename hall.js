import { loadHallOfFame, clearHallOfFame } from './src/storage.js';

const summaryWrap = document.querySelector('#hall-summary');
const listWrap = document.querySelector('#hall-list');
const clearBtn = document.querySelector('#clear-hall-btn');

const render = () => {
  const records = loadHallOfFame();
  const wins = records.filter((r) => r.result === '승리').length;
  const losses = records.filter((r) => r.result === '패배').length;
  const bestScore = records.length ? Math.max(...records.map((r) => r.score)) : 0;
  const uniqueFinalEnemies = [...new Set(records.filter((r) => r.result === '승리').map((r) => r.finalEnemy))];

  summaryWrap.innerHTML = `
    <article class="guide-item"><h3>총 기록</h3><p>${records.length}회</p></article>
    <article class="guide-item"><h3>승 / 패</h3><p>${wins}승 ${losses}패</p></article>
    <article class="guide-item"><h3>최고 점수</h3><p>${bestScore}</p></article>
    <article class="guide-item"><h3>격파한 최종 적</h3><p class="small">${uniqueFinalEnemies.length ? uniqueFinalEnemies.join(', ') : '아직 없음'}</p></article>
  `;

  listWrap.innerHTML = '';
  if (!records.length) {
    listWrap.innerHTML = '<article class="guide-item"><h3>기록 없음</h3><p class="small">아직 저장된 런 결과가 없습니다.</p></article>';
    return;
  }

  records.forEach((record, idx) => {
    const node = document.createElement('article');
    node.className = 'guide-item';
    node.innerHTML = `
      <h3>${idx + 1}. ${record.result} | ${record.score}점</h3>
      <p>라운드: ${Math.min((record.round || 0) + 1, record.totalRounds || 10)} / ${record.totalRounds || 10}</p>
      <p>지역/적: ${record.finalRegion || '-'} / ${record.finalEnemy || '-'}</p>
      <p class="small">승리 기여 카드: ${(record.topCards || []).join(', ') || '기록 없음'}</p>
      <p class="small">저장 시각: ${new Date(record.createdAt).toLocaleString('ko-KR')}</p>
    `;
    listWrap.appendChild(node);
  });
};

clearBtn.addEventListener('click', () => {
  clearHallOfFame();
  render();
});

render();
