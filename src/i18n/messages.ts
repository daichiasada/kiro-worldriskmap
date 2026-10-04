import type { RiskBand, RiskComponentKey, RelationType } from '../domain/types';

export type Lang = 'en' | 'ja';

export interface Messages {
  // Header / nav
  appTitle: string;
  appTagline: string;
  tabs: {
    map: string;
    ranking: string;
    relations: string;
    detail: string;
    compare: string;
    sources: string;
  };
  language: string;
  // Common
  score: string;
  outOf100: string;
  region: string;
  // Map
  mapMode: string;
  modeRisk: string;
  modeRelations: string;
  riskLegend: string;
  relationLegend: string;
  sourceCountry: string;
  highestRisk: string;
  lowestAndAvg: string;
  average: string;
  mapRiskHint: string;
  mapRelationsHintPrefix: string;
  mapRelationsHintSuffix: string;
  originCountry: string;
  // Ranking
  searchPlaceholder: string;
  sortOrder: string;
  sortDesc: string;
  sortAsc: string;
  countriesCount: (n: number) => string;
  colCountry: string;
  colRelationTarget: string;
  colRelation: string;
  colBilateral: string;
  colTargetScore: string;
  risk: string;
  // Detail
  selectCountry: string;
  riskBreakdown: string;
  riskCategory: string;
  detailHint: string;
  weight: string;
  // Compare
  bilateralTitle: string;
  pickTwo: string;
  relationPremise: string;
  relationAuto: (rel: string) => string;
  overrideAlly: string;
  overrideNeutral: string;
  overrideRival: string;
  appliedRelation: string;
  autoTag: string;
  manualTag: string;
  compareHint: string;
  // Relations view
  relationsIntroPrefix: string;
  relationsIntroSuffix: string;
  relationsFootnote: string;
  // Sources
  sourcesTitle: string;
  compositeDefTitle: string;
  compositeDefBody: string;
  bandRangesLabel: string;
  indicesTitle: string;
  disclaimerLabel: string;
  disclaimerBody: string;
  // enums
  bands: Record<RiskBand, string>;
  components: Record<RiskComponentKey, string>;
  relations: Record<RelationType, string>;
}

const en: Messages = {
  appTitle: '🌐 World Geopolitical Risk Map',
  appTagline:
    'Visualizing geopolitical risk for countries and country pairs, based on public quantitative indices.',
  tabs: {
    map: 'World Map',
    ranking: 'Ranking',
    relations: 'Relations (G7+)',
    detail: 'Country Detail',
    compare: 'Compare Two',
    sources: 'Sources',
  },
  language: 'Language',
  score: 'Score',
  outOf100: '/ 100',
  region: 'Region',
  mapMode: 'Display mode:',
  modeRisk: 'Risk (composite score)',
  modeRelations: 'Relations (from a chosen country)',
  riskLegend: 'Risk legend',
  relationLegend: 'Relation legend',
  sourceCountry: 'Representative source country',
  highestRisk: 'Highest risk',
  lowestAndAvg: 'Lowest risk / average',
  average: 'avg',
  mapRiskHint:
    'Hover a country to see its score; click to open details. Grey countries have no data.',
  mapRelationsHintPrefix: 'Taking ',
  mapRelationsHintSuffix:
    ' as the origin, countries are colored by relation (rival / neutral / ally). Lines from the origin (blue) to representative countries use the relation color. Hover for bilateral risk, click for details.',
  originCountry: 'origin',
  searchPlaceholder: 'Search by country name',
  sortOrder: 'Sort order',
  sortDesc: 'Highest risk first',
  sortAsc: 'Lowest risk first',
  countriesCount: (n) => `${n} countries`,
  colCountry: 'Country',
  colRelationTarget: 'Counterpart',
  colRelation: 'Relation',
  colBilateral: 'Bilateral risk',
  colTargetScore: 'Counterpart score',
  risk: 'Risk',
  selectCountry: 'Select a country',
  riskBreakdown: 'Risk breakdown',
  riskCategory: 'Risk category:',
  detailHint:
    'The composite score is a weighted average of the components. See the Sources tab for weights and methodology.',
  weight: 'weight',
  bilateralTitle: 'Bilateral geopolitical risk score (symmetric)',
  pickTwo: 'Please select two different countries.',
  relationPremise: 'Relation premise',
  relationAuto: (rel) => `Relation: auto (${rel})`,
  overrideAlly: 'Ally — risk ×0.6 (lower)',
  overrideNeutral: 'Neutral — risk ×1.0',
  overrideRival: 'Rival — risk ×1.4 (higher)',
  appliedRelation: 'Applied relation:',
  autoTag: '[auto]',
  manualTag: '[manual override]',
  compareHint:
    'Computed from the mean of both countries\u2019 "external" and "conflict" components times a relation factor. The relation is auto-detected by default and can be overridden. Order-independent.',
  relationsIntroPrefix: 'Relations seen from ',
  relationsIntroSuffix:
    ', grouped by relation and sorted by bilateral risk (highest first).',
  relationsFootnote:
    'Relation categories (ally/neutral/rival) are an educational classification inspired by commonly understood alignments, not an official diplomatic assessment. Bilateral risk is a symmetric score. Click a row to open the counterpart\u2019s detail.',
  sourcesTitle: 'Sources & methodology',
  compositeDefTitle: 'Composite risk score',
  compositeDefBody:
    'For each country, the composite score is the weighted average of five components normalized to 0–100 (higher = higher risk). Weights sum to 1.00.',
  bandRangesLabel: 'Risk categories:',
  indicesTitle: 'Public quantitative indices referenced',
  disclaimerLabel: 'Disclaimer:',
  disclaimerBody:
    'Scores on this site are synthetic sample values for education and visualization, and do not exactly reproduce the official values of the indices above. Relative ordering is inspired by public rankings. Do not use as a basis for decisions.',
  bands: { low: 'Low', moderate: 'Moderate', high: 'High', severe: 'Severe' },
  components: {
    conflict: 'Conflict & violence',
    governance: 'Governance / political stability',
    economic: 'Economic fragility',
    external: 'External relations / geopolitical tension',
    social: 'Social cohesion',
  },
  relations: { ally: 'Ally', neutral: 'Neutral', rival: 'Rival' },
};

