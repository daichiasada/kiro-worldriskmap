import type { RelationType } from '../domain/types';

/**
 * 代表的な起点国(G7 + 主要国)の ISO3。
 * 「この国から見た各国との関係」を表示する起点として選択できる。
 */
export const REPRESENTATIVE_COUNTRY_IDS: string[] = [
  // G7
  'USA',
  'GBR',
  'DEU',
  'FRA',
  'ITA',
  'CAN',
  'JPN',
  // 主要国(関係性の文脈で重要)
  'CHN',
  'RUS',
  'KOR',
  'IND',
];

/**
 * 既知の二国間関係(無向=対称)。キーは ISO3 を昇順で "A|B" に連結したもの。
 * 明示が無いペアは既定で neutral とする。
 *
 * 注意: 関係区分は一般的に知られる同盟/対立の構図を参考にした教育目的の分類であり、
 * 公式な外交評価ではない。
 */
const RELATION_PAIRS: Record<string, RelationType> = {};

function key(a: string, b: string): string {
  return [a, b].sort().join('|');
}

function set(a: string, b: string, rel: RelationType): void {
  RELATION_PAIRS[key(a, b)] = rel;
}

// --- 西側同盟 (NATO / 日米韓 など) ---
const WESTERN_ALLIES = ['USA', 'GBR', 'DEU', 'FRA', 'ITA', 'CAN', 'JPN', 'KOR', 'AUS'];
for (let i = 0; i < WESTERN_ALLIES.length; i++) {
  for (let j = i + 1; j < WESTERN_ALLIES.length; j++) {
    set(WESTERN_ALLIES[i], WESTERN_ALLIES[j], 'ally');
  }
}

// --- 西側 vs 露 (対立) ---
for (const w of ['USA', 'GBR', 'DEU', 'FRA', 'ITA', 'CAN', 'JPN', 'KOR', 'UKR', 'POL']) {
  set(w, 'RUS', 'rival');
}

// --- 西側主要国 vs 中 (対立寄り) ---
for (const w of ['USA', 'JPN', 'KOR', 'IND']) {
  set(w, 'CHN', 'rival');
}

// --- 中露 (接近) ---
set('CHN', 'RUS', 'ally');

// --- 対イラン / 対北系の対立(例) ---
set('USA', 'IRN', 'rival');
set('SAU', 'IRN', 'rival');
set('ISR' /* 未収録でも安全に無視される */, 'IRN', 'rival');

// --- 欧州と中国は中立〜やや慎重(明示せず neutral 既定) ---

export function getRelation(a: string, b: string): RelationType {
  if (a === b) return 'neutral';
  return RELATION_PAIRS[key(a, b)] ?? 'neutral';
}