const ja: Messages = {
  appTitle: '🌐 World Geopolitical Risk Map',
  appTagline:
    '公開されている定量化指標に基づき、各国・国家間の地政学リスクを可視化します。',
  tabs: {
    map: '世界地図',
    ranking: 'ランキング',
    relations: '関係性 (G7等)',
    detail: '国別詳細',
    compare: '2国間比較',
    sources: '出典',
  },
  language: '言語',
  score: 'スコア',
  outOf100: '/ 100',
  region: '地域',
  mapMode: '表示モード:',
  modeRisk: 'リスク(合成スコア)',
  modeRelations: '関係(起点国から見た関係)',
  riskLegend: 'リスク凡例',
  relationLegend: '関係凡例',
  sourceCountry: '起点となる代表国',
  highestRisk: '最高リスク',
  lowestAndAvg: '最低リスク / 平均',
  average: '平均',
  mapRiskHint:
    '地図上の国にカーソルを合わせるとスコアが表示されます。クリックすると詳細を開きます。グレーの国はデータ未収録です。',
  mapRelationsHintPrefix: '',
  mapRelationsHintSuffix:
    ' を起点に、各国を関係区分(対立 / 中立 / 同盟)で色分けしています。起点国(青)から代表国への線は関係区分の色です。カーソルで二国間リスクを確認でき、クリックで相手国の詳細を開きます。',
  originCountry: '起点国',
  searchPlaceholder: '国名で検索 (例: 日本 / Japan)',
  sortOrder: '並び順',
  sortDesc: 'リスク高い順',
  sortAsc: 'リスク低い順',
  countriesCount: (n) => `${n} カ国`,
  colCountry: '国',
  colRelationTarget: '相手国',
  colRelation: '関係',
  colBilateral: '二国間リスク',
  colTargetScore: '相手国スコア',
  risk: 'リスク',
  selectCountry: '国を選択',
  riskBreakdown: 'リスク内訳',
  riskCategory: 'リスク区分:',
  detailHint:
    '合成スコアは各コンポーネントの重み付き平均です。重みと算出方法は「出典」タブを参照してください。',
  weight: '重み',
  bilateralTitle: '2国間地政学リスクスコア (対称)',
  pickTwo: '異なる2国を選択してください。',
  relationPremise: '関係の前提',
  relationAuto: (rel) => `関係: 自動判定(${rel})`,
  overrideAlly: '同盟 — リスク×0.6(低減)',
  overrideNeutral: '中立 — リスク×1.0',
  overrideRival: '対立 — リスク×1.4(増大)',
  appliedRelation: '適用中の関係:',
  autoTag: '〔自動判定〕',
  manualTag: '〔手動上書き〕',
  compareHint:
    '両国の「対外関係」「紛争・暴力」の平均に関係係数を乗じて算出します。関係は既定で2国から自動判定され、プルダウンで任意に上書きできます。国の順序には依存しません。',
  relationsIntroPrefix: '',
  relationsIntroSuffix:
    ' から見た各国との関係性です。関係区分ごとに、二国間地政学リスクスコアの高い順で並べています。',
  relationsFootnote:
    '関係区分(同盟/中立/対立)は一般に知られる同盟・対立の構図を参考にした教育目的の分類であり、公式な外交評価ではありません。二国間リスクは対称スコアです。行をクリックすると相手国の詳細を開きます。',
  sourcesTitle: '出典と算出方法',
  compositeDefTitle: '合成リスクスコアの定義',
  compositeDefBody:
    '各国について、0〜100 に正規化した 5 つのコンポーネント(高いほど高リスク)の重み付き平均を合成リスクスコアとします。重みの合計は 1.00 です。',
  bandRangesLabel: 'リスク区分:',
  indicesTitle: '参考にした公開定量化指標',
  disclaimerLabel: '免責:',
  disclaimerBody:
    '本サイトのスコアは教育・可視化を目的とした合成サンプル値であり、上記各指標の公式値を厳密に再現したものではありません。相対的な序列は公開ランキングを参考にしていますが、意思決定の根拠として用いないでください。',
  bands: { low: '低', moderate: '中', high: '高', severe: '深刻' },
  components: {
    conflict: '紛争・暴力',
    governance: 'ガバナンス/政治安定性',
    economic: '経済的脆弱性',
    external: '対外関係/地政学的緊張',
    social: '社会的結束',
  },
  relations: { ally: '同盟', neutral: '中立', rival: '対立' },
};

export const MESSAGES: Record<Lang, Messages> = { en, ja };
